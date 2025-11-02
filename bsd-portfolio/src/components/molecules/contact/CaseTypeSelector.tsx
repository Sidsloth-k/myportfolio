import React from 'react';
import { CaseTypeCheckbox } from '../../atoms';
import ContactFormField from './ContactFormField';
import { MessageSquare } from 'lucide-react';

interface CaseType {
  id: string;
  label: string;
  icon: string;
}

interface CaseTypeSelectorProps {
  caseTypes: CaseType[];
  selectedCaseTypes: string[];
  onCaseTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  validationMessage?: string;
  isFieldValid?: boolean;
}

const CaseTypeSelector: React.FC<CaseTypeSelectorProps> = ({
  caseTypes,
  selectedCaseTypes,
  onCaseTypeChange,
  error,
  validationMessage,
  isFieldValid
}) => {
  return (
    <ContactFormField
      label="Case Type"
      icon={MessageSquare}
      required
      error={error}
      validationMessage={validationMessage}
      isFieldValid={isFieldValid}
      additionalInfo={`(${selectedCaseTypes.length}/3 selected)`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {caseTypes.map((type) => {
          const isSelected = selectedCaseTypes.includes(type.id);
          const isDisabled = !isSelected && selectedCaseTypes.length >= 3;
          return (
            <CaseTypeCheckbox
              key={type.id}
              caseType={type}
              isSelected={isSelected}
              isDisabled={isDisabled}
              onChange={onCaseTypeChange}
            />
          );
        })}
      </div>
    </ContactFormField>
  );
};

export default CaseTypeSelector; 