import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../ui/button';

interface SkillsViewMoreButtonProps {
  isInView: boolean;
  onViewMore: () => void;
}

const SkillsViewMoreButton: React.FC<SkillsViewMoreButtonProps> = ({ isInView, onViewMore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="text-center"
    >
      <Button
        onClick={onViewMore}
        size="lg"
        variant="outline"
        className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4 text-lg group"
      >
        Explore All Abilities
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="ml-2"
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      </Button>
      
      <p className="text-sm hierarchy-tertiary mt-3">
        Discover the complete detective arsenal and case studies
      </p>
    </motion.div>
  );
};

export default SkillsViewMoreButton;