import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/button';

interface ProjectViewDetailsButtonProps {
  onClick: () => void;
}

const ProjectViewDetailsButton: React.FC<ProjectViewDetailsButtonProps> = ({ onClick }) => {
  return (
    <div className="mt-3 pt-3 border-t border-border">
      <Button 
        size="sm" 
        variant="ghost"
        className="w-full hierarchy-accent hover:text-accent text-sm group/btn"
        onClick={onClick}
      >
        <Eye className="w-3 h-3 mr-2" />
        View Case Details
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="ml-auto"
        >
          <ArrowRight className="w-3 h-3" />
        </motion.div>
      </Button>
    </div>
  );
};

export default ProjectViewDetailsButton;