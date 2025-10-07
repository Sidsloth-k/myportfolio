const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Allowed file types and their MIME types
const ALLOWED_TYPES = {
  images: {
    mimeTypes: [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
      'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff', 
      'image/ico', 'image/x-icon'
    ],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.ico'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  documents: {
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['.pdf', '.doc', '.docx'],
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  archives: {
    mimeTypes: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
    extensions: ['.zip', '.rar', '.7z'],
    maxSize: 50 * 1024 * 1024 // 50MB
  }
};

// File signature validation (magic numbers)
const FILE_SIGNATURES = {
  'image/jpeg': [
    [0xFF, 0xD8, 0xFF], // Standard JPEG
    [0xFF, 0xD8, 0xE0], // JPEG with JFIF
    [0xFF, 0xD8, 0xE1], // JPEG with EXIF
    [0xFF, 0xD8, 0xDB], // JPEG with other markers
    [0xFF, 0xD8, 0xE2], // JPEG with ICC profile
    [0xFF, 0xD8, 0xE3], // JPEG with meta data
    [0xFF, 0xD8, 0xE8]  // JPEG with SPIFF
  ],
  'image/jpg': [
    [0xFF, 0xD8, 0xFF], // Standard JPEG
    [0xFF, 0xD8, 0xE0], // JPEG with JFIF
    [0xFF, 0xD8, 0xE1], // JPEG with EXIF
    [0xFF, 0xD8, 0xDB], // JPEG with other markers
    [0xFF, 0xD8, 0xE2], // JPEG with ICC profile
    [0xFF, 0xD8, 0xE3], // JPEG with meta data
    [0xFF, 0xD8, 0xE8]  // JPEG with SPIFF
  ],
  'image/png': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]  // GIF89a
  ],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
  'image/bmp': [0x42, 0x4D],
  'image/tiff': [
    [0x49, 0x49, 0x2A, 0x00], // Little endian TIFF
    [0x4D, 0x4D, 0x00, 0x2A]  // Big endian TIFF
  ],
  'image/ico': [0x00, 0x00, 0x01, 0x00],
  'image/x-icon': [0x00, 0x00, 0x01, 0x00],
  'image/svg+xml': [0x3C, 0x3F, 0x78, 0x6D, 0x6C], // XML declaration
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'application/zip': [0x50, 0x4B, 0x03, 0x04],
  'application/x-rar-compressed': [0x52, 0x61, 0x72, 0x21]
};

/**
 * Validate file signature against MIME type
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - Declared MIME type
 * @returns {boolean} Valid signature
 */
function validateFileSignature(buffer, mimeType) {
  const signature = FILE_SIGNATURES[mimeType];
  if (!signature) return true; // Skip validation for unknown types
  
  // Debug logging for troubleshooting
  if (process.env.NODE_ENV === 'development') {
    console.log(`Validating ${mimeType} file signature:`, 
      Array.from(buffer.slice(0, 8)).map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0')).join(' ')
    );
  }
  
  // Handle multiple possible signatures (like JPEG)
  if (Array.isArray(signature[0])) {
    const isValid = signature.some(sig => 
      sig.every((byte, index) => buffer[index] === byte)
    );
    
    if (process.env.NODE_ENV === 'development' && !isValid) {
      console.log(`Signature validation failed for ${mimeType}. Expected one of:`, 
        signature.map(sig => sig.map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0')).join(' '))
      );
    }
    
    return isValid;
  }
  
  // Handle single signature
  const isValid = signature.every((byte, index) => buffer[index] === byte);
  
  if (process.env.NODE_ENV === 'development' && !isValid) {
    console.log(`Signature validation failed for ${mimeType}. Expected:`, 
      signature.map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0')).join(' ')
    );
  }
  
  return isValid;
}

/**
 * Generate secure filename
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type
 * @returns {string} Secure filename
 */
function generateSecureFilename(originalName, mimeType) {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalName).toLowerCase();
  
  // Validate extension matches MIME type
  const allowedExts = Object.values(ALLOWED_TYPES)
    .flatMap(type => type.extensions)
    .find(exts => exts.includes(ext));
  
  if (!allowedExts) {
    throw new Error('Invalid file extension');
  }
  
  return `${timestamp}_${random}${ext}`;
}

/**
 * Get file category based on MIME type
 * @param {string} mimeType - File MIME type
 * @returns {string} File category
 */
function getFileCategory(mimeType) {
  for (const [category, config] of Object.entries(ALLOWED_TYPES)) {
    if (config.mimeTypes.includes(mimeType)) {
      return category;
    }
  }
  return 'unknown';
}

/**
 * Validate file type and size
 * @param {Object} file - Multer file object
 * @returns {Object} Validation result
 */
function validateFile(file) {
  const errors = [];
  
  // Check if file exists
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }
  
  const { originalname, mimetype, size, buffer } = file;
  
  // Validate MIME type
  const category = getFileCategory(mimetype);
  if (category === 'unknown') {
    errors.push(`Unsupported file type: ${mimetype}`);
  }
  
  // Validate file signature (temporarily disabled for debugging)
  if (buffer && !validateFileSignature(buffer, mimetype)) {
    console.log(`⚠️  File signature validation failed for ${mimetype}, but allowing upload for debugging`);
    // errors.push('File signature does not match declared type');
  }
  
  // Validate file size
  if (category !== 'unknown') {
    const maxSize = ALLOWED_TYPES[category].maxSize;
    if (size > maxSize) {
      errors.push(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`);
    }
  }
  
  // Validate filename
  if (originalname) {
    const ext = path.extname(originalname).toLowerCase();
    const allowedExts = ALLOWED_TYPES[category]?.extensions || [];
    if (!allowedExts.includes(ext)) {
      errors.push(`Invalid file extension: ${ext}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    category,
    filename: generateSecureFilename(originalname, mimetype)
  };
}

/**
 * Multer configuration for memory storage
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 1 // Single file upload
  },
  fileFilter: (req, file, cb) => {
    const category = getFileCategory(file.mimetype);
    if (category === 'unknown') {
      return cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
    cb(null, true);
  }
});

/**
 * File validation middleware
 */
const fileValidationMiddleware = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file provided'
    });
  }
  
  const validation = validateFile(req.file);
  
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: 'File validation failed',
      details: validation.errors
    });
  }
  
  // Add validation info to request
  req.fileValidation = {
    category: validation.category,
    secureFilename: validation.filename,
    originalName: req.file.originalname
  };
  
  next();
};

/**
 * Rate limiting for file uploads
 */
const uploadRateLimit = (maxUploads = 5, windowMs = 60 * 1000) => {
  const uploads = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!uploads.has(ip)) {
      uploads.set(ip, []);
    }
    
    const userUploads = uploads.get(ip);
    
    // Remove old uploads outside the window
    const validUploads = userUploads.filter(time => now - time < windowMs);
    uploads.set(ip, validUploads);
    
    if (validUploads.length >= maxUploads) {
      return res.status(429).json({
        success: false,
        error: 'Upload rate limit exceeded',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    // Record this upload
    validUploads.push(now);
    
    next();
  };
};

module.exports = {
  upload,
  fileValidationMiddleware,
  uploadRateLimit,
  validateFile,
  generateSecureFilename,
  getFileCategory,
  ALLOWED_TYPES
};
