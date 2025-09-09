import React from 'react';
import { Play, Pause } from 'lucide-react';

interface QuoteControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  quotes: any[];
  currentQuote: number;
  onQuoteSelect: (index: number) => void;
}

const QuoteControls: React.FC<QuoteControlsProps> = ({
  isPlaying,
  onTogglePlay,
  quotes,
  currentQuote,
  onQuoteSelect
}) => {
  return (
    <div className="absolute bottom-2 right-2 flex items-center space-x-2">
      <button
        onClick={onTogglePlay}
        className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/30 transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-3 h-3 text-accent" />
        ) : (
          <Play className="w-3 h-3 text-accent" />
        )}
      </button>
      <div className="flex space-x-1">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => onQuoteSelect(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentQuote ? 'bg-accent' : 'bg-accent/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuoteControls;