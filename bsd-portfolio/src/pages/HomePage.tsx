import React from 'react';
import HeroSection from '../components/HeroSection';
import CompactSkillsSection from '../components/CompactSkillsSection';
import CompactProjectsSection from '../components/CompactProjectsSection';

interface HomePageProps {
  onViewMoreSkills: () => void;
  onViewAllProjects: () => void;
  onProjectClick: (projectId: number) => void;
  projects: any[];
}

const HomePage: React.FC<HomePageProps> = ({
  onViewMoreSkills,
  onViewAllProjects,
  onProjectClick,
  projects
}) => {
  return (
    <div>
      <HeroSection />
      <CompactSkillsSection onViewMore={onViewMoreSkills} />
      <CompactProjectsSection 
        projects={projects} 
        onProjectClick={onProjectClick}
        onViewAll={onViewAllProjects}
      />
    </div>
  );
};

export default HomePage; 