const pool = require('../config');

async function upsertProject(client, project) {
  // First check if project exists
  const { rows: existing } = await client.query(
    'SELECT id FROM projects WHERE title = $1',
    [project.title]
  );

  if (existing.length > 0) {
    // Update existing project
    const { rows } = await client.query(
      `UPDATE projects SET
         category = $2, type = $3, description = $4, subtitle = $5, long_description = $6,
         timeline = $7, team = $8, role = $9, budget = $10, client = $11, 
         cover_image_url = $12, highlight = $13, updated_at = NOW()
       WHERE title = $1
       RETURNING id`,
      [
        project.title, project.category, project.type, project.description, project.subtitle, project.longDescription,
        project.timeline, project.team, project.role, project.budget, project.client, project.coverImageUrl, project.highlight
      ]
    );
    return rows[0].id;
  } else {
    // Insert new project
    const { rows } = await client.query(
      `INSERT INTO projects (title, category, type, description, subtitle, long_description,
                             timeline, team, role, budget, client, cover_image_url, highlight)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id`,
      [
        project.title, project.category, project.type, project.description, project.subtitle, project.longDescription,
        project.timeline, project.team, project.role, project.budget, project.client, project.coverImageUrl, project.highlight
      ]
    );
    return rows[0].id;
  }
}

async function addProjectLinks(client, projectId, links) {
  await client.query(
    `INSERT INTO project_links (project_id, live, github, documentation, case_study, demo)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (project_id) DO UPDATE SET
       live = EXCLUDED.live,
       github = EXCLUDED.github,
       documentation = EXCLUDED.documentation,
       case_study = EXCLUDED.case_study,
       demo = EXCLUDED.demo`,
    [projectId, links.live, links.github, links.documentation, links.caseStudy, links.demo]
  );
}

async function upsertSkill(client, { name, category, icon }) {
  const { rows } = await client.query(
    `INSERT INTO skills (name, category, icon, is_active)
     VALUES ($1, $2, $3, TRUE)
     ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, icon = EXCLUDED.icon
     RETURNING id`,
    [name, category, icon]
  );
  return rows[0].id;
}

async function addProjectTechnologies(client, projectId, technologies) {
  for (const tech of technologies) {
    const skillId = await upsertSkill(client, { name: tech.name, category: tech.category, icon: tech.icon });
    await client.query(
      `INSERT INTO project_technologies (project_id, skill_id, level)
       VALUES ($1, $2, $3)
       ON CONFLICT (project_id, skill_id) DO UPDATE SET
         level = EXCLUDED.level`,
      [projectId, skillId, tech.level]
    );
  }
}

async function addProjectImages(client, projectId, images) {
  for (const img of images) {
    await client.query(
      `INSERT INTO project_images (project_id, url, type, caption, "order")
       VALUES ($1, $2, $3, $4, $5)`,
      [projectId, img.url, img.type, img.caption, img.order]
    );
  }
}

