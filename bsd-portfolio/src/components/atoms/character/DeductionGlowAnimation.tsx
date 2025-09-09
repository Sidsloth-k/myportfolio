import React from 'react';
import { motion } from 'framer-motion';

const DeductionGlowAnimation: React.FC = () => {
  return (
    <motion.div className="absolute inset-0 pointer-events-none">
      {/* Mind reading aura */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-teal-600/20 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* Deduction symbols */}
      {['?', '!', '∴', '∵'].map((symbol, i) => (
        <motion.div
          key={symbol}
          className="absolute text-green-400 font-bold text-lg"
          style={{
            left: `${25 + i * 20}%`,
            top: `${30 + (i % 2) * 20}%`
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DeductionGlowAnimation;