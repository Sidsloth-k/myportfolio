import React from 'react';
import { motion } from 'framer-motion';

interface CharacterQuoteProps {
  quote: string;
  index: number;
}

const CharacterQuote: React.FC<CharacterQuoteProps> = ({ quote, index }) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <p className="text-lg hierarchy-primary italic leading-relaxed character-quote">
        "{quote}"
      </p>
    </motion.div>
  );
};

export default CharacterQuote;