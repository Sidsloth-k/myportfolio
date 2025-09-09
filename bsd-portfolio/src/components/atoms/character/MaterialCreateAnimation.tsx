import React from 'react';
import { motion } from 'framer-motion';

const MaterialCreateAnimation: React.FC = () => {
  return (
    <motion.div className="absolute inset-0 pointer-events-none">
      {/* Creation sparks */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            left: '50%',
            top: '50%'
          }}
          animate={{
            x: Math.cos((i * 30) * Math.PI / 180) * 50,
            y: Math.sin((i * 30) * Math.PI / 180) * 50,
            opacity: [0, 1, 0],
            scale: [0, 2, 0]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.05,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      ))}
      
      {/* Materialization grid */}
      <motion.div
        className="absolute inset-0 border border-blue-400/30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
        animate={{
          opacity: [0, 0.8, 0]
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

export default MaterialCreateAnimation;