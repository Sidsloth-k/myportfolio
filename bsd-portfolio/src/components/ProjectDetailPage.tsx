import React from 'react';
import AtomicProjectDetailPage from './organisms/project-detail/ProjectDetailPage';

interface ProjectDetailPageProps {
  project: any;
  onBack: () => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onBack }) => {
  return <AtomicProjectDetailPage project={project} onBack={onBack} />;
};

export default ProjectDetailPage;