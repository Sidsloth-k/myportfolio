import React from 'react';
import ProjectTechnologyTag from '../../atoms/projects/ProjectTechnologyTag';

interface ProjectTechnologiesListProps {
  technologies: string[];
}

const ProjectTechnologiesList: React.FC<ProjectTechnologiesListProps> = ({ technologies }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {technologies.slice(0, 4).map((tech) => (
        <ProjectTechnologyTag key={tech} tech={tech} />
      ))}
      {technologies.length > 4 && (
        <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20">
          +{technologies.length - 4}
        </span>
      )}
    </div>
  );
};

export default ProjectTechnologiesList; 