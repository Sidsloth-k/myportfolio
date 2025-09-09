import React from 'react';
import { motion } from 'framer-motion';

interface PowerIndicatorProps {
  element: string;
}

const PowerIndicator: React.FC<PowerIndicatorProps> = ({ element }) => {
  return (
    <div className="mt-4">
      {/* Power Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 18, ease: 'linear' }}
        className="h-1 bg-gradient-to-r from-accent to-primary rounded-full shadow-sm"
      />

      {/* Element Indicator */}
      <div className="mt-2 text-center">
        <span className="text-xs hierarchy-tertiary bg-muted/30 px-2 py-1 rounded-full text-foreground dark:text-foreground border border-border/50">
          Element: {element}
        </span>
      </div>
    </div>
  );
};

export default PowerIndicator;