const pool = require('../config');

async function upsertTechnology(client, { name, category, icon }) {
  const upsert = await client.query(
    `INSERT INTO technologies (name, category, icon)
     VALUES ($1, $2, $3)
     ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, icon = EXCLUDED.icon
     RETURNING id`,
    [name, category, icon || null]
  );
  return upsert.rows[0].id;
}

async function upsertSkill(client, { name, category, color, icon_key }) {
  const upsert = await client.query(
    `INSERT INTO skills (name, category, color, icon_key)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category
     RETURNING id`,
    [name, category, color || null, icon_key || null]
  );
  return upsert.rows[0].id;
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert project base
    const projectBase = {
      title: 'Detective Case Management System',
      category: 'it',
      type: 'Full-Stack Application',
      description: 'A comprehensive case management system for detective agencies, featuring real-time collaboration, evidence tracking, and advanced analytics powered by AI.',
      subtitle: 'Enterprise-Grade Investigation Platform',
      long_description: 'This revolutionary system transforms how detective agencies handle cases, from initial reporting to final resolution. Built with modern technologies and inspired by the methodical approach of the Armed Detective Agency, it provides investigators with powerful tools for case management, evidence analysis, and team collaboration. The system incorporates advanced AI algorithms for pattern recognition, blockchain technology for evidence integrity, and real-time communication protocols for seamless team coordination.',
      timeline: '8 months',
      team: '5 developers',
      role: 'Lead Full-Stack Developer & System Architect',
      budget: '$2.5M',
      client: 'Yokohama Police Department',
      cover_image_url: 'detective dashboard system interface',
      highlight: 'Primary Focus',
    };

    const inserted = await client.query(
      `INSERT INTO projects (title, category, type, description, subtitle, long_description, timeline, team, role, budget, client, cover_image_url, highlight)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING id`,
      [
        projectBase.title,
        projectBase.category,
        projectBase.type,
        projectBase.description,
        projectBase.subtitle,
        projectBase.long_description,
        projectBase.timeline,
        projectBase.team,
        projectBase.role,
        projectBase.budget,
        projectBase.client,
        projectBase.cover_image_url,
        projectBase.highlight,
      ]
    );
    const projectId = inserted.rows[0].id;

    // Links
    await client.query(
      `INSERT INTO project_links (project_id, live, github, documentation, case_study, demo)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (project_id) DO UPDATE SET live=EXCLUDED.live, github=EXCLUDED.github, documentation=EXCLUDED.documentation, case_study=EXCLUDED.case_study, demo=EXCLUDED.demo`,
      [
        projectId,
        'https://detective-system-demo.com',
        'https://github.com/sidney/detective-system',
        'https://docs.detective-system.com',
        'https://case-study.detective-system.com',
        'https://case-study.detective-system.com',
      ]
    );

    // Images (using the labels as provided in frontend as url placeholders)
    const images = [
      { url: 'detective dashboard main interface', caption: 'Main Dashboard - Case Overview with Real-time Updates', type: 'screenshot' },
      { url: 'evidence management system', caption: 'Blockchain-Verified Evidence Management System', type: 'screenshot' },
      { url: 'real time collaboration interface', caption: 'Real-time Collaboration Tools with Live Chat', type: 'screenshot' },
      { url: 'analytics dashboard charts', caption: 'AI-Powered Analytics Dashboard with Predictive Insights', type: 'screenshot' },
      { url: 'mobile responsive design', caption: 'Mobile-First Responsive Design for Field Work', type: 'mobile' },
      { url: 'system architecture diagram', caption: 'Microservices Architecture Overview', type: 'diagram' },
      { url: 'user interface mockups', caption: 'UI/UX Design Process and User Journey Maps', type: 'design' },
      { url: 'security features interface', caption: 'Advanced Security Features and Access Control', type: 'screenshot' },
    ];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await client.query(
        `INSERT INTO project_images (project_id, url, caption, type, "order") VALUES ($1,$2,$3,$4,$5)`,
        [projectId, img.url, img.caption, img.type, i + 1]
      );
    }

    // Technologies
    const techList = [
      { name: 'React', category: 'Frontend', level: 45, icon: '⚛️' },
      { name: 'TypeScript', category: 'Language', level: 95, icon: '📘' },
      { name: 'Node.js', category: 'Backend', level: 60, icon: '🟢' },
      { name: 'PostgreSQL', category: 'Database', level: 85, icon: '🐘' },
      { name: 'Socket.io', category: 'Real-time', level: 7, icon: '⚡' },
      { name: 'AWS', category: 'Cloud', level: 85, icon: '☁️' },
      { name: 'Docker', category: 'DevOps', level: 90, icon: '🐳' },
      { name: 'Redis', category: 'Caching', level: 50, icon: '🔴' },
    ];
    for (const t of techList) {
      const techId = await upsertTechnology(client, t);
      await client.query(
        `INSERT INTO project_technologies (project_id, technology_id, level)
         VALUES ($1,$2,$3)
         ON CONFLICT (project_id, technology_id) DO UPDATE SET level = EXCLUDED.level`,
        [projectId, techId, t.level]
      );
    }

    // Features (store lucide icon keys as kebab-case names)
    const features = [
      { title: 'Real-time Collaboration', description: 'Multiple investigators can work on cases simultaneously with live updates, instant messaging, and shared workspaces', icon_key: 'users', status: 'completed', impact: '65% faster case resolution' },
      { title: 'Blockchain Evidence Chain', description: 'Immutable evidence tracking with cryptographic verification and tamper-proof audit logs', icon_key: 'check-circle', status: 'completed', impact: '100% evidence integrity' },
      { title: 'AI-Powered Analytics', description: 'Machine learning algorithms for pattern recognition, case correlation, and predictive insights', icon_key: 'zap', status: 'completed', impact: '78% improvement in case connections' },
      { title: 'Advanced Search & Filtering', description: 'Elasticsearch-powered search across all case data, evidence, and historical records', icon_key: 'target', status: 'completed', impact: 'Sub-second search results' },
      { title: 'Mobile Investigation Tools', description: 'Field-optimized mobile interface with offline capabilities and GPS integration', icon_key: 'eye', status: 'completed', impact: '40% increase in field productivity' },
      { title: 'Automated Reporting', description: 'AI-generated case summaries, progress reports, and evidence documentation', icon_key: 'trending-up', status: 'completed', impact: '80% reduction in report generation time' },
    ];
    for (let i = 0; i < features.length; i++) {
      const f = features[i];
      await client.query(
        `INSERT INTO project_features (project_id, title, description, icon_key, status, impact, "order")
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [projectId, f.title, f.description, f.icon_key, f.status, f.impact, i + 1]
      );
    }

    // Roadmap (3 phases)
    const roadmap = [
      {
        phase: 'Planning & Foundation',
        duration: '12 weeks',
        description: 'Comprehensive research, system architecture design, and foundation development including user research, technical planning, database schema, API development, and core backend infrastructure.',
        deliverables: [
          'User personas & journey maps',
          'System architecture diagrams',
          'Database schema & API specs',
          'Security protocols & authentication',
          'Core backend services',
          'Database implementation',
          'Authentication system',
          'Basic API endpoints',
        ],
        status: 'completed (100%)',
        challenges: [
          'Complex user workflows',
          'Security compliance requirements',
          'Scalability planning',
          'Performance optimization requirements',
        ],
        solutions: [
          'Extensive user testing',
          'Security expert partnerships',
          'Microservices architecture',
          'Advanced indexing strategies',
        ],
      },
      {
        phase: 'Development & Integration',
        duration: '20 weeks',
        description: 'Full-scale development of frontend and backend systems, real-time features implementation, AI integration, and comprehensive testing including React application, component libraries, advanced features, and system integration.',
        deliverables: [
          'Complete React application',
          'Component library & design system',
          'Real-time collaboration features',
          'AI analytics engine',
          'Blockchain evidence system',
          'Advanced search functionality',
          'Mobile responsive design',
          'Integration testing',
        ],
        status: 'completed (100%)',
        challenges: [
          'Complex UI interactions',
          'Real-time synchronization',
          'AI model accuracy',
          'Cross-platform compatibility',
        ],
        solutions: [
          'Component virtualization',
          'WebSocket optimization',
          'Continuous model training',
          'Progressive web app features',
        ],
      },
      {
        phase: 'Testing & Deployment',
        duration: '8 weeks',
        description: 'Comprehensive testing, performance optimization, security audits, production deployment, and user training including load testing, security certification, documentation, and post-launch support.',
        deliverables: [
          'Comprehensive test coverage (95%+)',
          'Performance optimization',
          'Security audit & certification',
          'Production deployment',
          'User documentation & training',
          'Monitoring & analytics setup',
          'Support system implementation',
          'Backup & recovery procedures',
        ],
        status: 'in progress (3%)',
        challenges: [
          'Load testing at enterprise scale',
          'Security certification process',
          'User adoption & training',
          'Production environment setup',
        ],
        solutions: [
          'Cloud-based testing infrastructure',
          'Third-party security audits',
          'Comprehensive training programs',
          'Gradual deployment strategy',
        ],
      },
    ];
    for (let i = 0; i < roadmap.length; i++) {
      const p = roadmap[i];
      await client.query(
        `INSERT INTO project_roadmap_phases (project_id, phase, description, duration, status, deliverables, challenges, solutions, "order")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [projectId, p.phase, p.description, p.duration, p.status, p.deliverables, p.challenges, p.solutions, i + 1]
      );
    }

    // Stats (list-level)
    const stats = [
      { key: 'users', value: '500+', is_list_stat: true },
      { key: 'performance', value: '99.9%', is_list_stat: true },
      { key: 'data', value: '10TB+', is_list_stat: true },
    ];
    for (let i = 0; i < stats.length; i++) {
      const s = stats[i];
      await client.query(
        `INSERT INTO project_stats (project_id, key, value, is_list_stat, "order") VALUES ($1,$2,$3,$4,$5)`,
        [projectId, s.key, s.value, s.is_list_stat, i + 1]
      );
    }

    // Metrics
    const metrics = {
      'Case Resolution Time': '-65%',
      'User Adoption Rate': '98%',
      'System Uptime': '99.97%',
      'User Satisfaction': '4.9/5',
      'Data Processing Speed': '+340%',
      'Security Incidents': '0',
      'Cost Savings': '$1.2M/year',
      'Training Time': '-50%'
    };
    let order = 1;
    for (const [key, value] of Object.entries(metrics)) {
      await client.query(
        `INSERT INTO project_metrics (project_id, key, value, "order") VALUES ($1,$2,$3,$4)`,
        [projectId, key, String(value), order++]
      );
    }

    // Testimonials
    const testimonials = [
      { name: 'Inspector Tanaka', role: 'Lead Detective, Yokohama PD', company: 'Yokohama Police Department', quote: 'This system has revolutionized our investigation process. Case resolution times have improved dramatically.', rating: 5 },
      { name: 'Chief Commissioner Sato', role: 'Yokohama Police Chief', company: 'Yokohama Police Department', quote: "The best investment we've made in technology. The AI insights have helped solve cases we thought were cold.", rating: 5 }
    ];
    for (let i = 0; i < testimonials.length; i++) {
      const t = testimonials[i];
      await client.query(
        `INSERT INTO project_testimonials (project_id, name, role, company, quote, rating, "order")
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [projectId, t.name, t.role, t.company, t.quote, t.rating, i + 1]
      );
    }

    // Skills cross-links (subset to match frontend references)
    const skillRefs = [
      { name: 'React', category: 'Frontend', contribution: 'Lead Frontend Developer', complexity: 'Complex' },
      { name: 'Node.js', category: 'Backend', contribution: 'Backend Architecture', complexity: 'Complex' },
      { name: 'UI/UX Design', category: 'Design', contribution: 'UX Consultant', complexity: 'Medium' },
      { name: 'PostgreSQL', category: 'Database', contribution: 'Database Architect', complexity: 'Complex' },
      { name: 'Marketing Analytics', category: 'Marketing', contribution: 'User Analytics', complexity: 'Medium' },
      { name: 'TypeScript', category: 'Language', contribution: 'Type System Design', complexity: 'Complex' },
    ];
    for (const s of skillRefs) {
      const skillId = await upsertSkill(client, { name: s.name, category: s.category });
      await client.query(
        `INSERT INTO skill_projects (skill_id, project_id, contribution, complexity)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (skill_id, project_id) DO UPDATE SET contribution = EXCLUDED.contribution, complexity = EXCLUDED.complexity`,
        [skillId, projectId, s.contribution, s.complexity]
      );
    }

    await client.query('COMMIT');
    console.log('Seeded Detective Case Management System with id', projectId);
    process.exit(0);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', e.message);
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
  }
}

main();


