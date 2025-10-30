// Vercel serverless function entry point
const app = require('../src/index');

module.exports = (req, res) => {
  return app(req, res);
};
