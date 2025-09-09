import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { ProjectActionButton } from '../../atoms';

interface CompactProjectHoverActionsProps {
  project: {
    live: string;
    github: string;
  };
  isVisible: boolean;
  onLiveClick: (e: React.MouseEvent) => void;
  onGithubClick: (e: React.MouseEvent) => void;
}

const CompactProjectHoverActions: React.FC<CompactProjectHoverActionsProps> = ({
  project,
  isVisible,
  onLiveClick,
  onGithubClick
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-3 left-3 right-3 flex justify-between items-center"
    >
      <ProjectActionButton
        icon={ExternalLink}
        label="Live"
        onClick={onLiveClick}
        variant="default"
      />
      <ProjectActionButton
        icon={Github}
        label="Code"
        onClick={onGithubClick}
        variant="outline"
      />
    </motion.div>
  );
};

export default CompactProjectHoverActions;