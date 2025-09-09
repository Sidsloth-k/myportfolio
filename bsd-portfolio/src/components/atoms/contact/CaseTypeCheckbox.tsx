import React from 'react';
import { motion } from 'framer-motion';

interface CaseType {
  id: string;
  label: string;
  icon: string;
}

interface CaseTypeCheckboxProps {
  caseType: CaseType;
  isSelected: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CaseTypeCheckbox: React.FC<CaseTypeCheckboxProps> = ({
  caseType,
  isSelected,
  onChange
}) => {
  return (
    <motion.label
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-border hover:border-accent/50 hierarchy-primary'
      }`}
    >
      <input
        type="checkbox"
        name="caseType"
        value={caseType.id}
        checked={isSelected}
        onChange={onChange}
        className="sr-only"
        aria-label={caseType.label}
      />
      <span className="text-lg">{caseType.icon}</span>
      <span className="text-sm font-medium">{caseType.label}</span>
    </motion.label>
  );
};

export default CaseTypeCheckbox; 