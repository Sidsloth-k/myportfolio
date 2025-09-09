import React from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '../../atoms/hero';

interface StatsGridProps {
  isInView: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({ isInView }) => {
  const stats = [
    { value: '7+', label: 'Projects Solved' },
    { value: '4+', label: 'Years Experience' },
    { value: '100%', label: 'Case Success Rate' },
    { value: '∞', label: 'Curiosity Level' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="grid grid-cols-2 gap-4 mt-8"
    >
      {stats.map((stat, index) => (
        <StatCard key={stat.label} value={stat.value} label={stat.label} />
      ))}
    </motion.div>
  );
};

export default StatsGrid;