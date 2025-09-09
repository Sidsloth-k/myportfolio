import React from 'react';
import { motion } from 'framer-motion';

interface SkillsSectionHeaderProps {
  isInView: boolean;
}

const SkillsSectionHeader: React.FC<SkillsSectionHeaderProps> = ({ isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold hierarchy-primary mb-4">
        Detective Arsenal
      </h2>
      <p className="text-lg hierarchy-secondary max-w-2xl mx-auto">
        Core abilities honed through years of solving digital mysteries
      </p>
    </motion.div>
  );
};

export default SkillsSectionHeader;