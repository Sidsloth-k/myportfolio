import React from 'react';

interface SkillIconProps {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const SkillIcon: React.FC<SkillIconProps> = ({ icon: Icon, color }) => {
  return (
    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-muted/50 flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-6 h-6" />
    </div>
  );
};

export default SkillIcon;