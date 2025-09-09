import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../ui/button';

interface ProjectsViewAllButtonProps {
  isInView: boolean;
  onViewAll: () => void;
}

const ProjectsViewAllButton: React.FC<ProjectsViewAllButtonProps> = ({ isInView, onViewAll }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="text-center"
    >
      <Button
        onClick={onViewAll}
        size="lg"
        className="bg-gradient-to-r from-accent to-primary text-accent-foreground hover:from-primary hover:to-accent transition-all duration-300 anime-shadow"
      >
        View All Case Files
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
};

export default ProjectsViewAllButton;