// Projects Section Content Model
const projectsContent = {
  projects: [
    {
      id: "project-1",
      title: "Detective Case Management System",
      category: "it",
      type: "Full-Stack Application",
      description: "A comprehensive case management system for detective agencies, featuring real-time collaboration, evidence tracking, and advanced analytics powered by AI.",
      technologies: ["React", "Node.js", "PostgreSQL", "Socket.io", "AWS", "AI/ML"],
      image: "detective dashboard system interface",
      github: "#",
      live: "#",
      highlight: "Primary Focus",
      stats: {
        users: "500+",
        performance: "99.9%",
        data: "10TB+"
      },
      isActive: true,
      order: 1
    },
    {
      id: "project-2",
      title: "Port Mafia Analytics Platform",
      category: "it",
      type: "Data Visualization",
      description: "Advanced analytics platform for organizational insights, featuring predictive modeling, interactive dashboards, and real-time data processing.",
      technologies: ["Python", "FastAPI", "React", "D3.js", "TensorFlow", "Elasticsearch"],
      image: "analytics dashboard dark theme",
      github: "#",
      live: "#",
      stats: {
        models: "15",
        accuracy: "94%",
        realtime: "Yes"
      },
      isActive: true,
      order: 2
    },
    {
      id: "project-3",
      title: "Ability Registry API",
      category: "it",
      type: "Backend System",
      description: "RESTful API for managing supernatural abilities database with advanced security, rate limiting, and real-time monitoring capabilities.",
      technologies: ["Node.js", "GraphQL", "MongoDB", "Redis", "Docker", "Kubernetes"],
      image: "api documentation interface swagger",
      github: "#",
      live: "#",
      stats: {
        endpoints: "50+",
        uptime: "99.99%",
        requests: "1M+/day"
      },
      isActive: true,
      order: 3
    },
    {
      id: "project-4",
      title: "Armed Detective Agency Mobile App",
      category: "ux",
      type: "Mobile UI/UX",
      description: "Elegant mobile interface for agency operations, featuring intuitive navigation, beautiful animations, and accessibility-first design.",
      technologies: ["Figma", "React Native", "Framer Motion", "Adobe XD", "Principle"],
      image: "mobile app interface design mockups",
      github: "#",
      live: "#",
      highlight: "Design Excellence",
      stats: {
        screens: "45",
        users: "98% satisfaction",
        downloads: "50K+"
      },
      isActive: true,
      order: 4
    },
    {
      id: "project-5",
      title: "Literary Cafe Design System",
      category: "ux",
      type: "Design System",
      description: "Comprehensive design system inspired by classical literature, featuring elegant typography, cohesive components, and accessibility guidelines.",
      technologies: ["Figma", "Storybook", "CSS", "Design Tokens", "Sketch"],
      image: "design system components library",
      github: "#",
      live: "#",
      stats: {
        components: "120+",
        variants: "300+",
        teams: "5"
      },
      isActive: true,
      order: 5
    },
    {
      id: "project-6",
      title: "Yokohama Tourism Campaign",
      category: "marketing",
      type: "Digital Campaign",
      description: "Multi-channel marketing campaign promoting Yokohama tourism, featuring social media strategy, influencer partnerships, and data-driven optimization.",
      technologies: ["Google Ads", "Facebook Ads", "Instagram", "Analytics", "CRM"],
      image: "tourism campaign social media",
      github: "#",
      live: "#",
      stats: {
        reach: "2M+",
        engagement: "15%",
        conversions: "12K+"
      },
      isActive: true,
      order: 6
    }
  ]
};

module.exports = projectsContent; 