#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const FormData = require('form-data');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// ANSI color codes for better CLI output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Configuration
const API_BASE_URL = 'http://localhost:5000';
const UPLOAD_ENDPOINT = `${API_BASE_URL}/api/media`;

// Load environment variables
require('dotenv').config();

// JWT token generator
function generateAuthToken() {
  const payload = {
    id: uuidv4(), // Use proper UUID
    email: 'test@example.com',
    role: 'admin',
    iat: Math.floor(Date.now() / 1000)
  };

  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  return jwt.sign(payload, secret, { expiresIn });
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Helper function to find image files
function findImageFiles(directory) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const files = [];
  
  try {
    const items = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(directory, item.name);
      
      if (item.isDirectory()) {
        // Recursively search subdirectories (limit depth to avoid too many files)
        const subFiles = findImageFiles(fullPath).slice(0, 10); // Limit to 10 files per subdirectory
        files.push(...subFiles);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (imageExtensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠️  Could not read directory: ${directory}${colors.reset}`);
  }
  
  return files;
}

// Helper function to get file size in human readable format
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to display file selection menu
function displayFileMenu(files) {
  console.log(`\n${colors.cyan}📁 Found ${files.length} image files:${colors.reset}\n`);
  
  files.forEach((file, index) => {
    try {
      const stats = fs.statSync(file);
      const size = formatFileSize(stats.size);
      const relativePath = path.relative(process.cwd(), file);
      console.log(`${colors.bright}${index + 1}.${colors.reset} ${relativePath} ${colors.yellow}(${size})${colors.reset}`);
    } catch (error) {
      console.log(`${colors.bright}${index + 1}.${colors.reset} ${file} ${colors.red}(Error reading file)${colors.reset}`);
    }
  });
  
  console.log(`\n${colors.bright}0.${colors.reset} ${colors.red}Exit${colors.reset}`);
  console.log(`${colors.bright}99.${colors.reset} ${colors.blue}Search in different directory${colors.reset}`);
}

// Helper function to validate file
function validateFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    
    if (!validExtensions.includes(ext)) {
      return { valid: false, error: 'Invalid file type. Only images are allowed.' };
    }
    
    if (stats.size > 5 * 1024 * 1024) { // 5MB limit
      return { valid: false, error: 'File too large. Maximum size is 5MB.' };
    }
    
    if (stats.size === 0) {
      return { valid: false, error: 'File is empty.' };
    }
    
    return { valid: true, size: stats.size };
  } catch (error) {
    return { valid: false, error: 'File not found or cannot be read.' };
  }
}

// Helper function to upload file
async function uploadFile(filePath, metadata = {}) {
  try {
    console.log(`\n${colors.blue}🚀 Uploading file...${colors.reset}`);
    
    // Validate file
    const validation = validateFile(filePath);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('alt_text', metadata.altText || '');
    formData.append('caption', metadata.caption || '');
    formData.append('tags', JSON.stringify(metadata.tags || []));
    
    // Make upload request
    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${metadata.token || 'mock-token'}`,
        ...formData.getHeaders()
      },
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return { success: true, data: result.data };
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Helper function to test API endpoints
async function testEndpoints() {
  console.log(`\n${colors.blue}🧪 Testing API endpoints...${colors.reset}`);
  
  try {
    // Test GET /api/media
    const response = await fetch(`${API_BASE_URL}/api/media`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✅ GET /api/media - Working${colors.reset}`);
      console.log(`   Found ${data.data.files.length} files`);
    } else {
      console.log(`${colors.red}❌ GET /api/media - Failed${colors.reset}`);
    }
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log(`${colors.green}✅ GET /api/health - Working${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ GET /api/health - Failed${colors.reset}`);
    }
    
    // Test upload endpoint with token
    const token = generateAuthToken();
    const testFormData = new FormData();
    testFormData.append('file', Buffer.from('test'), { filename: 'test.txt' });
    
    const uploadResponse = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...testFormData.getHeaders()
      },
      body: testFormData
    });
    
    if (uploadResponse.status === 400) {
      console.log(`${colors.green}✅ POST /api/media - Working (rejected invalid file as expected)${colors.reset}`);
    } else if (uploadResponse.ok) {
      console.log(`${colors.green}✅ POST /api/media - Working${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠️  POST /api/media - Status ${uploadResponse.status}${colors.reset}`);
    }
    
  } catch (error) {
    console.log(`${colors.red}❌ API test failed: ${error.message}${colors.reset}`);
  }
}

// Main function
async function main() {
  console.log(`${colors.bright}${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║                    🖼️  File Upload Test CLI                  ║
║                                                              ║
║  This tool will help you test file uploads with real images ║
║  from your device using the portfolio backend API.          ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  try {
    // Test API endpoints first
    await testEndpoints();
    
    // Ask for directory to search
    let searchDirectory = await askQuestion(`\n${colors.yellow}📁 Enter directory to search for images (or press Enter for current directory): ${colors.reset}`);
    
    if (!searchDirectory.trim()) {
      searchDirectory = process.cwd();
    }
    
    // Resolve absolute path
    searchDirectory = path.resolve(searchDirectory);
    
    if (!fs.existsSync(searchDirectory)) {
      console.log(`${colors.red}❌ Directory does not exist: ${searchDirectory}${colors.reset}`);
      process.exit(1);
    }
    
    console.log(`\n${colors.blue}🔍 Searching for images in: ${searchDirectory}${colors.reset}`);
    
    // Find image files
    const imageFiles = findImageFiles(searchDirectory);
    
    if (imageFiles.length === 0) {
      console.log(`${colors.yellow}⚠️  No image files found in the specified directory.${colors.reset}`);
      console.log(`${colors.blue}💡 Supported formats: JPG, JPEG, PNG, GIF, WebP, SVG${colors.reset}`);
      
      const tryAgain = await askQuestion(`\n${colors.yellow}Try a different directory? (y/n): ${colors.reset}`);
      if (tryAgain.toLowerCase() === 'y') {
        return main(); // Restart
      } else {
        process.exit(0);
      }
    }
    
    // Display file menu
    displayFileMenu(imageFiles);
    
    // Get user selection
    const selection = await askQuestion(`\n${colors.yellow}Select a file to upload (1-${imageFiles.length}): ${colors.reset}`);
    const fileIndex = parseInt(selection) - 1;
    
    if (selection === '0') {
      console.log(`${colors.green}👋 Goodbye!${colors.reset}`);
      process.exit(0);
    }
    
    if (selection === '99') {
      return main(); // Restart
    }
    
    if (isNaN(fileIndex) || fileIndex < 0 || fileIndex >= imageFiles.length) {
      console.log(`${colors.red}❌ Invalid selection. Please try again.${colors.reset}`);
      return main(); // Restart
    }
    
    const selectedFile = imageFiles[fileIndex];
    console.log(`\n${colors.blue}📄 Selected file: ${path.relative(process.cwd(), selectedFile)}${colors.reset}`);
    
    // Get file metadata
    const altText = await askQuestion(`${colors.yellow}Alt text (optional): ${colors.reset}`);
    const caption = await askQuestion(`${colors.yellow}Caption (optional): ${colors.reset}`);
    const tagsInput = await askQuestion(`${colors.yellow}Tags (comma-separated, optional): ${colors.reset}`);
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
    
    // Generate auth token
    const token = generateAuthToken();
    console.log(`${colors.green}🔑 Generated JWT token for authentication${colors.reset}`);
    
    // Upload file
    const uploadResult = await uploadFile(selectedFile, {
      altText,
      caption,
      tags,
      token
    });
    
    if (uploadResult.success) {
      console.log(`\n${colors.green}🎉 Upload successful!${colors.reset}`);
      console.log(`${colors.blue}📊 Upload details:${colors.reset}`);
      console.log(`   ID: ${uploadResult.data.id}`);
      console.log(`   Filename: ${uploadResult.data.filename}`);
      console.log(`   URL: ${uploadResult.data.url}`);
      console.log(`   Size: ${formatFileSize(uploadResult.data.size)}`);
      console.log(`   Storage: ${uploadResult.data.storageProvider}`);
      console.log(`   MIME Type: ${uploadResult.data.mimeType}`);
      
      // Test retrieving the uploaded file
      console.log(`\n${colors.blue}🔍 Testing file retrieval...${colors.reset}`);
      try {
        const getResponse = await fetch(`${API_BASE_URL}/api/media/${uploadResult.data.id}`);
        const getData = await getResponse.json();
        
        if (getResponse.ok) {
          console.log(`${colors.green}✅ File retrieval successful${colors.reset}`);
        } else {
          console.log(`${colors.red}❌ File retrieval failed: ${getData.error}${colors.reset}`);
        }
      } catch (error) {
        console.log(`${colors.red}❌ File retrieval error: ${error.message}${colors.reset}`);
      }
      
    } else {
      console.log(`\n${colors.red}❌ Upload failed: ${uploadResult.error}${colors.reset}`);
      
      if (uploadResult.error.includes('401') || uploadResult.error.includes('Unauthorized')) {
        console.log(`${colors.yellow}💡 Tip: You may need to provide a valid auth token${colors.reset}`);
      }
    }
    
    // Ask if user wants to upload another file
    const uploadAnother = await askQuestion(`\n${colors.yellow}Upload another file? (y/n): ${colors.reset}`);
    if (uploadAnother.toLowerCase() === 'y') {
      return main(); // Restart
    }
    
  } catch (error) {
    console.log(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
  } finally {
    rl.close();
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.green}👋 Goodbye!${colors.reset}`);
  rl.close();
  process.exit(0);
});

// Start the application
main().catch(console.error);
