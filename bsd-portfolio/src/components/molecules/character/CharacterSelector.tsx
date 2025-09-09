import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { CharacterIcon } from '../../atoms/character';

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

interface CharacterSelectorProps {
  characters: Character[];
  activeCharacter: Character | null;
  onCharacterClick: (character: Character) => void;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  activeCharacter,
  onCharacterClick
}) => {
  const handleSelectorClick = (e: React.MouseEvent) => {
    // Prevent clicks inside the selector from bubbling up
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-50"
      onClick={handleSelectorClick}
    >
      <div className="rounded-2xl p-4 character-selector backdrop-blur-md">
        <div className="flex items-center space-x-2 mb-3">
          <MessageCircle className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium hierarchy-primary text-foreground dark:text-foreground">Character Chat</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {characters.map((character) => (
            <CharacterIcon
              key={character.id}
              icon={character.icon}
              image={character.image}
              name={character.name}
              color={character.color}
              isActive={activeCharacter?.id === character.id}
              onClick={() => onCharacterClick(character)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterSelector;