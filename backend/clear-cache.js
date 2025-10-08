#!/usr/bin/env node

const http = require('http');

const clearCache = () => {
  const postData = JSON.stringify({});

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/cache/clear',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.success) {
          console.log('✅ Cache cleared successfully!');
          console.log(`📅 Timestamp: ${result.timestamp}`);
        } else {
          console.error('❌ Failed to clear cache:', result.error);
        }
      } catch (error) {
        console.error('❌ Error parsing response:', error.message);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Error clearing cache:', err.message);
  });

  req.write(postData);
  req.end();
};

console.log('🗑️  Clearing cache...');
clearCache();
