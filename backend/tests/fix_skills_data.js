const pool = require('../src/database/config');

async function fixSkillsData() {
  try {
    console.log('🔧 Fixing skills data...\n');

    // Get category mappings
    const { rows: categories } = await pool.query(`
      SELECT id, name FROM skill_categories WHERE is_active = TRUE
    `);
    
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    console.log('📋 Available categories:', Object.keys(categoryMap));

    // Update skills with proper category_id and missing fields
    const skillsToUpdate = [
      {
        name: 'React',
        category: 'Frontend',
        proficiency_level: 95,
        years_experience: '4+ years',
        description: 'Advanced React development with hooks, context, and performance optimization. Master of component architecture and state management.',
        overview: 'Expert in React ecosystem including hooks, context, and performance optimization',
        technologies: ['React 18', 'React Router', 'React Query', 'Context API', 'Custom Hooks'],
        key_achievements: ['Built 15+ production apps', 'Mentored 5 junior developers', 'Improved performance by 40%'],
        color: '#61DAFB'
      },
      {
        name: 'Node.js',
        category: 'Backend',
        proficiency_level: 90,
        years_experience: '3+ years',
        description: 'Server-side development with Express, APIs, and microservices architecture. Expert in scalable backend systems.',
        overview: 'Full-stack JavaScript development with focus on scalable backend systems',
        technologies: ['Express.js', 'RESTful APIs', 'GraphQL', 'Microservices', 'Socket.io'],
        key_achievements: ['Designed scalable APIs', 'Handled 1M+ requests/day', 'Reduced response time by 60%'],
        color: '#68A063'
      },
      {
        name: 'UI/UX Design',
        category: 'Design',
        proficiency_level: 93,
        years_experience: '3+ years',
        description: 'User-centered design with focus on accessibility and conversion optimization. Creating beautiful, functional interfaces.',
        overview: 'User experience design with focus on accessibility and conversion optimization',
        technologies: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems'],
        key_achievements: ['98% user satisfaction', 'Increased conversion by 250%', 'Created 5+ design systems'],
        color: '#FF6B6B'
      },
      {
        name: 'PostgreSQL',
        category: 'Database',
        proficiency_level: 88,
        years_experience: '3+ years',
        description: 'Advanced database design, optimization, and complex query development. Expert in data modeling and performance.',
        overview: 'Database design and optimization with focus on performance and scalability',
        technologies: ['Advanced SQL', 'Query Optimization', 'Database Design', 'Performance Tuning', 'Migrations'],
        key_achievements: ['Optimized queries by 80%', 'Managed 100GB+ databases', 'Zero data loss record'],
        color: '#336791'
      },
      {
        name: 'Marketing Analytics',
        category: 'Marketing',
        proficiency_level: 87,
        years_experience: '2+ years',
        description: 'Data-driven marketing strategies and conversion optimization. Expert in growth hacking and user acquisition.',
        overview: 'Data-driven marketing with focus on growth and conversion optimization',
        technologies: ['Google Analytics', 'Mixpanel', 'A/B Testing', 'Conversion Optimization', 'Growth Metrics'],
        key_achievements: ['340% engagement increase', '250% conversion improvement', '2M+ reach campaigns'],
        color: '#4ECDC4'
      },
      {
        name: 'TypeScript',
        category: 'Language',
        proficiency_level: 92,
        years_experience: '3+ years',
        description: 'Type-safe development with advanced TypeScript patterns and tooling. Master of complex type systems.',
        overview: 'Type-safe development with advanced TypeScript patterns and tooling',
        technologies: ['Advanced Types', 'Generics', 'Utility Types', 'Type Guards', 'Declaration Files'],
        key_achievements: ['99% type coverage', 'Reduced runtime errors by 70%', 'Created reusable type libraries'],
        color: '#3178C6'
      }
    ];

    for (const skillData of skillsToUpdate) {
      const categoryId = categoryMap[skillData.category];
      if (!categoryId) {
        console.log(`❌ Category not found for ${skillData.name}: ${skillData.category}`);
        continue;
      }

      await pool.query(`
        UPDATE skills SET 
          category_id = $1,
          proficiency_level = $2,
          years_experience = $3,
          description = $4,
          overview = $5,
          technologies = $6,
          key_achievements = $7,
          color = $8,
          updated_at = NOW()
        WHERE name = $9
      `, [
        categoryId,
        skillData.proficiency_level,
        skillData.years_experience,
        skillData.description,
        skillData.overview,
        JSON.stringify(skillData.technologies),
        JSON.stringify(skillData.key_achievements),
        skillData.color,
        skillData.name
      ]);

      console.log(`✅ Updated ${skillData.name} (${skillData.category})`);
    }

    console.log('\n🎉 Skills data fixed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixSkillsData();
