import React from 'react';
import { motion } from 'framer-motion';
import { ProjectFeatureCard } from '../../atoms/project-detail';

interface ProjectFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: string;
  impact: string;
}

interface ProjectFeaturesGridProps {
  features: ProjectFeature[];
  isInView: boolean;
}

const ProjectFeaturesGrid: React.FC<ProjectFeaturesGridProps> = ({ features, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {features.map((feature, index) => (
        <ProjectFeatureCard
          key={feature.title}
          feature={feature}
          index={index}
          isInView={isInView}
        />
      ))}
    </motion.div>
  );
};

export default ProjectFeaturesGrid;