async function addProjectFeatures(client, projectId, features) {
  for (const feature of features) {
    await client.query(
      `INSERT INTO project_features (project_id, title, description, impact, status, icon_key, "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [projectId, feature.title, feature.description, feature.impact, feature.status, feature.icon_key, feature.order]
    );
  }
}

async function addProjectMetrics(client, projectId, metrics) {
  for (const metric of metrics) {
    await client.query(
      `INSERT INTO project_metrics (project_id, key, value, "order")
       VALUES ($1, $2, $3, $4)`,
      [projectId, metric.key, metric.value, metric.order]
    );
  }
}

async function addProjectTestimonials(client, projectId, testimonials) {
  for (const testimonial of testimonials) {
    await client.query(
      `INSERT INTO project_testimonials (project_id, name, role, company, quote, rating, "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [projectId, testimonial.name, testimonial.role, testimonial.company, testimonial.quote, testimonial.rating, testimonial.order]
    );
  }
}

async function addProjectRoadmap(client, projectId, roadmap) {
  for (const phase of roadmap) {
    await client.query(
      `INSERT INTO project_roadmap_phases (project_id, phase, description, duration, status, deliverables, challenges, solutions, "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [projectId, phase.phase, phase.description, phase.duration, phase.status, phase.deliverables, phase.challenges, phase.solutions, phase.order]
    );
  }
}

async function addProjectStats(client, projectId, stats) {
  for (const stat of stats) {
    await client.query(
      `INSERT INTO project_stats (project_id, key, value, is_list_stat, "order")
       VALUES ($1, $2, $3, $4, $5)`,
      [projectId, stat.key, stat.value, stat.is_list_stat, stat.order]
    );
  }
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🌱 Creating comprehensive additional projects...');

    const projectsData = [
      {
        title: 'E-commerce Analytics Platform',
        category: 'Data Science',
        type: 'SaaS Platform',
        description: 'Advanced analytics platform for e-commerce businesses with real-time insights, customer behavior tracking, and predictive analytics.',
        subtitle: 'Empowering E-commerce Growth with Data',
        longDescription: 'This platform provides a comprehensive suite of tools for e-commerce businesses to understand their customers, optimize sales funnels, and predict market trends. It integrates with various e-commerce platforms and uses machine learning for personalized recommendations and fraud detection. The intuitive dashboard allows users to visualize key metrics, track campaign performance, and make data-driven decisions.',
        timeline: '10 months',
        team: '6 developers, 2 data scientists',
        role: 'Lead Backend Developer & Data Architect',
        budget: '$3.0M',
        client: 'Global Retail Solutions',
        coverImageUrl: 'ecommerce analytics dashboard',
        highlight: 'Data-Driven Growth',
        links: {
          live: 'https://ecommerce-analytics.com',
          demo: 'https://demo.ecommerce-analytics.com',
          caseStudy: 'https://case-study.ecommerce-analytics.com',
          github: 'https://github.com/sidney/ecommerce-analytics',
          documentation: 'https://docs.ecommerce-analytics.com'
        },
        technologies: [
          { name: 'React', category: 'Frontend', icon: '⚛️', level: '90', level_percent: 90, level_label: 'Master', level_min: 90, level_max: 100 },
          { name: 'Node.js', category: 'Backend', icon: '🟢', level: '85', level_percent: 85, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'PostgreSQL', category: 'Database', icon: '🐘', level: '90', level_percent: 90, level_label: 'Master', level_min: 90, level_max: 100 },
          { name: 'TypeScript', category: 'Language', icon: '📘', level: '95', level_percent: 95, level_label: 'Master', level_min: 90, level_max: 100 },
          { name: 'AWS', category: 'Cloud', icon: '☁️', level: '80', level_percent: 80, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'Kafka', category: 'Messaging', icon: '⚙️', level: '75', level_percent: 75, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'Spark', category: 'Big Data', icon: '✨', level: '70', level_percent: 70, level_label: 'Advanced', level_min: 61, level_max: 89 }
        ],
        images: [
          { url: 'ecommerce analytics dashboard', type: 'screenshot', caption: 'Main Analytics Dashboard', order: 1 },
          { url: 'customer segmentation', type: 'screenshot', caption: 'Customer Segmentation & Behavior', order: 2 },
          { url: 'predictive sales', type: 'screenshot', caption: 'Predictive Sales Forecasts', order: 3 },
          { url: 'real-time monitoring', type: 'screenshot', caption: 'Real-time Performance Monitoring', order: 4 },
          { url: 'mobile analytics', type: 'mobile', caption: 'Mobile Analytics Interface', order: 5 }
        ],
        features: [
          { title: 'Real-time Sales Monitoring', description: 'Track sales and revenue in real-time with customizable dashboards.', icon_key: 'activity', status: 'completed', impact: '20% faster reaction to market changes', order: 1 },
          { title: 'Customer Lifetime Value', description: 'Calculate and predict customer lifetime value for targeted marketing.', icon_key: 'users', status: 'completed', impact: '15% increase in customer retention', order: 2 },
          { title: 'Inventory Optimization', description: 'AI-driven recommendations for optimal stock levels and reorder points.', icon_key: 'package', status: 'completed', impact: '30% reduction in inventory costs', order: 3 },
          { title: 'Fraud Detection', description: 'Machine learning algorithms to detect and prevent fraudulent transactions.', icon_key: 'shield', status: 'completed', impact: '99.8% fraud detection accuracy', order: 4 }
        ],
        roadmap: [
          { phase: 'Discovery & Planning', description: 'Market research, user stories, and system architecture.', duration: '8 weeks', status: 'completed', progress_percent: 100, order: 1, deliverables: ['User personas', 'Technical architecture', 'Database design'], challenges: ['Complex data requirements', 'Performance expectations'], solutions: ['Microservices architecture', 'Advanced caching strategies'] },
          { phase: 'Core Development', description: 'Backend APIs, database, and frontend dashboard.', duration: '20 weeks', status: 'completed', progress_percent: 100, order: 2, deliverables: ['RESTful APIs', 'React dashboard', 'PostgreSQL database'], challenges: ['Real-time data processing', 'Scalability concerns'], solutions: ['WebSocket implementation', 'Horizontal scaling'] },
          { phase: 'AI & Integrations', description: 'Machine learning models and third-party platform integrations.', duration: '12 weeks', status: 'in progress', progress_percent: 75, order: 3, deliverables: ['ML models', 'Third-party APIs', 'Advanced analytics'], challenges: ['Model accuracy', 'Integration complexity'], solutions: ['Continuous training', 'Robust error handling'] }
        ],
        metrics: [
          { key: 'Conversion Rate Increase', value: '+25%', order: 1 },
          { key: 'Customer Retention', value: '+15%', order: 2 },
          { key: 'Data Processing Speed', value: '100K events/sec', order: 3 },
          { key: 'System Uptime', value: '99.9%', order: 4 },
          { key: 'User Satisfaction', value: '4.8/5', order: 5 }
        ],
        stats: [
          { key: 'Active Users', value: '10K+', is_list_stat: true, order: 1 },
          { key: 'Data Processed', value: '1TB/day', is_list_stat: true, order: 2 },
          { key: 'API Response Time', value: '<100ms', is_list_stat: true, order: 3 }
        ],
        testimonials: [
          { name: 'Jane Doe', role: 'CEO, E-Shop Inc.', company: 'E-Shop Inc.', quote: 'This platform transformed our business. The insights are invaluable!', rating: 5, order: 1 },
          { name: 'Mike Johnson', role: 'CTO, RetailTech', company: 'RetailTech', quote: 'The best analytics platform we\'ve ever used. Highly recommended!', rating: 5, order: 2 }
        ]
      },
      {
        title: 'Fitness Tracking Mobile App',
        category: 'Health & Wellness',
        type: 'Mobile Application',
        description: 'Cross-platform fitness tracking app with AI-powered workout recommendations, social features, and health analytics.',
        subtitle: 'Your Personal AI Fitness Coach',
        longDescription: 'A comprehensive mobile application designed to help users achieve their fitness goals. It features personalized workout plans generated by AI, real-time activity tracking, nutrition logging, and social sharing capabilities. The app integrates with wearables and provides detailed progress reports, making fitness engaging and accessible for everyone.',
        timeline: '12 months',
        team: '4 mobile developers, 1 AI engineer',
        role: 'Lead Mobile Developer & AI Integration',
        budget: '$2.0M',
        client: 'FitLife Solutions',
        coverImageUrl: 'fitness app interface',
        highlight: 'AI-Powered Personalization',
        links: {
          live: 'https://fitlife-app.com',
          appStore: 'https://apps.apple.com/us/app/fitlife',
          playStore: 'https://play.google.com/store/apps/details?id=com.fitlife',
          github: 'https://github.com/sidney/fitlife-app',
          documentation: 'https://docs.fitlife-app.com'
        },
        technologies: [
          { name: 'React Native', category: 'Mobile', icon: '📱', level: '90', level_percent: 90, level_label: 'Master', level_min: 90, level_max: 100 },
          { name: 'Node.js', category: 'Backend', icon: '🟢', level: '80', level_percent: 80, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'PostgreSQL', category: 'Database', icon: '🐘', level: '85', level_percent: 85, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'TypeScript', category: 'Language', icon: '📘', level: '90', level_percent: 90, level_label: 'Master', level_min: 90, level_max: 100 },
          { name: 'TensorFlow', category: 'AI/ML', icon: '🧠', level: '70', level_percent: 70, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'AWS Amplify', category: 'Cloud', icon: '☁️', level: '75', level_percent: 75, level_label: 'Advanced', level_min: 61, level_max: 89 }
        ],
        images: [
          { url: 'fitness app interface', type: 'screenshot', caption: 'Personalized Dashboard', order: 1 },
          { url: 'workout plan screen', type: 'screenshot', caption: 'AI-Generated Workout Plans', order: 2 },
          { url: 'social sharing feature', type: 'screenshot', caption: 'Social Activity Feed', order: 3 },
          { url: 'nutrition tracking', type: 'screenshot', caption: 'Nutrition Logging Interface', order: 4 },
          { url: 'progress analytics', type: 'screenshot', caption: 'Progress Analytics Dashboard', order: 5 }
        ],
        features: [
          { title: 'AI Workout Coach', description: 'Dynamic workout plans adapting to user progress and goals.', icon_key: 'zap', status: 'completed', impact: '30% higher user engagement', order: 1 },
          { title: 'Real-time Activity Tracking', description: 'Integrates with wearables for accurate tracking of steps, calories, and heart rate.', icon_key: 'activity', status: 'completed', impact: '95% data accuracy', order: 2 },
          { title: 'Nutrition Logging', description: 'Easy-to-use food diary with barcode scanner and macro tracking.', icon_key: 'apple', status: 'completed', impact: '25% better dietary adherence', order: 3 },
          { title: 'Social Challenges', description: 'Connect with friends and participate in fitness challenges.', icon_key: 'users', status: 'completed', impact: '40% increase in motivation', order: 4 }
        ],
        roadmap: [
          { phase: 'Concept & Design', description: 'User research, wireframing, and UI/UX design.', duration: '10 weeks', status: 'completed', progress_percent: 100, order: 1, deliverables: ['User personas', 'Wireframes', 'Design system'], challenges: ['Complex user flows', 'Accessibility requirements'], solutions: ['User testing', 'Accessibility guidelines'] },
          { phase: 'Mobile Development', description: 'Frontend and backend development for core features.', duration: '24 weeks', status: 'completed', progress_percent: 100, order: 2, deliverables: ['React Native app', 'Backend APIs', 'Database schema'], challenges: ['Cross-platform compatibility', 'Performance optimization'], solutions: ['Shared codebase', 'Native modules'] },
          { phase: 'AI & Advanced Features', description: 'AI integration, social features, and wearable connectivity.', duration: '16 weeks', status: 'in progress', progress_percent: 60, order: 3, deliverables: ['ML models', 'Social features', 'Wearable integration'], challenges: ['AI accuracy', 'Real-time sync'], solutions: ['Continuous learning', 'Optimized algorithms'] }
        ],
        metrics: [
          { key: 'Daily Active Users', value: '+40%', order: 1 },
          { key: 'Workout Completion Rate', value: '+20%', order: 2 },
          { key: 'App Store Rating', value: '4.8/5', order: 3 },
          { key: 'User Retention', value: '85%', order: 4 },
          { key: 'Average Session', value: '12 minutes', order: 5 }
        ],
        stats: [
          { key: 'Downloads', value: '500K+', is_list_stat: true, order: 1 },
          { key: 'Active Users', value: '50K+', is_list_stat: true, order: 2 },
          { key: 'Workouts Completed', value: '1M+', is_list_stat: true, order: 3 }
        ],
        testimonials: [
          { name: 'John Smith', role: 'Fitness Enthusiast', company: 'Individual User', quote: 'The AI coach is incredible! I\'ve never been so consistent.', rating: 5, order: 1 },
          { name: 'Sarah Wilson', role: 'Personal Trainer', company: 'FitLife Solutions', quote: 'This app has revolutionized how I train my clients.', rating: 5, order: 2 }
        ]
      },
      {
        title: 'Project Management SaaS',
        category: 'Business & Productivity',
        type: 'Web Application',
        description: 'Comprehensive project management platform with team collaboration, time tracking, and advanced reporting features.',
        subtitle: 'Streamline Your Workflow, Empower Your Team',
        longDescription: 'A robust SaaS solution for modern teams to manage projects from start to finish. It offers intuitive task management, Gantt charts, Kanban boards, real-time collaboration, and detailed analytics. Designed for scalability and flexibility, it supports agile methodologies and integrates with popular development tools, enhancing productivity across organizations.',
        timeline: '14 months',
        team: '7 full-stack developers, 2 QA engineers',
        role: 'Full-Stack Lead & DevOps Specialist',
        budget: '$4.0M',
        client: 'Enterprise Solutions Inc.',
        coverImageUrl: 'project management dashboard',
        highlight: 'Enterprise-Grade Productivity',
        links: {
          live: 'https://project-saas.com',
          demo: 'https://demo.project-saas.com',
          documentation: 'https://docs.project-saas.com',
          github: 'https://github.com/sidney/project-saas',
          caseStudy: 'https://case-study.project-saas.com'
        },
        technologies: [
          { name: 'React', category: 'Frontend', icon: '⚛️', level: '95', level_percent: 95, level_label: 'Master', level_min: 90, level_max: 100 },
          { name: 'Node.js', category: 'Backend', icon: '🟢', level: '90', level_percent: 90, level_label: 'Master', level_min: 90, level_max: 100 },
          { name: 'PostgreSQL', category: 'Database', icon: '🐘', level: '88', level_percent: 88, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'TypeScript', category: 'Language', icon: '📘', level: '92', level_percent: 92, level_label: 'Master', level_min: 90, level_max: 100 },
          { name: 'GraphQL', category: 'API', icon: '🌐', level: '85', level_percent: 85, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'Docker', category: 'DevOps', icon: '🐳', level: '80', level_percent: 80, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'Kubernetes', category: 'DevOps', icon: '☸️', level: '70', level_percent: 70, level_label: 'Advanced', level_min: 61, level_max: 89 }
        ],
        images: [
          { url: 'project management dashboard', type: 'screenshot', caption: 'Main Project Dashboard', order: 1 },
          { url: 'gantt chart view', type: 'screenshot', caption: 'Interactive Gantt Chart', order: 2 },
          { url: 'kanban board view', type: 'screenshot', caption: 'Kanban Board for Task Management', order: 3 },
          { url: 'team collaboration', type: 'screenshot', caption: 'Real-time Team Collaboration', order: 4 },
          { url: 'analytics reports', type: 'screenshot', caption: 'Advanced Analytics & Reports', order: 5 }
        ],
        features: [
          { title: 'Intuitive Task Management', description: 'Create, assign, and track tasks with customizable workflows.', icon_key: 'check-square', status: 'completed', impact: '25% increase in task completion rate', order: 1 },
          { title: 'Real-time Collaboration', description: 'Live updates, comments, and file sharing for seamless teamwork.', icon_key: 'users', status: 'completed', impact: '30% reduction in communication overhead', order: 2 },
          { title: 'Advanced Reporting', description: 'Generate custom reports on project progress, team performance, and resource allocation.', icon_key: 'bar-chart-2', status: 'completed', impact: '40% faster decision-making', order: 3 },
          { title: 'Time Tracking', description: 'Accurate time tracking with detailed analytics and billing integration.', icon_key: 'clock', status: 'completed', impact: '20% improvement in time estimation', order: 4 }
        ],
        roadmap: [
          { phase: 'Foundation & MVP', description: 'Core task management, user authentication, and basic UI.', duration: '16 weeks', status: 'completed', progress_percent: 100, order: 1, deliverables: ['User authentication', 'Task management', 'Basic UI'], challenges: ['Scalability planning', 'User experience'], solutions: ['Microservices', 'User testing'] },
          { phase: 'Advanced Features', description: 'Gantt charts, Kanban boards, and real-time collaboration.', duration: '20 weeks', status: 'completed', progress_percent: 100, order: 2, deliverables: ['Gantt charts', 'Kanban boards', 'Real-time features'], challenges: ['Complex UI', 'Real-time sync'], solutions: ['Component library', 'WebSocket optimization'] },
          { phase: 'Scalability & Integrations', description: 'Microservices architecture, third-party integrations, and performance optimization.', duration: '20 weeks', status: 'in progress', progress_percent: 80, order: 3, deliverables: ['Microservices', 'Integrations', 'Performance optimization'], challenges: ['System complexity', 'Integration testing'], solutions: ['Containerization', 'Comprehensive testing'] }
        ],
        metrics: [
          { key: 'Team Productivity Increase', value: '+35%', order: 1 },
          { key: 'Project Delivery On-time', value: '90%', order: 2 },
          { key: 'User Satisfaction', value: '4.7/5', order: 3 },
          { key: 'Time Saved', value: '15 hours/week', order: 4 },
          { key: 'Cost Reduction', value: '30%', order: 5 }
        ],
        stats: [
          { key: 'Active Projects', value: '10K+', is_list_stat: true, order: 1 },
          { key: 'Team Members', value: '50K+', is_list_stat: true, order: 2 },
          { key: 'Tasks Completed', value: '1M+', is_list_stat: true, order: 3 }
        ],
        testimonials: [
          { name: 'Emily White', role: 'Project Manager, Innovate Corp.', company: 'Innovate Corp.', quote: 'This tool has transformed how we manage projects. Highly recommended!', rating: 5, order: 1 },
          { name: 'David Chen', role: 'CTO, TechStart', company: 'TechStart', quote: 'The best project management solution we\'ve ever used.', rating: 5, order: 2 }
        ]
      },
      {
        title: 'AI Content Generation Platform',
        category: 'Artificial Intelligence',
        type: 'SaaS Platform',
        description: 'Advanced AI platform for automated content generation, natural language processing, and intelligent content optimization.',
        subtitle: 'Unleash the Power of AI for Content Creation',
        longDescription: 'A cutting-edge SaaS platform that leverages state-of-the-art AI models to generate high-quality, engaging content across various formats. It includes features for natural language understanding, sentiment analysis, and SEO optimization, helping businesses scale their content production and improve their digital presence. The platform is designed for content creators, marketers, and businesses looking to automate and enhance their content strategies.',
        timeline: '15 months',
        team: '5 AI/ML engineers, 3 full-stack developers',
        role: 'Lead AI Engineer & Platform Architect',
        budget: '$5.0M',
        client: 'Content Innovations Ltd.',
        coverImageUrl: 'ai content platform interface',
        highlight: 'Intelligent Content Automation',
        links: {
          live: 'https://ai-content-platform.com',
          demo: 'https://demo.ai-content-platform.com',
          whitepaper: 'https://whitepaper.ai-content-platform.com',
          github: 'https://github.com/sidney/ai-content-platform',
          documentation: 'https://docs.ai-content-platform.com'
        },
        technologies: [
          { name: 'Python', category: 'Language', icon: '🐍', level: '95', level_percent: 95, level_label: 'Master', level_min: 90, level_max: 100 },
          { name: 'TensorFlow', category: 'AI/ML', icon: '🧠', level: '90', level_percent: 90, level_label: 'Master', level_min: 90, level_max: 100 },
          { name: 'PyTorch', category: 'AI/ML', icon: '🔥', level: '85', level_percent: 85, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'Node.js', category: 'Backend', icon: '🟢', level: '80', level_percent: 80, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'React', category: 'Frontend', icon: '⚛️', level: '85', level_percent: 85, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'PostgreSQL', category: 'Database', icon: '🐘', level: '80', level_percent: 80, level_label: 'Advanced', level_min: 61, level_max: 89 },
          { name: 'AWS SageMaker', category: 'Cloud', icon: '☁️', level: '75', level_percent: 75, level_label: 'Advanced', level_min: 61, level_max: 89 }
        ],
        images: [
          { url: 'ai content platform interface', type: 'screenshot', caption: 'Content Generation Dashboard', order: 1 },
          { url: 'nlp analysis screen', type: 'screenshot', caption: 'Natural Language Processing & SEO', order: 2 },
          { url: 'content optimization tools', type: 'screenshot', caption: 'Intelligent Content Optimization', order: 3 },
          { url: 'ai model training', type: 'screenshot', caption: 'AI Model Training Interface', order: 4 },
          { url: 'content analytics', type: 'screenshot', caption: 'Content Performance Analytics', order: 5 }
        ],
        features: [
          { title: 'AI-Powered Content Generation', description: 'Generate articles, blog posts, marketing copy, and more with advanced AI models.', icon_key: 'feather', status: 'completed', impact: '70% faster content creation', order: 1 },
          { title: 'Natural Language Understanding', description: 'Analyze text for sentiment, keywords, and topics to refine content strategy.', icon_key: 'message-square', status: 'completed', impact: '25% improvement in content relevance', order: 2 },
          { title: 'SEO Optimization', description: 'Receive real-time SEO suggestions and optimize content for higher search rankings.', icon_key: 'trending-up', status: 'completed', impact: '40% increase in organic traffic', order: 3 },
          { title: 'Content Personalization', description: 'Generate personalized content based on audience demographics and preferences.', icon_key: 'target', status: 'completed', impact: '35% higher engagement rates', order: 4 }
        ],
        roadmap: [
          { phase: 'Research & Model Development', description: 'Explore and train state-of-the-art AI models for content generation.', duration: '20 weeks', status: 'completed', progress_percent: 100, order: 1, deliverables: ['AI models', 'Training pipeline', 'Evaluation metrics'], challenges: ['Model accuracy', 'Training time'], solutions: ['Transfer learning', 'Distributed training'] },
          { phase: 'Platform Development', description: 'Build core SaaS platform, APIs, and user interface.', duration: '24 weeks', status: 'completed', progress_percent: 100, order: 2, deliverables: ['Web platform', 'REST APIs', 'User interface'], challenges: ['Scalability', 'User experience'], solutions: ['Microservices', 'Responsive design'] },
          { phase: 'Advanced AI & Integrations', description: 'Integrate advanced NLP features, third-party tools, and scale infrastructure.', duration: '16 weeks', status: 'in progress', progress_percent: 70, order: 3, deliverables: ['Advanced NLP', 'Third-party integrations', 'Scalability improvements'], challenges: ['Complex integrations', 'Performance optimization'], solutions: ['API gateway', 'Caching strategies'] }
        ],
        metrics: [
          { key: 'Content Production Speed', value: '+70%', order: 1 },
          { key: 'Content Quality Score', value: '92%', order: 2 },
          { key: 'SEO Ranking Improvement', value: '+40%', order: 3 },
          { key: 'User Engagement', value: '+35%', order: 4 },
          { key: 'Cost Savings', value: '60%', order: 5 }
        ],
        stats: [
          { key: 'Content Generated', value: '1M+ articles', is_list_stat: true, order: 1 },
          { key: 'Active Users', value: '25K+', is_list_stat: true, order: 2 },
          { key: 'Languages Supported', value: '15+', is_list_stat: true, order: 3 }
        ],
        testimonials: [
          { name: 'David Lee', role: 'Content Strategist, Digital Marketing Co.', company: 'Digital Marketing Co.', quote: 'This platform is a game-changer for our content team. Highly efficient!', rating: 5, order: 1 },
          { name: 'Maria Rodriguez', role: 'Marketing Director, TechCorp', company: 'TechCorp', quote: 'The AI-generated content is indistinguishable from human-written content.', rating: 5, order: 2 }
        ]
      }
    ];

    for (const project of projectsData) {
      const projectId = await upsertProject(client, project);
      console.log(`   - ${project.title} (ID: ${projectId})`);
      await addProjectLinks(client, projectId, project.links);
      await addProjectTechnologies(client, projectId, project.technologies);
      await addProjectImages(client, projectId, project.images);
      await addProjectFeatures(client, projectId, project.features);
      await addProjectMetrics(client, projectId, project.metrics);
      await addProjectStats(client, projectId, project.stats);
      await addProjectTestimonials(client, projectId, project.testimonials);
      await addProjectRoadmap(client, projectId, project.roadmap);
    }

    await client.query('COMMIT');
    console.log('✅ Comprehensive additional projects created successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Seed additional projects failed:', e.message);
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