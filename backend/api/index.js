// Vercel serverless function entry point
const app = require('../src/index');

module.exports = (req, res) => {
  try {
    // Normalize path so Express sees bare paths like "/skills"
    req.url = req.url.replace(/^\/(api(?:\/index)?)\b/, '');
  } catch (_) {}
  return app(req, res);
};
