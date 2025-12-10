import React from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '../../atoms/skills';

interface SkillsStatsGridProps {
  isInView: boolean;
}

const SkillsStatsGrid: React.FC<SkillsStatsGridProps> = ({ isInView }) => {
  const stats = [
    { label: 'Technologies Mastered', value: '15+' },
    { label: 'Years of Experience', value: 'To be updated' },
    { label: 'Project Success Rate', value: '100%' },
    { label: 'Learning Curiosity', value: '∞' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
    >
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          stat={stat}
          index={index}
          isInView={isInView}
        />
      ))}
    </motion.div>
  );
};

export default SkillsStatsGrid;