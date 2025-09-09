import React from 'react';
import ProjectDetailPage from '../components/ProjectDetailPage';

interface ProjectPageProps {
  project: any;
  onBack: () => void;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ project, onBack }) => {
  return (
    <ProjectDetailPage project={project} onBack={onBack} />
  );
};

export default ProjectPage; 