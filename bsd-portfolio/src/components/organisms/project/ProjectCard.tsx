import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../ui/card';
import ProjectImageSection from '../../molecules/projects/ProjectImageSection';
import ProjectContentSection from '../../molecules/projects/ProjectContentSection';

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

interface ProjectCardProps {
  project: Project;
  index: number;
  isInView: boolean;
  hoveredProject: number | null;
  setHoveredProject: (id: number | null) => void;
  onProjectClick: (projectId: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  index, 
  isInView, 
  hoveredProject, 
  setHoveredProject, 
  onProjectClick 
}) => {
  const handleProjectClick = useCallback(() => {
    onProjectClick(project.id);
  }, [project.id, onProjectClick]);

  const handleLiveClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(project.live, '_blank');
  }, [project.live]);

  const handleGithubClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(project.github, '_blank');
  }, [project.github]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -12, scale: 1.02 }}
      onHoverStart={() => setHoveredProject(project.id)}
      onHoverEnd={() => setHoveredProject(null)}
      onClick={handleProjectClick}
      className="group cursor-pointer relative"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border hover:border-hover-border transition-all duration-500 anime-shadow hover:anime-glow">
        {/* Project Image Section */}
        <ProjectImageSection
          project={project}
          index={index}
          hoveredProject={hoveredProject}
          onLiveClick={handleLiveClick}
          onGithubClick={handleGithubClick}
        />

        {/* Project Content Section */}
        <ProjectContentSection project={project} />

        {/* Hover Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-lg pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      </Card>
    </motion.div>
  );
};

export default ProjectCard; 