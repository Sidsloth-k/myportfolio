import React from 'react';
import ProjectTechnologyTag from '../../atoms/projects/ProjectTechnologyTag';

interface ProjectTechnologiesListProps {
  technologies: string[];
}

const ProjectTechnologiesList: React.FC<ProjectTechnologiesListProps> = ({ technologies }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {technologies.map((tech) => (
        <ProjectTechnologyTag key={tech} tech={tech} />
      ))}
    </div>
  );
};

export default ProjectTechnologiesList; 