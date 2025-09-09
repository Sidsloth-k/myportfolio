const fs = require('fs');
const path = require('path');
const pool = require('../config');

async function runMigration(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query(sql);
}

async function main() {
  const dir = path.join(__dirname);
  const files = fs.readdirSync(dir)
    .filter(f => /\.sql$/i.test(f))
    .sort();

  for (const file of files) {
    const p = path.join(dir, file);
    console.log('Running migration', file);
    await runMigration(p);
  }
  console.log('Migrations completed');
  process.exit(0);
}

main().catch(err => {
  console.error('Migration failed', err);
  process.exit(1);
});


