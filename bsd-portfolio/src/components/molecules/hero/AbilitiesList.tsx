import React from 'react';
import { AbilityCard } from '../../atoms/hero';

interface Ability {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  specialty: string;
}

interface AbilitiesListProps {
  abilities: Ability[];
  isInView: boolean;
}

const AbilitiesList: React.FC<AbilitiesListProps> = ({ abilities, isInView }) => {
  return (
    <div className="space-y-6">
      {abilities.map((ability, index) => (
        <AbilityCard
          key={ability.name}
          ability={ability}
          index={index}
          isInView={isInView}
        />
      ))}
    </div>
  );
};

export default AbilitiesList;