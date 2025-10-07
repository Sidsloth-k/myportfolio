import React, { useRef, useCallback, useMemo } from 'react';
import { useInView } from 'framer-motion';
import { ProjectsSectionHeader, ProjectsViewAllButton } from '../molecules';
import { CompactProjectsGrid } from '../organisms/project';

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

interface CompactProjectsSectionProps {
  projects: Project[];
  onProjectClick: (projectId: number) => void;
  onViewAll: () => void;
}



const CompactProjectsSection: React.FC<CompactProjectsSectionProps> = ({ 
  projects, 
  onProjectClick, 
  onViewAll 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const handleProjectClick = useCallback((projectId: number) => {
    onProjectClick(projectId);
  }, [onProjectClick]);

  const handleViewAll = useCallback(() => {
    onViewAll();
  }, [onViewAll]);

  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <ProjectsSectionHeader isInView={isInView} />
        
        <div ref={containerRef}>
          <CompactProjectsGrid
            projects={projects}
              isInView={isInView}
              onProjectClick={handleProjectClick}
            />
        </div>

        <ProjectsViewAllButton isInView={isInView} onViewAll={handleViewAll} />
      </div>
    </section>
  );
};

export default CompactProjectsSection;


