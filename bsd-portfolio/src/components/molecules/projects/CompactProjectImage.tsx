import React from 'react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { ProjectHighlightBadge, CompactProjectCategoryBadge } from '../../atoms';
import CompactProjectHoverActions from './CompactProjectHoverActions';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  highlight?: string;
  live: string;
  github: string;
}

interface CompactProjectImageProps {
  project: Project;
  index: number;
  isHovered: boolean;
  onLiveClick: (e: React.MouseEvent) => void;
  onGithubClick: (e: React.MouseEvent) => void;
}

const CompactProjectImage: React.FC<CompactProjectImageProps> = ({
  project,
  index,
  isHovered,
  onLiveClick,
  onGithubClick
}) => {
  return (
    <div className="relative h-48 overflow-hidden">
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

      {/* Category Badge */}
      <CompactProjectCategoryBadge category={project.category} />

      {/* Hover Actions */}
      <CompactProjectHoverActions
        project={project}
        isVisible={isHovered}
        onLiveClick={onLiveClick}
        onGithubClick={onGithubClick}
      />
    </div>
  );
};

export default CompactProjectImage;