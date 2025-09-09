import React from 'react';
import { motion } from 'framer-motion';

const AnimeOrb: React.FC = () => (
  <motion.div
    animate={{ 
      rotate: [0, 360],
      scale: [1, 1.3, 1]
    }}
    transition={{ 
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
    className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-10 relative overflow-hidden anime-glow"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-accent via-primary to-background opacity-80"></div>
    <motion.div 
      animate={{ rotate: [0, 90, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="absolute top-4 left-3 w-16 h-1 bg-background opacity-70 rounded transform rotate-12"
    />
    <motion.div 
      animate={{ rotate: [0, -90, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
      className="absolute bottom-6 right-3 w-10 h-1 bg-background opacity-70 rounded transform -rotate-12"
    />
    <motion.div
      animate={{
        scale: [0, 2, 0],
        opacity: [0, 0.6, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1.5
      }}
      className="absolute inset-0 border-2 border-accent/50 rounded-full"
    />
    <motion.div
      animate={{ rotate: [0, -360] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-4 border-2 border-background/30 rounded-full"
    />
  </motion.div>
);

export default AnimeOrb;


