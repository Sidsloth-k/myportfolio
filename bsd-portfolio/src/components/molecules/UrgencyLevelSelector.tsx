import React from 'react';
import { UrgencyLevelRadio } from '../atoms';
import ContactFormField from './contact/ContactFormField';
import { Clock } from 'lucide-react';

interface UrgencyLevel {
  id: string;
  label: string;
  color: string;
  description: string;
}

interface UrgencyLevelSelectorProps {
  urgencyLevels: UrgencyLevel[];
  selectedUrgency: string;
  onUrgencyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UrgencyLevelSelector: React.FC<UrgencyLevelSelectorProps> = ({
  urgencyLevels,
  selectedUrgency,
  onUrgencyChange
}) => {
  return (
    <ContactFormField
      label="Case Urgency"
      icon={Clock}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {urgencyLevels.map((level) => (
          <UrgencyLevelRadio
            key={level.id}
            urgencyLevel={level}
            isSelected={selectedUrgency === level.id}
            onChange={onUrgencyChange}
          />
        ))}
      </div>
    </ContactFormField>
  );
};

export default UrgencyLevelSelector; 