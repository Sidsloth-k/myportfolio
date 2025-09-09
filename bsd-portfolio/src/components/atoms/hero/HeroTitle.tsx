import React from 'react';
import { motion } from 'framer-motion';

interface HeroTitleProps {
  isInView: boolean;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ isInView }) => {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="text-5xl md:text-7xl font-bold hierarchy-primary mb-6 leading-tight"
    >
      Detective
      <span className="block text-transparent bg-gradient-to-r from-accent to-primary bg-clip-text">
        Sidney
      </span>
    </motion.h1>
  );
};

export default HeroTitle;