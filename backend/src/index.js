const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const apiBasePath = process.env.API_BASE_PATH !== undefined ? process.env.API_BASE_PATH : '/api';
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());

// CORS: open in development, strict in production
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: (origin, callback) => {
      const sources = [
        process.env.CORS_ALLOWED_ORIGINS,
        process.env.FRONTEND_URLS,
        process.env.FRONTEND_URL,
        process.env.ADMIN_URLS,
        process.env.ADMIN_URL,
        process.env.BACKEND_PUBLIC_URL,
        process.env.BACKEND_BASE_URL,
      ].filter(Boolean);
      const allowed = sources
        .flatMap(s => String(s).split(','))
        .map(s => s.trim().replace(/\/$/, ''))
        .filter(Boolean);
      const requestOrigin = origin ? origin.replace(/\/$/, '') : '';

      if (!origin) {
        // Allow server-to-server or tools with no Origin
        return callback(null, true);
      }
      if (allowed.length === 0 || allowed.includes(requestOrigin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
} else {
  // Development: allow all origins for easier local testing
  app.use(cors({ origin: true, credentials: true }));
}
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Optional API gateway key enforcement
const apiKeyHeader = process.env.API_GATEWAY_HEADER || 'x-api-key';
const apiGatewayKey = process.env.API_GATEWAY_KEY || '';
if (apiGatewayKey) {
  app.use((req, res, next) => {
    if (req.path === `${apiBasePath}/health`) return next();
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
    return req.path === `${apiBasePath}/health` || process.env.NODE_ENV === 'production';
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

// Root route: list all registered routes
const listRoutesHandler = (req, res) => {
  const routes = [];
  app._router.stack.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods)
        .filter((m) => layer.route.methods[m])
        .map((m) => m.toUpperCase());
      routes.push({ path: layer.route.path, methods });
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      layer.handle.stack.forEach((sub) => {
        if (sub.route && sub.route.path) {
          const methods = Object.keys(sub.route.methods)
            .filter((m) => sub.route.methods[m])
            .map((m) => m.toUpperCase());
          // Prefix might be in layer.regexp; show as-is for simplicity
          routes.push({ path: sub.route.path, methods });
        }
      });
    }
  });
  res.json({
    basePath: apiBasePath || '/',
    count: routes.length,
    routes: routes.sort((a, b) => a.path.localeCompare(b.path))
  });
};

// Expose at root and at API base path without trailing slash
app.get('/', listRoutesHandler);
if (apiBasePath && apiBasePath !== '/') {
  app.get(apiBasePath, listRoutesHandler);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the app for use in startup script
module.exports = app; 