import React from 'react';
import { motion } from 'framer-motion';

interface DazaiQuoteProps {
  isInView: boolean;
}

const DazaiQuote: React.FC<DazaiQuoteProps> = ({ isInView }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="italic text-accent text-lg max-w-2xl mx-auto bg-accent/10 p-6 rounded-2xl border border-accent/20"
    >
      "Every case tells a story, and every solution writes a new chapter in the art of problem-solving."
      <div className="text-sm font-semibold mt-2 hierarchy-primary">- Detective Sidney</div>
    </motion.div>
  );
};

export default DazaiQuote;