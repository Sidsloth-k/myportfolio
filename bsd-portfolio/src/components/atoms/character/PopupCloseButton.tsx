import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface PopupCloseButtonProps {
  onClick: () => void;
}

const PopupCloseButton: React.FC<PopupCloseButtonProps> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/40 backdrop-blur-sm flex items-center justify-center hover:bg-muted/60 transition-colors z-10 border border-border/30"
    >
      <X className="w-4 h-4 hierarchy-primary text-foreground dark:text-foreground" />
    </motion.button>
  );
};

export default PopupCloseButton;