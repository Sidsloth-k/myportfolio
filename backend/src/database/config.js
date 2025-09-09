const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: Number(process.env.PG_POOL_MAX || 10),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS || 30000),
});

pool.on('error', (err) => {
  console.error('Unexpected PG pool error', err);
});

module.exports = pool;


