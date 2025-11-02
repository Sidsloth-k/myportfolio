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
  isDisabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CaseTypeCheckbox: React.FC<CaseTypeCheckboxProps> = ({
  caseType,
  isSelected,
  isDisabled = false,
  onChange
}) => {
  return (
    <motion.label
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`flex items-center space-x-3 p-3 border rounded-lg transition-all duration-300 ${
        isDisabled
          ? 'border-border/50 opacity-50 cursor-not-allowed'
          : isSelected
          ? 'border-accent bg-accent/10 text-accent cursor-pointer'
          : 'border-border hover:border-accent/50 hierarchy-primary cursor-pointer'
      }`}
    >
      <input
        type="checkbox"
        name="caseType"
        value={caseType.id}
        checked={isSelected}
        onChange={onChange}
        disabled={isDisabled}
        className="sr-only"
        aria-label={caseType.label}
        aria-disabled={isDisabled}
      />
      <span className="text-lg">{caseType.icon}</span>
      <span className="text-sm font-medium">{caseType.label}</span>
    </motion.label>
  );
};

export default CaseTypeCheckbox; 