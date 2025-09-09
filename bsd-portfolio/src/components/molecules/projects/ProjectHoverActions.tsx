import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '../../ui/button';

interface ProjectHoverActionsProps {
  project: {
    id: number;
    live: string;
    github: string;
  };
  hoveredProject: number | null;
  onLiveClick: (e: React.MouseEvent) => void;
  onGithubClick: (e: React.MouseEvent) => void;
}

const ProjectHoverActions: React.FC<ProjectHoverActionsProps> = ({ 
  project, 
  hoveredProject, 
  onLiveClick, 
  onGithubClick 
}) => {
  if (hoveredProject !== project.id) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 right-4 flex justify-between items-center"
    >
      <Button
        size="sm"
        className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
        onClick={onLiveClick}
      >
        <ExternalLink className="w-3 h-3 mr-1" />
        Live
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-black/20 backdrop-blur-sm text-white border-white/30 hover:bg-black/30"
        onClick={onGithubClick}
      >
        <Github className="w-3 h-3 mr-1" />
        Code
      </Button>
    </motion.div>
  );
};

export default ProjectHoverActions; 