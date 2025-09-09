import React from 'react';
import { motion } from 'framer-motion';
import { ProjectMetricCard } from '../../atoms/project-detail';

interface ProjectMetricsGridProps {
  metrics: Array<{
    metric: string;
    value: string | number;
  }>;
  isInView: boolean;
}

const ProjectMetricsGrid: React.FC<ProjectMetricsGridProps> = ({ metrics, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
    >
      {metrics.map((item, index) => (
        <ProjectMetricCard
          key={item.metric}
          metric={item.metric}
          value={item.value}
          index={index}
          isInView={isInView}
        />
      ))}
    </motion.div>
  );
};

export default ProjectMetricsGrid;