import React from 'react';
import { motion } from 'framer-motion';

interface HeroSubtitleProps {
  isInView: boolean;
}

const HeroSubtitle: React.FC<HeroSubtitleProps> = ({ isInView }) => {
  return (
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="text-xl md:text-2xl hierarchy-secondary mb-8 leading-relaxed"
    >
      Solving digital mysteries through
      <span className="text-accent font-semibold"> IT mastery</span>,
      <span className="text-primary font-semibold"> design elegance</span>, and
      <span className="text-secondary font-semibold"> marketing strategy</span>
    </motion.p>
  );
};

export default HeroSubtitle;