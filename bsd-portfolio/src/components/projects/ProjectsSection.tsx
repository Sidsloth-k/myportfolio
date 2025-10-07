import React from 'react';
import ProjectsSectionTemplate from '../templates/ProjectsSectionTemplate';

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

interface ProjectsSectionProps {
  projects: Project[];
  onProjectClick: (projectId: number) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onProjectClick }) => {
  return (
    <ProjectsSectionTemplate 
      projects={projects} 
      onProjectClick={onProjectClick} 
    />
  );
};

export default ProjectsSection;


