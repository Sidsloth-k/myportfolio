import React from 'react';
import { motion } from 'framer-motion';

const GravityFieldAnimation: React.FC = () => {
  return (
    <motion.div className="absolute inset-0 pointer-events-none">
      {/* Gravity field distortion */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-purple-600/30 via-transparent to-transparent"
        animate={{
          scale: [0.5, 1.5, 0.5],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* Floating objects affected by gravity */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-red-500/60 rounded-full"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 15, 0, -15, 0],
            scale: [1, 0.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 4,
            delay: i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </motion.div>
  );
};

export default GravityFieldAnimation;