import React from 'react';
import { motion } from 'framer-motion';

const DarkFabricAnimation: React.FC = () => {
  return (
    <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Dark fabric strips */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-r from-transparent via-gray-900/60 to-transparent"
          style={{
            width: '200%',
            height: '4px',
            left: '-50%',
            top: `${20 + i * 15}%`,
            transform: 'rotate(-15deg)'
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      {/* Shadow creatures */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-black/40"
        animate={{
          opacity: [0, 0.7, 0],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
};

export default DarkFabricAnimation;