import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ProjectBackButtonProps {
  onBack: () => void;
}

const ProjectBackButton: React.FC<ProjectBackButtonProps> = ({ onBack }) => {
  const button = (
    <motion.button
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ x: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onBack}
      className="fixed top-4 left-4 md:left-6 z-[9999] pointer-events-auto flex items-center space-x-2 hierarchy-secondary hover:text-primary transition-colors mb-8 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back to Case Files</span>
    </motion.button>
  );
  return createPortal(button, document.body);
};

export default ProjectBackButton;