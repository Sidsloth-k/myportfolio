import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../ui/button';

interface ProjectsViewAllButtonProps {
  isInView: boolean;
  onViewAll: () => void;
}

const ProjectsViewAllButton: React.FC<ProjectsViewAllButtonProps> = ({ isInView, onViewAll }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('ProjectsViewAllButton: Button clicked!');
    onViewAll();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="text-center relative z-50"
    >
      {/* Test with a simple button first */}
      <button
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium bg-gradient-to-r from-accent to-primary text-accent-foreground hover:from-primary hover:to-accent transition-all duration-300 anime-shadow h-10 rounded-md px-6 cursor-pointer relative z-50"
        style={{ pointerEvents: 'auto' }}
      >
        View All Case Files
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </motion.div>
  );
};

export default ProjectsViewAllButton;