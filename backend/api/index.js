// Vercel serverless function entry point
const app = require('../src/index');

module.exports = (req, res) => {
  try {
    // Normalize the URL so the Express app (mounted at optional base path)
    // receives clean paths like "/", "/skills", "/projects", etc.
    // Vercel may invoke this function as "/api/index" or "/api/index/*"
    // based on rewrites; strip those prefixes and ensure leading slash.
    const originalUrl = typeof req.url === 'string' && req.url.length > 0 ? req.url : '/';

    // Split path and query to avoid accidentally altering query strings
    const qIndex = originalUrl.indexOf('?');
    const pathOnly = qIndex === -1 ? originalUrl : originalUrl.slice(0, qIndex);
    const queryOnly = qIndex === -1 ? '' : originalUrl.slice(qIndex);

    // Remove a single leading "/api/index" or "/api" prefix if present
    let normalizedPath = pathOnly
      .replace(/^\/(api\/index)(?=\/|$)/, '')
      .replace(/^\/(api)(?=\/|$)/, '');

    // Ensure path is at least "/"
    if (!normalizedPath || normalizedPath === '') {
      normalizedPath = '/';
    }

    // Ensure leading slash
    if (normalizedPath.charAt(0) !== '/') {
      normalizedPath = '/' + normalizedPath;
    }

    req.url = normalizedPath + queryOnly;
  } catch (_) {
    // Fall back to root on any unexpected error
    req.url = '/';
  }
  return app(req, res);
};
