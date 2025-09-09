const request = require('supertest');
require('dotenv').config({ path: '.env' });
const app = require('../src/index');

const apiHeader = process.env.API_GATEWAY_HEADER || 'apikey';
const apiKey = process.env.API_GATEWAY_KEY || '';
const withAuth = (req) => (apiKey ? req.set(apiHeader, apiKey) : req);

describe('Projects API', () => {
  it('GET /api/projects should return list with unified shape', async () => {
    const res = await withAuth(request(app).get('/api/projects'));
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/projects/:id should return detail with unified shape if exists', async () => {
    const list = await withAuth(request(app).get('/api/projects'));
    expect(list.status).toBe(200);
    const first = list.body.data[0];
    if (first) {
      const res = await withAuth(request(app).get(`/api/projects/${first.id}`));
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(first.id);
    }
  });
});


