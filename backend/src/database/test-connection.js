const pool = require('./config');

async function main() {
  try {
    const { rows } = await pool.query('select now() as now');
    console.log('DB connected. Time:', rows[0].now);
    process.exit(0);
  } catch (e) {
    console.error('DB connection failed:', e.message);
    console.error(e);
    process.exit(1);
  }
}

main();


