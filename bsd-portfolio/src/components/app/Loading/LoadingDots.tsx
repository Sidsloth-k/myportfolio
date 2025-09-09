import React from 'react';
import { motion } from 'framer-motion';

const LoadingDots: React.FC = () => (
  <div className="flex justify-center space-x-3">
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.3, 1]
        }}
        transition={{ 
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.2
        }}
        className="w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full"
      />
    ))}
  </div>
);

export default LoadingDots;


