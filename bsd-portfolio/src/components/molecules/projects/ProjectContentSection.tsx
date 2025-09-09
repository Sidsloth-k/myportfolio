import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '../../ui/button';
import ProjectTechnologiesList from './ProjectTechnologiesList';
import ProjectStatsGrid from './ProjectStatsGrid';

interface ProjectContentSectionProps {
  project: {
    title: string;
    description: string;
    technologies: string[];
    stats: Record<string, string | undefined>;
  };
}

const ProjectContentSection: React.FC<ProjectContentSectionProps> = ({ project }) => {
  return (
    <div className="p-6">
      {/* Project Title */}
      <h3 className="text-xl font-bold hierarchy-primary mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
        {project.title}
      </h3>
      
      {/* Project Description */}
      <p className="hierarchy-secondary text-sm leading-relaxed mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Technologies */}
      <ProjectTechnologiesList technologies={project.technologies} />

      {/* Project Stats */}
      <ProjectStatsGrid stats={project.stats} />

      {/* View Details Button */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button 
          size="sm" 
          variant="ghost"
          className="w-full hierarchy-accent hover:text-accent text-sm group/btn"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Case Details
        </Button>
      </div>
    </div>
  );
};

export default ProjectContentSection; 