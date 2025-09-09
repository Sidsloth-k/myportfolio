import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  stat: {
    label: string;
    value: string;
  };
  index: number;
  isInView: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, isInView }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: 1 + index * 0.1, type: 'spring' }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="text-center p-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:border-accent/50 transition-all duration-300"
    >
      <motion.div
        animate={isInView ? { 
          scale: [1, 1.1, 1],
          color: ['var(--foreground)', 'var(--accent)', 'var(--foreground)']
        } : {}}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatDelay: 3,
          delay: index * 0.2
        }}
        className="text-2xl font-bold hierarchy-primary mb-1"
      >
        {stat.value}
      </motion.div>
      <div className="text-sm hierarchy-tertiary leading-tight">{stat.label}</div>
    </motion.div>
  );
};

export default StatCard;