import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Palette, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import ProjectCard from '../organisms/project/ProjectCard';

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
}

interface ProjectsSectionTemplateProps {
  projects: Project[];
  onProjectClick: (projectId: number) => void;
}

const ProjectsSectionTemplate: React.FC<ProjectsSectionTemplateProps> = ({ projects, onProjectClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const computedInView = useInView(containerRef, { once: true });
  const [forceInView, setForceInView] = useState<boolean>(false);
  useEffect(() => {
    // After mount, allow animations and rendering without requiring scroll
    const id = setTimeout(() => setForceInView(true), 0);
    return () => clearTimeout(id);
  }, []);
  const isInView = forceInView || computedInView;
  const [filter, setFilter] = useState('all');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const categories = useMemo(() => [
    { id: 'all', label: 'All Cases', icon: Code, count: projects.length },
    { id: 'it', label: 'IT Development', icon: Code, count: projects.filter(p => p.category === 'it').length },
    { id: 'ux', label: 'UI/UX Design', icon: Palette, count: projects.filter(p => p.category === 'ux').length },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp, count: projects.filter(p => p.category === 'marketing').length }
  ], [projects]);

  const filteredProjects = useMemo(() => 
    filter === 'all' ? projects : projects.filter(p => p.category === filter), 
    [projects, filter]
  );

  const handleProjectClick = useCallback((projectId: number) => {
    onProjectClick(projectId);
  }, [onProjectClick]);

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

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

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
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