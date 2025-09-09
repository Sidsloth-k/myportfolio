import { Code, Palette, TrendingUp, Zap, Star, Target } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  contribution: string;
  complexity: string;
}

interface SkillData {
  category: string;
  proficiency: number;
  experience: string;
  description: string;
  projects: Project[];
  technologies: string[];
  achievements: string[];
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

interface SkillsData {
  [key: string]: SkillData;
}

export const skillsData: SkillsData = {
  'React': {
    category: 'Frontend',
    proficiency: 95,
    experience: '4+ years',
    description: 'Advanced React development with hooks, context, and performance optimization. Master of component architecture and state management.',
    projects: [
      { id: 1, title: 'Detective Case Management System', contribution: 'Lead Frontend Developer', complexity: 'Complex' },
      { id: 4, title: 'Armed Detective Agency Mobile App', contribution: 'UI Implementation', complexity: 'Medium' },
      { id: 2, title: 'Port Mafia Analytics Platform', contribution: 'Dashboard Development', complexity: 'Complex' }
    ],
    technologies: ['React 18', 'React Router', 'React Query', 'Context API', 'Custom Hooks'],
    achievements: ['Built 15+ production apps', 'Mentored 5 junior developers', 'Improved performance by 40%'],
    icon: Code,
    color: '#61DAFB'
  },
  'Node.js': {
    category: 'Backend',
    proficiency: 90,
    experience: '3+ years',
    description: 'Server-side development with Express, APIs, and microservices architecture. Expert in scalable backend systems.',
    projects: [
      { id: 1, title: 'Detective Case Management System', contribution: 'Backend Architecture', complexity: 'Complex' },
      { id: 3, title: 'Ability Registry API', contribution: 'Lead Backend Developer', complexity: 'Complex' },
      { id: 2, title: 'Port Mafia Analytics Platform', contribution: 'API Development', complexity: 'Medium' }
    ],
    technologies: ['Express.js', 'RESTful APIs', 'GraphQL', 'Microservices', 'Socket.io'],
    achievements: ['Designed scalable APIs', 'Handled 1M+ requests/day', 'Reduced response time by 60%'],
    icon: Zap,
    color: '#68A063'
  },
  'UI/UX Design': {
    category: 'Design',
    proficiency: 93,
    experience: '3+ years',
    description: 'User-centered design with focus on accessibility and conversion optimization. Creating beautiful, functional interfaces.',
    projects: [
      { id: 4, title: 'Armed Detective Agency Mobile App', contribution: 'Lead Designer', complexity: 'Complex' },
      { id: 5, title: 'Literary Cafe Design System', contribution: 'Design System Architect', complexity: 'Medium' },
      { id: 1, title: 'Detective Case Management System', contribution: 'UX Consultant', complexity: 'Medium' }
    ],
    technologies: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems'],
    achievements: ['98% user satisfaction', 'Increased conversion by 250%', 'Created 5+ design systems'],
    icon: Palette,
    color: '#FF6B6B'
  },
  'PostgreSQL': {
    category: 'Database',
    proficiency: 88,
    experience: '3+ years',
    description: 'Advanced database design, optimization, and complex query development. Expert in data modeling and performance.',
    projects: [
      { id: 1, title: 'Detective Case Management System', contribution: 'Database Architect', complexity: 'Complex' },
      { id: 2, title: 'Port Mafia Analytics Platform', contribution: 'Data Modeling', complexity: 'Complex' },
      { id: 3, title: 'Ability Registry API', contribution: 'Database Design', complexity: 'Medium' }
    ],
    technologies: ['Advanced SQL', 'Query Optimization', 'Database Design', 'Performance Tuning', 'Migrations'],
    achievements: ['Optimized queries by 80%', 'Managed 100GB+ databases', 'Zero data loss record'],
    icon: Target,
    color: '#336791'
  },
  'Marketing Analytics': {
    category: 'Marketing',
    proficiency: 87,
    experience: '2+ years',
    description: 'Data-driven marketing strategies and conversion optimization. Expert in growth hacking and user acquisition.',
    projects: [
      { id: 6, title: 'Yokohama Tourism Campaign', contribution: 'Analytics Lead', complexity: 'Complex' },
      { id: 7, title: 'Literary Society Growth Strategy', contribution: 'Growth Strategist', complexity: 'Medium' },
      { id: 1, title: 'Detective Case Management System', contribution: 'User Analytics', complexity: 'Medium' }
    ],
    technologies: ['Google Analytics', 'Mixpanel', 'A/B Testing', 'Conversion Optimization', 'Growth Metrics'],
    achievements: ['340% engagement increase', '250% conversion improvement', '2M+ reach campaigns'],
    icon: TrendingUp,
    color: '#4ECDC4'
  },
  'TypeScript': {
    category: 'Language',
    proficiency: 92,
    experience: '3+ years',
    description: 'Type-safe development with advanced TypeScript patterns and tooling. Master of complex type systems.',
    projects: [
      { id: 1, title: 'Detective Case Management System', contribution: 'Type System Design', complexity: 'Complex' },
      { id: 2, title: 'Port Mafia Analytics Platform', contribution: 'TypeScript Implementation', complexity: 'Medium' },
      { id: 3, title: 'Ability Registry API', contribution: 'API Type Definitions', complexity: 'Medium' }
    ],
    technologies: ['Advanced Types', 'Generics', 'Utility Types', 'Type Guards', 'Declaration Files'],
    achievements: ['99% type coverage', 'Reduced runtime errors by 70%', 'Created reusable type libraries'],
    icon: Star,
    color: '#3178C6'
  }
};

export const skillCategories = [
  { id: 'Frontend', icon: Code, color: 'dazai-brown', skills: ['React', 'TypeScript'], gradient: 'from-blue-500 to-blue-600' },
  { id: 'Backend', icon: Zap, color: 'dazai-dark', skills: ['Node.js', 'PostgreSQL'], gradient: 'from-green-500 to-green-600' },
  { id: 'Design', icon: Palette, color: 'dazai-gold', skills: ['UI/UX Design'], gradient: 'from-pink-500 to-red-500' },
  { id: 'Marketing', icon: TrendingUp, color: 'dazai-muted', skills: ['Marketing Analytics'], gradient: 'from-purple-500 to-indigo-500' }
]; 