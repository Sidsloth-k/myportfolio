import React from 'react';
import { motion } from 'framer-motion';

const ContactBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 opacity-30">
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"
      />
    </div>
  );
};

export default ContactBackground;