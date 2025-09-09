import React from 'react';
import { ProjectStatItem, ProjectViewDetailsButton } from '../../atoms';
import CompactProjectTechnologies from './CompactProjectTechnologies';

interface Project {
  id: number;
  title: string;
  type: string;
  description: string;
  technologies: string[];
  stats: Record<string, string | undefined>;
}

interface CompactProjectContentProps {
  project: Project;
  onProjectClick: () => void;
}

const CompactProjectContent: React.FC<CompactProjectContentProps> = ({ project, onProjectClick }) => {
  return (
    <div className="p-4">
      {/* Project Type */}
      <div className="text-xs hierarchy-tertiary mb-2">{project.type}</div>
      
      {/* Project Title */}
      <h3 className="text-lg font-bold hierarchy-primary mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
        {project.title}
      </h3>
      
      {/* Project Description */}
      <p className="hierarchy-secondary text-sm leading-relaxed mb-3 line-clamp-2">
        {project.description}
      </p>

      {/* Technologies */}
      <CompactProjectTechnologies technologies={project.technologies} />

      {/* Project Stats */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
        {Object.entries(project.stats).slice(0, 2).map(([key, value]) => (
          <ProjectStatItem key={key} statKey={key} value={value} />
        ))}
      </div>

      {/* View Details Button */}
      <ProjectViewDetailsButton onClick={onProjectClick} />
    </div>
  );
};

export default CompactProjectContent;