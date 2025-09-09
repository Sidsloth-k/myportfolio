import React from 'react';
import { motion } from 'framer-motion';

interface ProjectsSectionHeaderProps {
  isInView: boolean;
}

const ProjectsSectionHeader: React.FC<ProjectsSectionHeaderProps> = ({ isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl font-bold hierarchy-primary mb-4">
        Featured Case Files
      </h2>
      <p className="hierarchy-secondary text-lg max-w-2xl mx-auto">
        A selection of my most impactful projects, each representing a unique challenge solved with creativity and technical expertise.
      </p>
    </motion.div>
  );
};

export default ProjectsSectionHeader;