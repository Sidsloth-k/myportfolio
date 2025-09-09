import React from 'react';
import { motion } from 'framer-motion';

const FloatingIndicator: React.FC = () => {
  return (
    <motion.div
      animate={{ 
        y: [0, -10, 0],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full"
    />
  );
};

export default FloatingIndicator;