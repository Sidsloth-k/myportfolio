import React from 'react';
import { Button } from '../../ui/button';

interface ProjectActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: 'default' | 'outline';
  className?: string;
}

const ProjectActionButton: React.FC<ProjectActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
  className = ''
}) => {
  const baseClasses = "text-xs";
  const variantClasses = variant === 'outline' 
    ? "bg-black/20 backdrop-blur-sm text-white border-white/30 hover:bg-black/30"
    : "bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30";

  return (
    <Button
      size="sm"
      variant={variant}
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Button>
  );
};

export default ProjectActionButton;