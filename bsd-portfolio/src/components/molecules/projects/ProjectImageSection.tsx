import React from 'react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import ProjectCategoryBadge from '../../atoms/projects/ProjectCategoryBadge';
import ProjectHighlightBadge from '../../atoms/projects/ProjectHighlightBadge';
import ProjectHoverActions from './ProjectHoverActions';

interface ProjectImageSectionProps {
  project: {
    id: number;
    title: string;
    category: string;
    type: string;
    highlight?: string;
    live: string;
    github: string;
  };
  index: number;
  hoveredProject: number | null;
  onLiveClick: (e: React.MouseEvent) => void;
  onGithubClick: (e: React.MouseEvent) => void;
}

const ProjectImageSection: React.FC<ProjectImageSectionProps> = ({ 
  project, 
  index, 
  hoveredProject, 
  onLiveClick, 
  onGithubClick 
}) => {
  return (
    <div className="relative h-64 overflow-hidden">
      <ImageWithFallback
        src=""
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      
      {/* Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
      
      {/* Highlight Badge */}
      {project.highlight && (
        <ProjectHighlightBadge highlight={project.highlight} index={index} />
      )}

      {/* Project Type */}
      <ProjectCategoryBadge category={project.category} type={project.type} />

      {/* Hover Actions */}
      <ProjectHoverActions
        project={project}
        hoveredProject={hoveredProject}
        onLiveClick={onLiveClick}
        onGithubClick={onGithubClick}
      />
    </div>
  );
};

export default ProjectImageSection; 