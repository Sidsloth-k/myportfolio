#!/usr/bin/env node

const http = require('http');

const clearCache = () => {
  const postData = JSON.stringify({});

  const base = process.env.BACKEND_BASE_URL || '';
  if (!base) {
    console.error('❌ BACKEND_BASE_URL is not set');
    process.exit(1);
  }
  const target = new URL('/api/cache/clear', base.replace(/\/$/, '/') );

  const options = {
    hostname: target.hostname,
    port: target.port || (target.protocol === 'https:' ? 443 : 80),
    path: target.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const transport = target.protocol === 'https:' ? require('https') : require('http');
  const req = transport.request(options, (res) => {
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
