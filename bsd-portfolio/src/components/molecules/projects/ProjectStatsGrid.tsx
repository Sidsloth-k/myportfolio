import React from 'react';
import ProjectStatItem from '../../atoms/projects/ProjectStatItem';

interface ProjectStatsGridProps {
  stats: Record<string, string | undefined>;
}

const ProjectStatsGrid: React.FC<ProjectStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
      {Object.entries(stats).map(([key, value]) => (
        <ProjectStatItem key={key} statKey={key} value={value} />
      ))}
    </div>
  );
};

export default ProjectStatsGrid; 