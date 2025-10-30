const fs = require('fs');
const FormData = require('form-data');
const jwt = require('jsonwebtoken');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testUpload() {
  try {
    // Generate token
    const token = jwt.sign({id: 'test-user', email: 'test@example.com', role: 'admin'}, '75bdf598f6b53d1176a6b52bc81b19e6', {expiresIn: '24h'});

    // Test with a real image file
    const testImagePath = 'D:/GO DIGITAL AFRICA/Birthdays/Mariam Birthday/Mariam Ali-12.jpg';
    
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ Image file not found:', testImagePath);
      return;
    }

    console.log('✅ Testing upload with real image...');
    console.log('📁 File:', testImagePath);
    console.log('📊 File size:', fs.statSync(testImagePath).size, 'bytes');

    // Read first few bytes to check signature
    const buffer = fs.readFileSync(testImagePath);
    const firstBytes = Array.from(buffer.slice(0, 8)).map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
    console.log('🔍 File signature:', firstBytes);

    // Upload
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath));
    formData.append('alt_text', 'test');
    formData.append('caption', 'test caption');
    formData.append('tags', JSON.stringify(['test', 'debug']));

    console.log('🚀 Uploading...');
    
    const baseUrl = process.env.BACKEND_BASE_URL;
    if (!baseUrl) throw new Error('BACKEND_BASE_URL is not set');
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/media`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        ...formData.getHeaders()
      },
      body: formData
    });

    const data = await response.json();
    console.log('📊 Status:', response.status);
    console.log('📄 Response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUpload();
