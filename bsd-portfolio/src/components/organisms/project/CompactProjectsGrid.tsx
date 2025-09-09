import React, { useState, useCallback, useMemo } from 'react';
import CompactProjectCard from './CompactProjectCard';

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

interface CompactProjectsGridProps {
  projects: Project[];
  isInView: boolean;
  onProjectClick: (projectId: number) => void;
}

const CompactProjectsGrid: React.FC<CompactProjectsGridProps> = ({
  projects,
  isInView,
  onProjectClick
}) => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Memoize featured projects to prevent unnecessary re-renders
  const featuredProjects = useMemo(() => projects.slice(0, 6), [projects]);

  const handleProjectClick = useCallback((projectId: number) => {
    onProjectClick(projectId);
  }, [onProjectClick]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {featuredProjects.map((project, index) => (
        <CompactProjectCard
          key={project.id}
          project={project}
          index={index}
          isInView={isInView}
          isHovered={hoveredProject === project.id}
          onHoverStart={() => setHoveredProject(project.id)}
          onHoverEnd={() => setHoveredProject(null)}
          onProjectClick={handleProjectClick}
        />
      ))}
    </div>
  );
};

export default CompactProjectsGrid;