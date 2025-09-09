import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Users, CheckCircle, Zap, Target, Eye, TrendingUp } from 'lucide-react';
import { Card } from '../../ui/card';
import { ProjectDetailBackground, ProjectBackButton } from '../../atoms/project-detail';
import { 
  ProjectHeroSection, 
  EnhancedImageGallery,
  TechnicalStackShowcase,
  CompactRoadmapFlow,
  MetricsShowcase
} from '../../molecules/project-detail';

interface Technology {
  name: string;
  category: string;
  level: string;
  icon: string;
}

interface ProjectImage {
  url: string;
  caption: string;
  type: string;
}

interface ProjectFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: string;
  impact: string;
}

interface ProjectPhase {
  phase: string;
  description: string;
  duration: string;
  deliverables: string[];
  challenges: string[];
  solutions: string[];
  status: string;
}

interface ProjectTestimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

interface ProjectData {
  title: string;
  subtitle: string;
  category: string;
  description: string;
  longDescription: string;
  timeline: string;
  team: string;
  role: string;
  budget: string;
  client: string;
  technologies: Technology[];
  images: ProjectImage[];
  features: ProjectFeature[];
  roadmap: ProjectPhase[];
  testimonials: ProjectTestimonial[];
  links: {
    live?: string;
    github?: string;
    documentation?: string;
    case_study?: string;
  };
  metrics: {
    [key: string]: string | number;
  };
}

interface ProjectDataMap {
  [key: number]: ProjectData;
}

