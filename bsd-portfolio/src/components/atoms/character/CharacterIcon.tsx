import React from 'react';
import { motion } from 'framer-motion';

interface CharacterIconProps {
  icon: string;
  image: string;
  name: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const CharacterIcon: React.FC<CharacterIconProps> = ({
  icon,
  image,
  name,
  color,
  isActive,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg transition-all duration-300 overflow-hidden ${
        isActive ? 'ring-4 ring-accent ring-opacity-50' : ''
      }`}
      onClick={handleClick}
      title={name}
    >
      <img 
        src={image} 
        alt={name}
        className="w-full h-full object-cover rounded-full"
        onError={(e) => {
          // Fallback to emoji if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.nextElementSibling!.textContent = icon;
        }}
      />
      <span className="hidden">{icon}</span>
    </motion.button>
  );
};

export default CharacterIcon;