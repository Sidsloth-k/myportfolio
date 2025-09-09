import React from 'react';
import { motion } from 'framer-motion';
import { DazaiQuote } from '../../atoms';

interface ContactSectionHeaderProps {
  isInView: boolean;
}

const ContactSectionHeader: React.FC<ContactSectionHeaderProps> = ({ isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-6xl font-bold hierarchy-primary mb-6">
        Submit Your Case
      </h2>
      <p className="text-xl hierarchy-secondary max-w-3xl mx-auto mb-8">
        Have a digital mystery that needs solving? The Armed Detective Agency 
        is ready to take on your most challenging IT, design, and marketing investigations.
      </p>
      
      <DazaiQuote isInView={isInView} />
    </motion.div>
  );
};

export default ContactSectionHeader;