import React from 'react';
import { motion } from 'framer-motion';

interface UrgencyLevel {
  id: string;
  label: string;
  color: string;
  description: string;
}

interface UrgencyLevelRadioProps {
  urgencyLevel: UrgencyLevel;
  isSelected: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UrgencyLevelRadio: React.FC<UrgencyLevelRadioProps> = ({
  urgencyLevel,
  isSelected,
  onChange
}) => {
  return (
    <motion.label
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-accent bg-accent/10'
          : 'border-border hover:border-accent/50'
      }`}
    >
      <input
        type="radio"
        name="urgency"
        value={urgencyLevel.id}
        checked={isSelected}
        onChange={onChange}
        className="sr-only"
        aria-label={urgencyLevel.label}
      />
      <span className={`text-sm font-medium ${urgencyLevel.color} mb-1`}>{urgencyLevel.label}</span>
      <span className="text-xs hierarchy-tertiary text-center">{urgencyLevel.description}</span>
    </motion.label>
  );
};

export default UrgencyLevelRadio; 