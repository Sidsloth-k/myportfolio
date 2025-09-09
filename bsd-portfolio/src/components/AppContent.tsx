import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Navigation from './Navigation';
import { ContactPage, HomePage, AboutPage, SkillsPage, ProjectsPage, ProjectPage } from '../pages';
import CharacterPopupSystem from './CharacterPopupSystem';
import RotatingAdminButton from './RotatingAdminButton';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path === '/about') return 'about';
    if (path === '/skills') return 'skills';
    if (path === '/projects') return 'projects';
    if (path === '/contact') return 'contact';
    if (path.startsWith('/projects/')) return 'projects';
    return 'home';
  };

  const currentPage = getCurrentPage();

  // Enhanced project data
  const projectsData = [
    {
      id: 1,
      title: 'Detective Case Management System',
      category: 'it',
      type: 'Full-Stack Application',
      description: 'A comprehensive case management system for detective agencies, featuring real-time collaboration, evidence tracking, and advanced analytics powered by AI.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'AWS', 'AI/ML'],
      image: 'detective dashboard system interface',
      github: '#',
      live: '#',
      highlight: 'Primary Focus',
      stats: { users: '500+', performance: '99.9%', data: '10TB+' }
    },
    {
      id: 2,
      title: 'Port Mafia Analytics Platform',
      category: 'it',
      type: 'Data Visualization',
      description: 'Advanced analytics platform for organizational insights, featuring predictive modeling, interactive dashboards, and real-time data processing.',
      technologies: ['Python', 'FastAPI', 'React', 'D3.js', 'TensorFlow', 'Elasticsearch'],
      image: 'analytics dashboard dark theme',
      github: '#',
      live: '#',
      stats: { models: '15', accuracy: '94%', realtime: 'Yes' }
    },
    {
      id: 3,
      title: 'Ability Registry API',
      category: 'it',
      type: 'Backend System',
      description: 'RESTful API for managing supernatural abilities database with advanced security, rate limiting, and real-time monitoring capabilities.',
      technologies: ['Node.js', 'GraphQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'],
      image: 'api documentation interface swagger',
      github: '#',
      live: '#',
      stats: { endpoints: '50+', uptime: '99.99%', requests: '1M+/day' }
    },
    {
      id: 4,
      title: 'Armed Detective Agency Mobile App',
      category: 'ux',
      type: 'Mobile UI/UX',
      description: 'Elegant mobile interface for agency operations, featuring intuitive navigation, beautiful animations, and accessibility-first design.',
      technologies: ['Figma', 'React Native', 'Framer Motion', 'Adobe XD', 'Principle'],
      image: 'mobile app interface design mockups',
      github: '#',
      live: '#',
      highlight: 'Design Excellence',
      stats: { screens: '45', users: '98% satisfaction', downloads: '50K+' }
    },
    {
      id: 5,
      title: 'Literary Cafe Design System',
      category: 'ux',
      type: 'Design System',
      description: 'Comprehensive design system inspired by classical literature, featuring elegant typography, cohesive components, and accessibility guidelines.',
      technologies: ['Figma', 'Storybook', 'CSS', 'Design Tokens', 'Sketch'],
      image: 'design system components library',
      github: '#',
      live: '#',
      stats: { components: '120+', variants: '300+', teams: '5' }
    },
    {
      id: 6,
      title: 'Yokohama Tourism Campaign',
      category: 'marketing',
      type: 'Digital Campaign',
      description: 'Multi-channel marketing campaign showcasing Yokohama\'s attractions, achieving record engagement rates through data-driven strategies.',
      technologies: ['Google Ads', 'Facebook Ads', 'Analytics', 'Photoshop', 'After Effects'],
      image: 'tourism marketing campaign visuals',
      github: '#',
      live: '#',
      highlight: 'Best Campaign 2024',
      stats: { reach: '2M+', engagement: '+340%', conversions: '+250%' }
    },
    {
      id: 7,
      title: 'Literary Society Growth Strategy',
      category: 'marketing',
      type: 'Growth Marketing',
      description: 'Complete rebranding and growth strategy for a literary society, resulting in 400% membership increase through innovative digital marketing.',
      technologies: ['SEO', 'Content Marketing', 'Social Media', 'Email Marketing', 'A/B Testing'],
      image: 'literary society branding materials',
      github: '#',
      live: '#',
      stats: { growth: '+400%', organic: '+250%', retention: '85%' }
    }
  ];

  // Loading screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Handle project routing
  useEffect(() => {
    if (params.id) {
      const projectId = parseInt(params.id);
      const project = projectsData.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
      } else {
        // Project not found, redirect to projects
        navigate('/projects');
      }
    } else {
      setSelectedProject(null);
    }
  }, [params.id, navigate]);



  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const setCurrentPage = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  // Enhanced Loading Screen Component
  const LoadingScreen = () => (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-background via-card to-muted flex items-center justify-center overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              opacity: 0,
            }}
            animate={{
              y: [null, -150],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Enhanced Dazai-inspired loading animation */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-10 relative overflow-hidden anime-glow"
        >
          {/* Enhanced bandage effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent via-primary to-background opacity-80"></div>
          <motion.div 
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-4 left-3 w-16 h-1 bg-background opacity-70 rounded transform rotate-12"
          />
          <motion.div 
            animate={{ rotate: [0, -90, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            className="absolute bottom-6 right-3 w-10 h-1 bg-background opacity-70 rounded transform -rotate-12"
          />
          
          {/* Ability nullification effect */}
          <motion.div
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 1.5
            }}
            className="absolute inset-0 border-2 border-accent/50 rounded-full"
          />
          
          {/* Inner rotating element */}
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 border-2 border-background/30 rounded-full"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-bold hierarchy-primary mb-6"
        >
          Armed Detective Agency
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="hierarchy-secondary text-xl mb-10"
        >
          Loading Sidney's Portfolio...
        </motion.p>

        {/* Enhanced loading dots with power effects */}
        <div className="flex justify-center space-x-3">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full"
            />
          ))}
        </div>

        {/* Loading progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
          className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-8 mx-auto max-w-md"
        />

        {/* Loading quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-10 italic text-accent text-lg max-w-lg mx-auto bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border"
        >
          "Every masterpiece begins with a single stroke, every mystery with a single clue..."
          <div className="text-sm font-semibold mt-2 hierarchy-primary">— Dazai Osamu</div>
        </motion.div>
      </div>
    </motion.div>
  );

  // Page Component Wrapper - removed animations to prevent reload issues
  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen">
      {children}
    </div>
  );

  // Render different pages based on currentPage
  const renderPage = () => {
    // If a project is selected, show project detail page
    if (selectedProject) {
      return (
        <ProjectPage 
          project={selectedProject} 
          onBack={handleBackToProjects}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <PageWrapper>
            <HomePage 
              onViewMoreSkills={() => setCurrentPage('skills')}
              onViewAllProjects={() => setCurrentPage('projects')}
              onProjectClick={handleProjectClick}
              projects={projectsData}
            />
          </PageWrapper>
        );
      case 'about':
        return (
          <PageWrapper>
            <AboutPage />
          </PageWrapper>
        );
      case 'skills':
        return (
          <PageWrapper>
            <SkillsPage onProjectClick={handleProjectClick} />
          </PageWrapper>
        );
      case 'projects':
        return (
          <PageWrapper>
            <ProjectsPage 
              projects={projectsData} 
              onProjectClick={handleProjectClick}
            />
          </PageWrapper>
        );
      case 'contact':
        return (
          <div className="pt-20">
            <ContactPage />
          </div>
        );
      default:
        return (
          <PageWrapper>
            <HomePage 
              onViewMoreSkills={() => setCurrentPage('skills')}
              onViewAllProjects={() => setCurrentPage('projects')}
              onProjectClick={handleProjectClick}
              projects={projectsData}
            />
          </PageWrapper>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}

      {/* Main Application */}
      {!isLoading && (
        <div key="main-app">
            {/* Navigation - hide on project detail page */}
            {!selectedProject && (
              <Navigation 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
              />
            )}

            {/* Page Content */}
            <main className="relative z-10">
              {renderPage()}
            </main>

            {/* Enhanced Footer - hide on project detail page */}
            {!selectedProject && (
              <motion.footer
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-gradient-to-r from-card to-muted border-t border-border py-12 px-6 relative overflow-hidden z-10"
              >
                {/* Footer Background Effects */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Agency Info */}
                    <div className="md:col-span-2">
                      <motion.h3 
                        whileHover={{ scale: 1.02 }}
                        className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                      >
                        Armed Detective Agency
                      </motion.h3>
                      <p className="hierarchy-secondary mb-6 leading-relaxed text-lg">
                        Solving digital mysteries with the precision of detective work 
                        and the creativity of literary mastery. Sidney brings together 
                        IT expertise, design elegance, and marketing strategy to create 
                        solutions that inspire and deliver results.
                      </p>
                      <div className="italic text-accent text-lg bg-accent/10 p-4 rounded-xl border border-accent/20">
                        "Every project is a story waiting to be told, every challenge a mystery waiting to be solved."
                        <div className="text-sm font-semibold mt-2 hierarchy-primary">— Dazai Osamu</div>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                      <h4 className="text-xl font-semibold mb-6 text-accent">
                        Case Files
                      </h4>
                      <div className="space-y-3">
                        {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((link) => (
                          <motion.button
                            key={link}
                            whileHover={{ x: 8, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(link.toLowerCase())}
                            className="block hierarchy-secondary hover:text-primary transition-colors text-lg py-1"
                          >
                            {link}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info & Admin Access */}
                    <div>
                      <h4 className="text-xl font-semibold mb-6 text-accent">
                        Connect & Manage
                      </h4>
                      <div className="space-y-3 hierarchy-secondary mb-6">
                        <div className="text-lg">sidney@detective-agency.dev</div>
                        <div>Yokohama, Japan</div>
                        <div>Available 24/7 for emergencies</div>
                      </div>
                      
                      {/* Rotating Admin Access Button */}
                      <div className="mb-4">
                        <RotatingAdminButton />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="hierarchy-tertiary text-sm">
                      © 2024 Sidney's Portfolio. Inspired by Bungou Stray Dogs.
                    </div>
                    <div className="hierarchy-tertiary text-sm mt-4 md:mt-0 flex items-center space-x-2">
                      <span>Built with React, TypeScript, and Anime Magic</span>
                      <motion.span 
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-accent"
                      >
                        ✨
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.footer>
            )}

            {/* Character Popup System */}
            <CharacterPopupSystem />

            {/* Enhanced Background Particles */}
            <div className="fixed inset-0 pointer-events-none z-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-accent/20 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0,
                  }}
                  animate={{
                    y: [null, -window.innerHeight - 100],
                    x: [null, Math.random() * 200 - 100],
                    opacity: [0, 0.6, 0],
                    scale: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    duration: 20 + Math.random() * 15,
                    repeat: Infinity,
                    delay: Math.random() * 15,
                    ease: 'linear',
                  }}
                />
              ))}

              {/* Additional floating anime elements */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`element-${i}`}
                  className="absolute w-4 h-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 100,
                    rotate: 0,
                  }}
                  animate={{
                    y: [null, -200],
                    x: [null, Math.random() * 300 - 150],
                    rotate: [0, 360],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.5, 0.5],
                  }}
                  transition={{
                    duration: 12 + Math.random() * 8,
                    repeat: Infinity,
                    delay: Math.random() * 12,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
  );
};

export default AppContent;