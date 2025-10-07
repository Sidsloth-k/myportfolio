const pool = require('../config');

async function upsertSkillCategory(client, { name, description, color, icon, display_order }) {
  const upsert = await client.query(`
    INSERT INTO skill_categories (name, description, color, icon, display_order, is_active)
    VALUES ($1, $2, $3, $4, $5, TRUE)
    ON CONFLICT (name) DO UPDATE SET 
      description = EXCLUDED.description,
      color = EXCLUDED.color,
      icon = EXCLUDED.icon,
      display_order = EXCLUDED.display_order,
      updated_at = NOW()
    RETURNING id
  `, [name, description || null, color || null, icon || null, display_order || 0]);
  return upsert.rows[0].id;
}

async function upsertSkill(client, { name, description, proficiency_level, category, icon_key, years_experience, overview, technologies, key_achievements, color, display_order }) {
  const upsert = await client.query(`
    INSERT INTO skills (
      name, description, proficiency_level, category, icon_key, 
      years_experience, overview, technologies, key_achievements, 
      color, display_order, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
    ON CONFLICT (name) DO UPDATE SET 
      description = EXCLUDED.description,
      proficiency_level = EXCLUDED.proficiency_level,
      category = EXCLUDED.category,
      icon_key = EXCLUDED.icon_key,
      years_experience = EXCLUDED.years_experience,
      overview = EXCLUDED.overview,
      technologies = EXCLUDED.technologies,
      key_achievements = EXCLUDED.key_achievements,
      color = EXCLUDED.color,
      display_order = EXCLUDED.display_order,
      updated_at = NOW()
    RETURNING id
  `, [
    name, description, proficiency_level, category, icon_key,
    years_experience, overview, 
    JSON.stringify(technologies || []), 
    JSON.stringify(key_achievements || []),
    color, display_order || 0
  ]);
  return upsert.rows[0].id;
}

async function main() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // First, ensure skill categories exist
    const frontendCategoryId = await upsertSkillCategory(client, {
      name: 'Frontend',
      description: 'Frontend development and user interface skills',
      color: '#3B82F6',
      icon: 'Code',
      display_order: 1
    });

    const backendCategoryId = await upsertSkillCategory(client, {
      name: 'Backend',
      description: 'Backend development and server-side skills',
      color: '#10B981',
      icon: 'Server',
      display_order: 2
    });

    const databaseCategoryId = await upsertSkillCategory(client, {
      name: 'Database',
      description: 'Database management and data skills',
      color: '#8B5CF6',
      icon: 'Database',
      display_order: 3
    });

    const designCategoryId = await upsertSkillCategory(client, {
      name: 'Design',
      description: 'User experience and visual design skills',
      color: '#F59E0B',
      icon: 'Palette',
      display_order: 4
    });

    const marketingCategoryId = await upsertSkillCategory(client, {
      name: 'Marketing',
      description: 'Digital marketing and growth strategies',
      color: '#EF4444',
      icon: 'TrendingUp',
      display_order: 5
    });

    const languageCategoryId = await upsertSkillCategory(client, {
      name: 'Language',
      description: 'Programming languages and frameworks',
      color: '#06B6D4',
      icon: 'Star',
      display_order: 6
    });

    // Seed skills with data that matches frontend expectations
    const skills = [
      {
        name: 'React',
        description: 'Advanced React development with hooks, context, and performance optimization. Master of component architecture and state management.',
        proficiency_level: 95,
        category: 'Frontend',
        icon_key: 'Code',
        years_experience: '4+ years',
        overview: 'Expert in React ecosystem including hooks, context, and performance optimization',
        technologies: ['React 18', 'React Router', 'React Query', 'Context API', 'Custom Hooks'],
        key_achievements: ['Built 15+ production apps', 'Mentored 5 junior developers', 'Improved performance by 40%'],
        color: '#61DAFB',
        display_order: 1
      },
      {
        name: 'Node.js',
        description: 'Server-side development with Express, APIs, and microservices architecture. Expert in scalable backend systems.',
        proficiency_level: 90,
        category: 'Backend',
        icon_key: 'Zap',
        years_experience: '3+ years',
        overview: 'Full-stack JavaScript development with focus on scalable backend systems',
        technologies: ['Express.js', 'RESTful APIs', 'GraphQL', 'Microservices', 'Socket.io'],
        key_achievements: ['Designed scalable APIs', 'Handled 1M+ requests/day', 'Reduced response time by 60%'],
        color: '#68A063',
        display_order: 1
      },
      {
        name: 'UI/UX Design',
        description: 'User-centered design with focus on accessibility and conversion optimization. Creating beautiful, functional interfaces.',
        proficiency_level: 93,
        category: 'Design',
        icon_key: 'Palette',
        years_experience: '3+ years',
        overview: 'User experience design with focus on accessibility and conversion optimization',
        technologies: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems'],
        key_achievements: ['98% user satisfaction', 'Increased conversion by 250%', 'Created 5+ design systems'],
        color: '#FF6B6B',
        display_order: 1
      },
      {
        name: 'PostgreSQL',
        description: 'Advanced database design, optimization, and complex query development. Expert in data modeling and performance.',
        proficiency_level: 88,
        category: 'Database',
        icon_key: 'Target',
        years_experience: '3+ years',
        overview: 'Database design and optimization with focus on performance and scalability',
        technologies: ['Advanced SQL', 'Query Optimization', 'Database Design', 'Performance Tuning', 'Migrations'],
        key_achievements: ['Optimized queries by 80%', 'Managed 100GB+ databases', 'Zero data loss record'],
        color: '#336791',
        display_order: 1
      },
      {
        name: 'Marketing Analytics',
        description: 'Data-driven marketing strategies and conversion optimization. Expert in growth hacking and user acquisition.',
        proficiency_level: 87,
        category: 'Marketing',
        icon_key: 'TrendingUp',
        years_experience: '2+ years',
        overview: 'Data-driven marketing with focus on growth and conversion optimization',
        technologies: ['Google Analytics', 'Mixpanel', 'A/B Testing', 'Conversion Optimization', 'Growth Metrics'],
        key_achievements: ['340% engagement increase', '250% conversion improvement', '2M+ reach campaigns'],
        color: '#4ECDC4',
        display_order: 1
      },
      {
        name: 'TypeScript',
        description: 'Type-safe development with advanced TypeScript patterns and tooling. Master of complex type systems.',
        proficiency_level: 92,
        category: 'Language',
        icon_key: 'Star',
        years_experience: '3+ years',
        overview: 'Type-safe development with advanced TypeScript patterns and tooling',
        technologies: ['Advanced Types', 'Generics', 'Utility Types', 'Type Guards', 'Declaration Files'],
        key_achievements: ['99% type coverage', 'Reduced runtime errors by 70%', 'Created reusable type libraries'],
        color: '#3178C6',
        display_order: 1
      }
    ];

    for (const skill of skills) {
      await upsertSkill(client, skill);
    }

    await client.query('COMMIT');
    console.log('✅ Skills seeded successfully');
    process.exit(0);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', e.message);
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
  }
}

main();
