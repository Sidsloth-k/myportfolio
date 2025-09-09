// Portfolio Content Types

// Hero Section
const HeroContent = {
  title: 'string',
  subtitle: 'string',
  description: 'string',
  quotes: [{
    id: 'string',
    text: 'string',
    author: 'string',
    context: 'string',
    isActive: 'boolean'
  }],
  ctaButtons: [{
    id: 'string',
    text: 'string',
    action: 'string',
    isActive: 'boolean'
  }]
};

// About Section
const AboutContent = {
  personalInfo: {
    name: 'string',
    title: 'string',
    location: 'string',
    email: 'string',
    bio: 'string',
    avatar: 'string'
  },
  timeline: [{
    id: 'string',
    year: 'string',
    title: 'string',
    description: 'string',
    icon: 'string',
    color: 'string',
    isActive: 'boolean'
  }],
  characteristics: [{
    id: 'string',
    title: 'string',
    description: 'string',
    percentage: 'number',
    isActive: 'boolean'
  }]
};

// Skills Section
const SkillsContent = {
  categories: [{
    id: 'string',
    name: 'string',
    description: 'string',
    icon: 'string',
    color: 'string',
    isActive: 'boolean'
  }],
  skills: [{
    id: 'string',
    name: 'string',
    description: 'string',
    level: 'number',
    categoryId: 'string',
    icon: 'string',
    isActive: 'boolean'
  }]
};

// Projects Section
const ProjectContent = {
  projects: [{
    id: 'string',
    title: 'string',
    category: 'string',
    type: 'string',
    description: 'string',
    technologies: ['string'],
    image: 'string',
    github: 'string',
    live: 'string',
    highlight: 'string',
    stats: {
      users: 'string',
      performance: 'string',
      data: 'string'
    },
    isActive: 'boolean',
    order: 'number'
  }]
};

// Contact Section
const ContactContent = {
  contactInfo: [{
    id: 'string',
    icon: 'string',
    label: 'string',
    value: 'string',
    description: 'string',
    isActive: 'boolean'
  }],
  formFields: {
    caseTypes: [{
      id: 'string',
      label: 'string',
      value: 'string',
      isActive: 'boolean'
    }],
    urgencyLevels: [{
      id: 'string',
      label: 'string',
      value: 'string',
      isActive: 'boolean'
    }]
  }
};

// Character System
const CharacterContent = {
  characters: [{
    id: 'string',
    name: 'string',
    quote: 'string',
    icon: 'string',
    animation: 'string',
    isActive: 'boolean'
  }]
};

// Media Content
const MediaContent = {
  images: [{
    id: 'string',
    filename: 'string',
    originalName: 'string',
    path: 'string',
    size: 'number',
    mimeType: 'string',
    dimensions: {
      width: 'number',
      height: 'number'
    },
    alt: 'string',
    category: 'string',
    isActive: 'boolean'
  }],
  icons: [{
    id: 'string',
    name: 'string',
    path: 'string',
    category: 'string',
    isActive: 'boolean'
  }]
};

// Analytics
const AnalyticsData = {
  pageViews: [{
    id: 'string',
    page: 'string',
    views: 'number',
    uniqueViews: 'number',
    date: 'string'
  }],
  userInteractions: [{
    id: 'string',
    type: 'string',
    element: 'string',
    count: 'number',
    date: 'string'
  }]
};

module.exports = {
  HeroContent,
  AboutContent,
  SkillsContent,
  ProjectContent,
  ContactContent,
  CharacterContent,
  MediaContent,
  AnalyticsData
}; 