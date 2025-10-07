const pool = require('../config');

async function clearAdditionalProjects() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🧹 Clearing additional projects (keeping IDs 3 and 4)...');

    // Delete all projects except IDs 3 and 4
    const { rowCount } = await client.query(`
      DELETE FROM projects 
      WHERE id NOT IN (3, 4) AND id > 4
    `);
    
    console.log(`✅ Cleared ${rowCount} additional projects`);

    await client.query('COMMIT');
    console.log('✅ Additional projects cleared successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error clearing additional projects:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  clearAdditionalProjects().catch(err => {
    console.error(err);
    process.exit(1);
  });
} else {
  module.exports = clearAdditionalProjects;
}