interface ProjectDetailPageProps {
  project: any;
  onBack: () => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const isInView = useInView(containerRef, { once: true });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  // Compact project data with 3 main phases
  const projectData: ProjectDataMap = {
    1: {
      title: 'Detective Case Management System',
      subtitle: 'Enterprise-Grade Investigation Platform',
      category: 'Full-Stack Development',
      description: 'A comprehensive case management system designed for detective agencies, featuring real-time collaboration, evidence tracking, advanced analytics, and AI-powered insights.',
      longDescription: 'This revolutionary system transforms how detective agencies handle cases, from initial reporting to final resolution. Built with modern technologies and inspired by the methodical approach of the Armed Detective Agency, it provides investigators with powerful tools for case management, evidence analysis, and team collaboration. The system incorporates advanced AI algorithms for pattern recognition, blockchain technology for evidence integrity, and real-time communication protocols for seamless team coordination.',
      
      timeline: '8 months',
      team: '5 developers',
      role: 'Lead Full-Stack Developer & System Architect',
      budget: '$2.5M',
      client: 'Yokohama Police Department',
      
      technologies: [
        { name: 'React', category: 'Frontend', level: 'Advanced', icon: '⚛️' },
        { name: 'TypeScript', category: 'Language', level: 'Expert', icon: '📘' },
        { name: 'Node.js', category: 'Backend', level: 'Advanced', icon: '🟢' },
        { name: 'PostgreSQL', category: 'Database', level: 'Advanced', icon: '🐘' },
        { name: 'Socket.io', category: 'Real-time', level: 'Intermediate', icon: '⚡' },
        { name: 'AWS', category: 'Cloud', level: 'Advanced', icon: '☁️' },
        { name: 'Docker', category: 'DevOps', level: 'Intermediate', icon: '🐳' },
        { name: 'Redis', category: 'Caching', level: 'Intermediate', icon: '🔴' }
      ],

      images: [
        { url: 'detective dashboard main interface', caption: 'Main Dashboard - Case Overview with Real-time Updates', type: 'screenshot' },
        { url: 'evidence management system', caption: 'Blockchain-Verified Evidence Management System', type: 'screenshot' },
        { url: 'real time collaboration interface', caption: 'Real-time Collaboration Tools with Live Chat', type: 'screenshot' },
        { url: 'analytics dashboard charts', caption: 'AI-Powered Analytics Dashboard with Predictive Insights', type: 'screenshot' },
        { url: 'mobile responsive design', caption: 'Mobile-First Responsive Design for Field Work', type: 'mobile' },
        { url: 'system architecture diagram', caption: 'Microservices Architecture Overview', type: 'diagram' },
        { url: 'user interface mockups', caption: 'UI/UX Design Process and User Journey Maps', type: 'design' },
        { url: 'security features interface', caption: 'Advanced Security Features and Access Control', type: 'screenshot' }
      ],

      features: [
        {
          title: 'Real-time Collaboration',
          description: 'Multiple investigators can work on cases simultaneously with live updates, instant messaging, and shared workspaces',
          icon: Users,
          status: 'completed',
          impact: '65% faster case resolution'
        },
        {
          title: 'Blockchain Evidence Chain',
          description: 'Immutable evidence tracking with cryptographic verification and tamper-proof audit logs',
          icon: CheckCircle,
          status: 'completed',
          impact: '100% evidence integrity'
        },
        {
          title: 'AI-Powered Analytics',
          description: 'Machine learning algorithms for pattern recognition, case correlation, and predictive insights',
          icon: Zap,
          status: 'completed',
          impact: '78% improvement in case connections'
        },
        {
          title: 'Advanced Search & Filtering',
          description: 'Elasticsearch-powered search across all case data, evidence, and historical records',
          icon: Target,
          status: 'completed',
          impact: 'Sub-second search results'
        },
        {
          title: 'Mobile Investigation Tools',
          description: 'Field-optimized mobile interface with offline capabilities and GPS integration',
          icon: Eye,
          status: 'completed',
          impact: '40% increase in field productivity'
        },
        {
          title: 'Automated Reporting',
          description: 'AI-generated case summaries, progress reports, and evidence documentation',
          icon: TrendingUp,
          status: 'completed',
          impact: '80% reduction in report generation time'
        }
      ],

      // Compact roadmap with 3 main phases
      roadmap: [
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
            'Basic API endpoints'
          ],
          status: 'completed',
          challenges: [
            'Complex user workflows', 
            'Security compliance requirements', 
            'Scalability planning',
            'Performance optimization requirements'
          ],
          solutions: [
            'Extensive user testing', 
            'Security expert partnerships', 
            'Microservices architecture',
            'Advanced indexing strategies'
          ]
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
            'Integration testing'
          ],
          status: 'completed',
          challenges: [
            'Complex UI interactions',
            'Real-time synchronization',
            'AI model accuracy',
            'Cross-platform compatibility'
          ],
          solutions: [
            'Component virtualization',
            'WebSocket optimization',
            'Continuous model training',
            'Progressive web app features'
          ]
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
            'Backup & recovery procedures'
          ],
          status: 'completed',
          challenges: [
            'Load testing at enterprise scale',
            'Security certification process',
            'User adoption & training',
            'Production environment setup'
          ],
          solutions: [
            'Cloud-based testing infrastructure',
            'Third-party security audits',
            'Comprehensive training programs',
            'Gradual deployment strategy'
          ]
        }
      ],

      metrics: {
        'Case Resolution Time': '-65%',
        'User Adoption Rate': '98%',
        'System Uptime': '99.97%',
        'User Satisfaction': '4.9/5',
        'Data Processing Speed': '+340%',
        'Security Incidents': '0',
        'Cost Savings': '$1.2M/year',
        'Training Time': '-50%'
      },

      testimonials: [
        {
          name: 'Inspector Tanaka',
          role: 'Lead Detective, Yokohama PD',
          company: 'Yokohama Police Department',
          quote: 'This system has revolutionized our investigation process. Case resolution times have improved dramatically.',
          rating: 5
        },
        {
          name: 'Chief Commissioner Sato',
          role: 'Yokohama Police Chief',
          company: 'Yokohama Police Department',
          quote: 'The best investment we\'ve made in technology. The AI insights have helped solve cases we thought were cold.',
          rating: 5
        }
      ],

      links: {
        live: 'https://detective-system-demo.com',
        github: 'https://github.com/sidney/detective-system',
        documentation: 'https://docs.detective-system.com',
        case_study: 'https://case-study.detective-system.com'
      }
    }
    // Add more projects...
  };

  const currentProject = projectData[project.id as keyof typeof projectData] || projectData[1];

  // Convert metrics to array format for the component
  const metricsArray = Object.entries(currentProject.metrics).map(([metric, value]) => ({
    metric,
    value
  }));

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      <ProjectDetailBackground y1={y1} y2={y2} opacity={opacity} />

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-12">
        <ProjectBackButton onBack={onBack} />

        {/* Project Hero Section */}
        <ProjectHeroSection project={currentProject} />

        {/* Project Overview */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <Card className="p-10 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-border anime-shadow">
            <h3 className="text-3xl font-bold hierarchy-primary mb-6">Project Overview</h3>
            <p className="text-lg leading-relaxed hierarchy-secondary mb-6">
              {currentProject.longDescription}
            </p>
            <div className="text-lg font-semibold hierarchy-primary">
              Role: <span className="text-accent">{currentProject.role}</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Sections */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <EnhancedImageGallery images={currentProject.images} isInView={isInView} />
        <TechnicalStackShowcase technologies={currentProject.technologies} isInView={isInView} />
        <CompactRoadmapFlow roadmap={currentProject.roadmap} isInView={isInView} />
        <MetricsShowcase metrics={metricsArray} testimonials={currentProject.testimonials} isInView={isInView} />
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;