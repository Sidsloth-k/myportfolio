import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface ProjectBackButtonProps {
  onBack: () => void;
}

const ProjectBackButton: React.FC<ProjectBackButtonProps> = ({ onBack }) => {
  return (
    <motion.button
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ x: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onBack}
      className="flex items-center space-x-2 hierarchy-secondary hover:text-primary transition-colors mb-8 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back to Case Files</span>
    </motion.button>
  );
};

export default ProjectBackButton;