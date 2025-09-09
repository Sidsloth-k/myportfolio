const http = require('http');
const app = require('./src/index');
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});


