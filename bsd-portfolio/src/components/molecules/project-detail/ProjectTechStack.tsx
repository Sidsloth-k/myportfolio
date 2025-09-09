import React from 'react';
import { motion } from 'framer-motion';
import { ProjectTechnologyBadge } from '../../atoms/project-detail';

interface Technology {
  name: string;
  category: string;
  level: string;
  icon: string;
}

interface ProjectTechStackProps {
  technologies: Technology[];
  isInView: boolean;
}

const ProjectTechStack: React.FC<ProjectTechStackProps> = ({ technologies, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
    >
      {technologies.map((technology, index) => (
        <ProjectTechnologyBadge
          key={technology.name}
          technology={technology}
          index={index}
          isInView={isInView}
        />
      ))}
    </motion.div>
  );
};

export default ProjectTechStack;