// Vercel serverless function entry point
const app = require('../src/index');

module.exports = (req, res) => {
  try {
    // Prefer explicitly forwarded path from rewrite: /api/index?path=$1
    // Fallback to stripping /api or /api/index if no path query is present.
    const originalUrl = typeof req.url === 'string' && req.url.length > 0 ? req.url : '/';
    const parsed = new URL(originalUrl, 'http://internal');
    const forwardedPath = parsed.searchParams.get('path');

    if (forwardedPath !== null) {
      // Build new query string without the "path" param
      parsed.searchParams.delete('path');
      const remainingQuery = parsed.searchParams.toString();

      let normalizedPath = forwardedPath || '';
      if (normalizedPath === '') normalizedPath = '/';
      if (normalizedPath.charAt(0) !== '/') normalizedPath = '/' + normalizedPath;

      req.url = remainingQuery ? `${normalizedPath}?${remainingQuery}` : normalizedPath;
    } else {
      // Backward-compatible normalization for direct invocations
      const qIndex = originalUrl.indexOf('?');
      const pathOnly = qIndex === -1 ? originalUrl : originalUrl.slice(0, qIndex);
      const queryOnly = qIndex === -1 ? '' : originalUrl.slice(qIndex);

      let normalizedPath = pathOnly
        .replace(/^\/(api\/index)(?=\/|$)/, '')
        .replace(/^\/(api)(?=\/|$)/, '');

      if (!normalizedPath || normalizedPath === '') {
        normalizedPath = '/';
      }
      if (normalizedPath.charAt(0) !== '/') {
        normalizedPath = '/' + normalizedPath;
      }
      req.url = normalizedPath + queryOnly;
    }
  } catch (_) {
    // Fall back to root on any unexpected error
    req.url = '/';
  }
  return app(req, res);
};
