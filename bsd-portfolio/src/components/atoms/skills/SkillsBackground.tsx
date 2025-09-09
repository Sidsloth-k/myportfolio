import React from 'react';
import { motion } from 'framer-motion';

const SkillsBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 opacity-20">
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-10 left-20 w-48 h-48 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-full blur-2xl"
      />
    </div>
  );
};

export default SkillsBackground;