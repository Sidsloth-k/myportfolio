import React from 'react';
import ProjectsSection from '../components/ProjectsSection';

interface ProjectsPageProps {
  projects: any[];
  onProjectClick: (projectId: number) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onProjectClick }) => {
  return (
    <div className="pt-20">
      <ProjectsSection 
        projects={projects} 
        onProjectClick={onProjectClick}
      />
    </div>
  );
};

export default ProjectsPage; 