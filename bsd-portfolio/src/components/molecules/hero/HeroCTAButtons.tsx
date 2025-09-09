import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Button } from '../../ui/button';

interface HeroCTAButtonsProps {
  isInView: boolean;
  onBeginInvestigation: () => void;
  onViewCaseFiles: () => void;
}

const HeroCTAButtons: React.FC<HeroCTAButtonsProps> = ({
  isInView,
  onBeginInvestigation,
  onViewCaseFiles
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
    >
      <Button
        size="lg"
        className="bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent text-accent-foreground px-8 py-4 text-lg anime-shadow"
        onClick={onBeginInvestigation}
      >
        Begin Investigation
        <ArrowDown className="w-5 h-5 ml-2" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg"
        onClick={onViewCaseFiles}
      >
        View Case Files
      </Button>
    </motion.div>
  );
};

export default HeroCTAButtons;