const pool = require('../config');
const { spawn } = require('child_process');
const path = require('path');

async function runMigration() {
  const fs = require('fs');
  
  try {
    // Run migration 002
    const migrationPath002 = path.join(__dirname, '..', 'migrations', '002_enhance_skills.sql');
    const migrationSQL002 = fs.readFileSync(migrationPath002, 'utf8');
    await pool.query(migrationSQL002);
    console.log('✅ Migration 002_enhance_skills.sql executed successfully');
    
    // Run migration 003
    const migrationPath003 = path.join(__dirname, '..', 'migrations', '003_remove_category_id.sql');
    const migrationSQL003 = fs.readFileSync(migrationPath003, 'utf8');
    await pool.query(migrationSQL003);
    console.log('✅ Migration 003_remove_category_id.sql executed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

async function runSeedFile(seedFileName) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [path.join(__dirname, seedFileName)], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Seed file ${seedFileName} failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function seed() {
  try {
    // Run migration first
    await runMigration();
    
    // Run skill categories seed
    console.log('🌱 Seeding skill categories...');
    await runSeedFile('seed_skill_categories.js');
    
    // Run skills seed
    console.log('🌱 Seeding skills...');
    await runSeedFile('seed_skills.js');
    
    // Run existing project seed
    console.log('🌱 Seeding projects...');
    const { rows } = await pool.query(
      `INSERT INTO projects (title, category, type, description, cover_image_url, highlight)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [
        'Detective Case Management System',
        'it',
        'Full-Stack Application',
        'A comprehensive case management system for detective agencies...',
        'https://example.com/images/detective-dashboard.jpg',
        'Primary Focus'
      ]
    );
    const id = rows[0].id;

    await pool.query(
      `INSERT INTO project_links (project_id, live, github)
       VALUES ($1, $2, $3) ON CONFLICT (project_id) DO UPDATE SET live = EXCLUDED.live, github = EXCLUDED.github`,
      [id, 'https://detective-system-demo.com', 'https://github.com/sidney/detective-system']
    );

    // Run additional projects seed
    console.log('🌱 Seeding additional projects...');
    await runSeedFile('seed_additional_projects.js');
    
    // Run skill-project links seed
    console.log('🌱 Linking skills to projects...');
    await runSeedFile('seed_skill_project_links.js');

    console.log('✅ All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed().catch(err => { console.error(err); process.exit(1); });


