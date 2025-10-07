const pool = require('../config');

async function linkSkillToProject(client, skillName, projectId, contribution, complexity) {
  // Get skill ID by name
  const { rows: skillRows } = await client.query('SELECT id FROM skills WHERE name = $1', [skillName]);
  if (skillRows.length === 0) {
    console.warn(`Skill "${skillName}" not found. Skipping.`);
    return;
  }
  
  const skillId = skillRows[0].id;
  
  // Insert skill-project relationship
  await client.query(
    `INSERT INTO skill_projects (skill_id, project_id, contribution, complexity)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (skill_id, project_id) DO UPDATE SET
       contribution = EXCLUDED.contribution,
       complexity = EXCLUDED.complexity`,
    [skillId, projectId, contribution, complexity]
  );
  
  console.log(`✅ Linked ${skillName} to project ${projectId} (${contribution})`);
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('🔗 Linking skills to projects...');

    // Get project IDs (assuming we know the new projects will have IDs 5, 6, 7, 8)
    // We'll query to get the actual IDs
    const { rows: projects } = await client.query(`
      SELECT id, title FROM projects 
      WHERE title IN (
        'E-commerce Analytics Platform',
        'Fitness Tracking Mobile App', 
        'Project Management SaaS',
        'AI Content Generation Platform'
      )
      ORDER BY id DESC
    `);

    if (projects.length === 0) {
      console.log('No new projects found. Please run seed_additional_projects.js first.');
      return;
    }

    const projectMap = {};
    projects.forEach(project => {
      if (project.title === 'E-commerce Analytics Platform') projectMap.ecommerce = project.id;
      if (project.title === 'Fitness Tracking Mobile App') projectMap.mobile = project.id;
      if (project.title === 'Project Management SaaS') projectMap.saas = project.id;
      if (project.title === 'AI Content Generation Platform') projectMap.ai = project.id;
    });

    console.log('📋 Project IDs:', projectMap);

    // Link React to multiple projects
    await linkSkillToProject(client, 'React', projectMap.ecommerce, 'Frontend Development & Data Visualization', 'Complex');
    await linkSkillToProject(client, 'React', projectMap.saas, 'Dashboard & UI Components', 'Complex');
    await linkSkillToProject(client, 'React', projectMap.ai, 'AI Interface & Visualization', 'Complex');

    // Link Node.js to multiple projects
    await linkSkillToProject(client, 'Node.js', projectMap.ecommerce, 'Backend API & Real-time Analytics', 'Complex');
    await linkSkillToProject(client, 'Node.js', projectMap.mobile, 'Mobile Backend & API', 'Medium');
    await linkSkillToProject(client, 'Node.js', projectMap.saas, 'Backend Services & Real-time Features', 'Complex');
    await linkSkillToProject(client, 'Node.js', projectMap.ai, 'ML API & Data Processing', 'Complex');

    // Link PostgreSQL to multiple projects
    await linkSkillToProject(client, 'PostgreSQL', projectMap.ecommerce, 'Analytics Database Design', 'Complex');
    await linkSkillToProject(client, 'PostgreSQL', projectMap.mobile, 'User Data & Analytics Storage', 'Medium');
    await linkSkillToProject(client, 'PostgreSQL', projectMap.saas, 'Project Data & User Management', 'Complex');
    await linkSkillToProject(client, 'PostgreSQL', projectMap.ai, 'Content & Training Data Storage', 'Complex');

    // Link TypeScript to multiple projects
    await linkSkillToProject(client, 'TypeScript', projectMap.ecommerce, 'Type-safe Frontend & API', 'Complex');
    await linkSkillToProject(client, 'TypeScript', projectMap.mobile, 'Cross-platform Mobile Development', 'Medium');
    await linkSkillToProject(client, 'TypeScript', projectMap.saas, 'Full-stack Type Safety', 'Complex');
    await linkSkillToProject(client, 'TypeScript', projectMap.ai, 'ML Pipeline & API Types', 'Complex');

    // Link UI/UX Design to multiple projects
    await linkSkillToProject(client, 'UI/UX Design', projectMap.ecommerce, 'Analytics Dashboard Design', 'Medium');
    await linkSkillToProject(client, 'UI/UX Design', projectMap.mobile, 'Mobile App Design & UX', 'Complex');
    await linkSkillToProject(client, 'UI/UX Design', projectMap.saas, 'Enterprise Dashboard Design', 'Complex');
    await linkSkillToProject(client, 'UI/UX Design', projectMap.ai, 'AI Interface Design', 'Medium');

    // Link Marketing Analytics to specific projects
    await linkSkillToProject(client, 'Marketing Analytics', projectMap.ecommerce, 'E-commerce Analytics & Insights', 'Complex');
    await linkSkillToProject(client, 'Marketing Analytics', projectMap.saas, 'User Behavior Analytics', 'Medium');
    await linkSkillToProject(client, 'Marketing Analytics', projectMap.ai, 'Content Performance Analytics', 'Medium');

    console.log('✅ Skill-project links created successfully');

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Seed skill-project links failed:', e.message);
    throw e;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
} else {
  module.exports = main;
}
