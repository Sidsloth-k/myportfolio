import React from 'react';
import { EnhancedSkillsSection } from '../components/organisms/skills';

interface SkillsPageProps {
  onProjectClick: (projectId: number) => void;
}

const SkillsPage: React.FC<SkillsPageProps> = ({ onProjectClick }) => {
  return (
    <div className="pt-20">
      <EnhancedSkillsSection onProjectClick={onProjectClick} />
    </div>
  );
};

export default SkillsPage; 