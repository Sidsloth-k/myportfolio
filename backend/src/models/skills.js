// Skills Section Content Model
const skillsContent = {
  categories: [
    {
      id: "cat-it",
      name: "IT & Development",
      description: "Full-stack development and technical skills",
      icon: "Code",
      color: "dazai-brown",
      isActive: true
    },
    {
      id: "cat-ux",
      name: "UX & Design",
      description: "User experience and visual design skills",
      icon: "Palette",
      color: "dazai-gold", 
      isActive: true
    },
    {
      id: "cat-marketing",
      name: "Marketing & Strategy",
      description: "Digital marketing and growth strategies",
      icon: "TrendingUp",
      color: "dazai-dark",
      isActive: true
    }
  ],
  
  skills: [
    // IT Skills
    {
      id: "skill-it-1",
      name: "Full-Stack Development",
      description: "React, Node.js, Python",
      level: 95,
      categoryId: "cat-it",
      icon: "Code",
      isActive: true
    },
    {
      id: "skill-it-2",
      name: "Database Management",
      description: "PostgreSQL, MongoDB, Redis",
      level: 90,
      categoryId: "cat-it",
      icon: "Database",
      isActive: true
    },
    {
      id: "skill-it-3",
      name: "Cloud Architecture",
      description: "AWS, Docker, Kubernetes",
      level: 88,
      categoryId: "cat-it",
      icon: "Server",
      isActive: true
    },
    {
      id: "skill-it-4",
      name: "Mobile Development",
      description: "React Native, Flutter",
      level: 85,
      categoryId: "cat-it",
      icon: "Smartphone",
      isActive: true
    },
    {
      id: "skill-it-5",
      name: "Web Technologies",
      description: "TypeScript, Next.js, GraphQL",
      level: 92,
      categoryId: "cat-it",
      icon: "Globe",
      isActive: true
    },
    {
      id: "skill-it-6",
      name: "DevOps & CI/CD",
      description: "GitHub Actions, Jenkins",
      level: 87,
      categoryId: "cat-it",
      icon: "GitBranch",
      isActive: true
    },
    
    // UX Skills
    {
      id: "skill-ux-1",
      name: "Interface Design",
      description: "Figma, Adobe Creative Suite",
      level: 93,
      categoryId: "cat-ux",
      icon: "Figma",
      isActive: true
    },
    {
      id: "skill-ux-2",
      name: "Design Systems",
      description: "Component Libraries, Style Guides",
      level: 89,
      categoryId: "cat-ux",
      icon: "Layers",
      isActive: true
    },
    {
      id: "skill-ux-3",
      name: "User Experience",
      description: "User Research, Prototyping",
      level: 91,
      categoryId: "cat-ux",
      icon: "MousePointer",
      isActive: true
    },
    {
      id: "skill-ux-4",
      name: "Visual Design",
      description: "Typography, Color Theory",
      level: 88,
      categoryId: "cat-ux",
      icon: "Eye",
      isActive: true
    },
    {
      id: "skill-ux-5",
      name: "Animation & Motion",
      description: "Framer Motion, Lottie",
      level: 86,
      categoryId: "cat-ux",
      icon: "Sparkles",
      isActive: true
    },
    {
      id: "skill-ux-6",
      name: "Brand Identity",
      description: "Logo Design, Brand Guidelines",
      level: 84,
      categoryId: "cat-ux",
      icon: "Palette",
      isActive: true
    },
    
    // Marketing Skills
    {
      id: "skill-marketing-1",
      name: "Growth Strategy",
      description: "SEO, SEM, Analytics",
      level: 90,
      categoryId: "cat-marketing",
      icon: "TrendingUp",
      isActive: true
    },
    {
      id: "skill-marketing-2",
      name: "Campaign Management",
      description: "Google Ads, Facebook Ads",
      level: 87,
      categoryId: "cat-marketing",
      icon: "Target",
      isActive: true
    },
    {
      id: "skill-marketing-3",
      name: "Data Analysis",
      description: "Google Analytics, Mixpanel",
      level: 89,
      categoryId: "cat-marketing",
      icon: "BarChart3",
      isActive: true
    },
    {
      id: "skill-marketing-4",
      name: "Content Marketing",
      description: "Copywriting, Social Media",
      level: 85,
      categoryId: "cat-marketing",
      icon: "Megaphone",
      isActive: true
    },
    {
      id: "skill-marketing-5",
      name: "Customer Acquisition",
      description: "Funnel Optimization, A/B Testing",
      level: 88,
      categoryId: "cat-marketing",
      icon: "Users",
      isActive: true
    },
    {
      id: "skill-marketing-6",
      name: "Marketing Automation",
      description: "HubSpot, Mailchimp, Zapier",
      level: 83,
      categoryId: "cat-marketing",
      icon: "Zap",
      isActive: true
    }
  ]
};

module.exports = skillsContent; 