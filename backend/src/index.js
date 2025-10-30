const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const apiBasePath = process.env.API_BASE_PATH || '/api';
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (!origin || allowed.length === 0 || allowed.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Optional API gateway key enforcement
const apiKeyHeader = process.env.API_GATEWAY_HEADER || 'x-api-key';
const apiGatewayKey = process.env.API_GATEWAY_KEY || '';
if (apiGatewayKey) {
  app.use((req, res, next) => {
    if (req.path === '/api/health') return next();
    const provided = req.headers[apiKeyHeader];
    if (!provided || provided !== apiGatewayKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  });
}

// Rate limiting - More lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (more lenient)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and development
    return req.path === '/api/health' || process.env.NODE_ENV === 'development';
  }
});
app.use(`${apiBasePath}/`, limiter);

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// API Routes
try {
  app.use(`${apiBasePath}/auth`, require('./routes/auth'));
  console.log('✅ Auth routes registered at /api/auth');
} catch (error) {
  console.error('❌ Error loading auth routes:', error);
}

app.use(`${apiBasePath}/projects`, require('./routes/projects'));
app.use(`${apiBasePath}/skills`, require('./routes/skills'));
app.use(`${apiBasePath}/contact`, require('./routes/contact'));
app.use(`${apiBasePath}/media`, require('./routes/media'));
app.use(`${apiBasePath}/cache`, require('./routes/cache'));

// Health check
app.get(`${apiBasePath}/health`, (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the app for use in startup script
module.exports = app; 