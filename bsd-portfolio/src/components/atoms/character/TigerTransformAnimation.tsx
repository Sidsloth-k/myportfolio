import React from 'react';
import { motion } from 'framer-motion';

const TigerTransformAnimation: React.FC = () => {
  return (
    <motion.div className="absolute inset-0 pointer-events-none">
      {/* Golden energy waves */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border-2 border-yellow-400/40 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      {/* Tiger stripes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`stripe-${i}`}
          className="absolute bg-orange-400/30 rounded-full"
          style={{
            width: '3px',
            height: '40px',
            left: `${30 + i * 10}%`,
            top: '30%'
          }}
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.1,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      ))}
    </motion.div>
  );
};

export default TigerTransformAnimation;