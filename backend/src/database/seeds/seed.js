const pool = require('../config');

async function seed() {
  // Minimal seed to validate shape
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

  console.log('Seeded project id', id);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });


