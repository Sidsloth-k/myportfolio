const fs = require('fs');
const path = require('path');
const pool = require('../config');

async function runAdminUsersMigration() {
  try {
    const migrationPath = path.join(__dirname, '012_create_admin_users.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await pool.query(sql);
    console.log('Admin users migration completed successfully');
  } catch (error) {
    if (error.code === '42P07') {
      // Table already exists
      console.log('Admin users table already exists, skipping...');
    } else {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}

async function main() {
  try {
    await runAdminUsersMigration();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runAdminUsersMigration };

