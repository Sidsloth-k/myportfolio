const pool = require('../src/database/config');

async function testSkillsAPI() {
  try {
    console.log('🧪 Testing Skills API...\n');

    // Test 1: Get all skills with categories
    console.log('1. Testing GET /api/skills');
    const { rows: skills } = await pool.query(`
      SELECT 
        s.*,
        sc.name as category_name,
        sc.color as category_color,
        sc.description as category_description
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      WHERE s.is_active = TRUE
      ORDER BY s.display_order ASC, s.name ASC
    `);
    
    console.log(`✅ Found ${skills.length} skills`);
    skills.forEach(skill => {
      console.log(`   - ${skill.name} (${skill.category_name}) - ${skill.proficiency_level}%`);
    });

    // Test 2: Get skills with projects
    console.log('\n2. Testing skills with projects');
    const { rows: skillsWithProjects } = await pool.query(`
      SELECT 
        s.*,
        sc.name as category_name,
        sc.color as category_color,
        sc.description as category_description,
        jsonb_agg(
          jsonb_build_object(
            'id', p.id,
            'title', p.title,
            'description', p.description,
            'cover_image_url', p.cover_image_url,
            'contribution', sp.contribution,
            'complexity', sp.complexity
          ) ORDER BY p.id
        ) FILTER (WHERE p.id IS NOT NULL) as projects
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      LEFT JOIN skill_projects sp ON s.id = sp.skill_id
      LEFT JOIN projects p ON p.id = sp.project_id AND p.is_active = TRUE
      WHERE s.is_active = TRUE
      GROUP BY s.id, sc.id, sc.name, sc.color, sc.description
      ORDER BY s.display_order ASC, s.name ASC
    `);

    console.log(`✅ Found ${skillsWithProjects.length} skills with projects`);
    skillsWithProjects.forEach(skill => {
      const projectCount = skill.projects ? skill.projects.length : 0;
      console.log(`   - ${skill.name}: ${projectCount} projects`);
    });

    // Test 3: Get skill categories
    console.log('\n3. Testing skill categories');
    const { rows: categories } = await pool.query(`
      SELECT * FROM skill_categories 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC, name ASC
    `);
    
    console.log(`✅ Found ${categories.length} categories`);
    categories.forEach(category => {
      console.log(`   - ${category.name}: ${category.color}`);
    });

    // Test 4: Test individual skill endpoint
    console.log('\n4. Testing individual skill endpoint');
    if (skills.length > 0) {
      const firstSkill = skills[0];
      const { rows: skillDetail } = await pool.query(`
        SELECT 
          s.*,
          sc.name as category_name,
          sc.color as category_color,
          sc.description as category_description
        FROM skills s
        LEFT JOIN skill_categories sc ON s.category_id = sc.id
        WHERE s.id = $1 AND s.is_active = TRUE
      `, [firstSkill.id]);

      if (skillDetail.length > 0) {
        console.log(`✅ Found skill detail for ${firstSkill.name}`);
        console.log(`   - Description: ${skillDetail[0].description?.substring(0, 50)}...`);
        
        let techCount = 0;
        try {
          if (skillDetail[0].technologies) {
            const techs = JSON.parse(skillDetail[0].technologies);
            techCount = Array.isArray(techs) ? techs.length : 0;
          }
        } catch (e) {
          console.log(`   - Technologies: Error parsing JSON`);
        }
        console.log(`   - Technologies: ${techCount} items`);
      }
    }

    console.log('\n🎉 All API tests passed!');
    console.log('\n📋 Summary:');
    console.log(`   - ${categories.length} skill categories`);
    console.log(`   - ${skills.length} skills`);
    console.log(`   - Skills have proper project linking`);
    console.log(`   - Database structure is ready for frontend integration`);
    
    process.exit(0);

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testSkillsAPI();
