import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Palette, TrendingUp, Database, Cloud, Zap, Brain, Shield, Filter, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import ProjectCard from '../organisms/project/ProjectCard';
import { useProjectCategories } from '../../hooks/useProjectCategories';

interface Project {
  id: number;
  title: string;
  category: string;
  type: string;
  description: string;
  technologies: string[];
  image: string;
  github: string;
  live: string;
  highlight?: string;
  stats: Record<string, string | undefined>;
  images?: Array<{
    id: string;
    url: string;
    caption: string;
    type: string;
    order: number;
  }>;
}

interface ProjectsSectionTemplateProps {
  projects: Project[];
  onProjectClick: (projectId: number) => void;
}

const ProjectsSectionTemplate: React.FC<ProjectsSectionTemplateProps> = ({ projects, onProjectClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const computedInView = useInView(containerRef, { once: true });
  const [forceInView, setForceInView] = useState<boolean>(false);
  const { categories: projectCategories, isFetching: categoriesLoading } = useProjectCategories(false);
  
  useEffect(() => {
    // After mount, allow animations and rendering without requiring scroll
    const id = setTimeout(() => setForceInView(true), 0);
    return () => clearTimeout(id);
  }, []);
  const isInView = forceInView || computedInView;
  const [filter, setFilter] = useState('all');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterTimeout, setFilterTimeout] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Icon mapping for different categories
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, any> = {
      'Data Science': Database,
      'Health & Wellness': Shield,
      'Business & Productivity': TrendingUp,
      'Artificial Intelligence': Brain,
      'Frontend': Code,
      'Backend': Zap,
      'Database': Database,
      'Cloud': Cloud,
      'Design': Palette,
      'Marketing': TrendingUp,
      'Mobile': Code,
      'Web Application': Code,
      'SaaS Platform': Cloud,
      'Mobile Application': Code
    };
    return iconMap[categoryName] || Code;
  };

  const categories = useMemo(() => {
    const allCategory = { id: 'all', label: 'All Cases', icon: Code, count: projects.length };
    
    if (categoriesLoading || projectCategories.length === 0) {
      return [allCategory];
    }

    const dynamicCategories = projectCategories.map(cat => ({
      id: cat.id,
      label: cat.name,
      icon: getCategoryIcon(cat.name),
      count: cat.count
    }));

    return [allCategory, ...dynamicCategories];
  }, [projects, projectCategories, categoriesLoading]);

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    
    // Find the category name from the dynamic categories
    const selectedCategory = projectCategories.find(cat => cat.id === filter);
    if (!selectedCategory) return projects;
    
    return projects.filter(p => p.category === selectedCategory.name);
  }, [projects, filter, projectCategories]);

  const handleProjectClick = useCallback((projectId: number) => {
    onProjectClick(projectId);
  }, [onProjectClick]);

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
    
    // Clear existing timeout
    if (filterTimeout) {
      clearTimeout(filterTimeout);
    }
    
    // Only set auto-reset timer if not 'all' and filters are closed
    if (newFilter !== 'all' && !showFilters) {
      setCountdown(5);
      const timeout = setTimeout(() => {
        setFilter('all');
        setCountdown(0);
      }, 5000);
      setFilterTimeout(timeout);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setFilterTimeout(null);
      setCountdown(0);
    }
  }, [filterTimeout, showFilters]);

  const handleResetFilters = useCallback(() => {
    setFilter('all');
    setShowFilters(false);
    setCountdown(0);
    if (filterTimeout) {
      clearTimeout(filterTimeout);
      setFilterTimeout(null);
    }
  }, [filterTimeout]);

  const handleToggleFilters = useCallback(() => {
    const newShowFilters = !showFilters;
    setShowFilters(newShowFilters);
    
    // Clear existing timeout
    if (filterTimeout) {
      clearTimeout(filterTimeout);
      setFilterTimeout(null);
    }
    
    // If closing filters and not on 'all', start the auto-reset timer
    if (!newShowFilters && filter !== 'all') {
      setCountdown(5);
      const timeout = setTimeout(() => {
        setFilter('all');
        setCountdown(0);
      }, 5000);
      setFilterTimeout(timeout);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(0);
    }
  }, [showFilters, filter, filterTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (filterTimeout) {
        clearTimeout(filterTimeout);
      }
    };
  }, [filterTimeout]);

  return (
    <section className="py-20 px-6 relative overflow-hidden" id="projects">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold hierarchy-primary mb-6">
            Case Archives
          </h2>
          <p className="text-xl hierarchy-secondary max-w-3xl mx-auto mb-8">
            A comprehensive collection of solved cases and investigations across 
            IT development, design strategy, and marketing analytics.
          </p>
          
          {/* Case Summary Stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {[
              { label: 'Cases Solved', value: `${projects.length}` },
              { label: 'Success Rate', value: '100%' },
              { label: 'Client Satisfaction', value: '98%' },
              { label: 'Technologies Used', value: '15+' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                className="text-center p-3 bg-card/50 backdrop-blur-sm border border-border rounded-xl"
              >
                <div className="text-lg font-bold hierarchy-primary">{stat.value}</div>
                <div className="text-xs hierarchy-tertiary">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center gap-4 mb-12"
        >
          {/* Filter Toggle Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleToggleFilters}
              variant={showFilters ? "default" : "outline"}
              className="flex items-center gap-2 px-4 py-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filter Cases</span>
              {showFilters && <X className="w-4 h-4" />}
            </Button>
            
            {filter !== 'all' && (
              <Button
                onClick={handleResetFilters}
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="w-3 h-3" />
                Reset
              </Button>
            )}
          </div>

          {/* Filter Tabs - Only show when showFilters is true */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap justify-center gap-4 w-full"
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
                    filter === category.id
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-card/50 text-foreground border-border hover:border-hover-border'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="font-medium">{category.label}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Current Filter Display - Show when not showing full filters */}
          {!showFilters && filter !== 'all' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-full"
            >
              <span className="text-sm font-medium">
                Filtered by: {categories.find(cat => cat.id === filter)?.label || 'Unknown'}
              </span>
              {countdown > 0 && (
                <span className="text-xs bg-accent/20 px-2 py-1 rounded-full">
                  Auto-reset in {countdown}s
                </span>
              )}
              <Button
                onClick={handleResetFilters}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isInView={isInView}
              hoveredProject={hoveredProject}
              setHoveredProject={setHoveredProject}
              onProjectClick={handleProjectClick}
            />
          ))}
        </motion.div>

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="hierarchy-secondary text-lg">
              No cases found for the selected category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSectionTemplate; 