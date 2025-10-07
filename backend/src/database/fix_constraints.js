const pool = require('./config');

async function fixConstraints() {
  try {
    // Add unique constraint to skill_categories name
    await pool.query('ALTER TABLE skill_categories ADD CONSTRAINT skill_categories_name_key UNIQUE (name);');
    console.log('✅ Added unique constraint to skill_categories.name');
    
    // Add unique constraint to skills name if it doesn't exist
    try {
      await pool.query('ALTER TABLE skills ADD CONSTRAINT skills_name_key UNIQUE (name);');
      console.log('✅ Added unique constraint to skills.name');
    } catch (e) {
      if (e.code === '42710') {
        console.log('ℹ️  Unique constraint on skills.name already exists');
      } else {
        throw e;
      }
    }
    
    console.log('✅ All constraints fixed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing constraints:', error.message);
    process.exit(1);
  }
}

fixConstraints();
