import React from 'react';
import CharacterArcSection from '../components/CharacterArcSection';
import CareerProgressionSection from '../components/CareerProgressionSection';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-20">
      <CharacterArcSection />
      <CareerProgressionSection />
    </div>
  );
};

export default AboutPage; 