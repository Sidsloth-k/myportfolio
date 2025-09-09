import React from 'react';
import { motion } from 'framer-motion';

interface ProjectTechnologyTagProps {
  tech: string;
}

const ProjectTechnologyTag: React.FC<ProjectTechnologyTagProps> = ({ tech }) => {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className="px-3 py-1 bg-muted/50 hierarchy-tertiary text-xs rounded-full border border-border hover:border-hover-border transition-colors"
    >
      {tech}
    </motion.span>
  );
};

export default ProjectTechnologyTag; 