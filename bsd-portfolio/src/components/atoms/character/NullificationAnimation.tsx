import React from 'react';
import { motion } from 'framer-motion';

const NullificationAnimation: React.FC = () => {
  return (
    <motion.div className="absolute inset-0 pointer-events-none">
      {/* Nullification waves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border-2 border-blue-400/30 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 2, 4],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      ))}
      
      {/* Void particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`void-${i}`}
          className="absolute w-2 h-2 bg-blue-400/50 rounded-full"
          style={{
            left: '50%',
            top: '50%'
          }}
          animate={{
            x: Math.cos((i * 45) * Math.PI / 180) * 60,
            y: Math.sin((i * 45) * Math.PI / 180) * 60,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      ))}
    </motion.div>
  );
};

export default NullificationAnimation;