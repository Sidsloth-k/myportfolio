import React from 'react';
import { motion } from 'framer-motion';
import { CharacterQuote, PowerIndicator, FloatingIndicator } from '../../atoms/character';
import PowerAnimationContainer from './PowerAnimationContainer';

interface Character {
  id: string;
  name: string;
  icon: string;
  image: string;
  color: string;
  ability: string;
  quotes: string[];
  powerAnimation: string;
  element: string;
}

interface CharacterPopupContentProps {
  character: Character;
  currentQuoteIndex: number;
  showPowerAnimation: boolean;
}

const CharacterPopupContent: React.FC<CharacterPopupContentProps> = ({
  character,
  currentQuoteIndex,
  showPowerAnimation
}) => {
  return (
    <div className="relative">
      {/* Power Animation */}
      <PowerAnimationContainer
        animationType={character.powerAnimation}
        isVisible={showPowerAnimation}
      />
      
      {/* Character Image */}
      <div className="flex justify-center mb-6">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center shadow-xl overflow-hidden`}>
          <img 
            src={character.image} 
            alt={character.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling!.textContent = character.icon;
            }}
          />
          <span className="text-4xl hidden">{character.icon}</span>
        </div>
      </div>

      {/* Character Info */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold hierarchy-primary mb-2 text-foreground dark:text-foreground">
          {character.name}
        </h3>
        <p className="text-accent font-semibold mb-4 text-accent dark:text-accent">
          Ability: {character.ability}
        </p>
        
        {/* Quote Display */}
        <div className="min-h-[80px] flex items-center justify-center mb-4">
          <CharacterQuote 
            quote={character.quotes[currentQuoteIndex]} 
            index={currentQuoteIndex} 
          />
        </div>

        <PowerIndicator element={character.element} />
      </div>

      {/* Floating animation indicator */}
      <FloatingIndicator />
    </div>
  );
};

export default CharacterPopupContent;