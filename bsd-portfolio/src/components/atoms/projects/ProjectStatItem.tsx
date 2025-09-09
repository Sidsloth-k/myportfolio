import React from 'react';

interface ProjectStatItemProps {
  statKey: string;
  value: string | undefined;
}

const ProjectStatItem: React.FC<ProjectStatItemProps> = ({ statKey, value }) => {
  return (
    <div className="text-center">
      <div className="hierarchy-primary font-semibold text-sm">{value}</div>
      <div className="hierarchy-tertiary text-xs">{statKey}</div>
    </div>
  );
};

export default ProjectStatItem; 