import React from 'react';
import { motion } from 'framer-motion';
import { QuoteControls } from '../../atoms/hero';

interface Quote {
  text: string;
  author: string;
  context: string;
}

interface QuoteCarouselProps {
  quotes: Quote[];
  currentQuote: number;
  isPlaying: boolean;
  isInView: boolean;
  onTogglePlay: () => void;
  onQuoteSelect: (index: number) => void;
}

const QuoteCarousel: React.FC<QuoteCarouselProps> = ({
  quotes,
  currentQuote,
  isPlaying,
  isInView,
  onTogglePlay,
  onQuoteSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="mb-8"
    >
      <div className="relative h-32 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 anime-shadow">
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-6"
        >
          <blockquote className="text-lg italic hierarchy-primary mb-2">
            "{quotes[currentQuote].text}"
          </blockquote>
          <div className="text-sm hierarchy-tertiary">
            - {quotes[currentQuote].author}
          </div>
          <div className="text-xs hierarchy-tertiary mt-1">
            {quotes[currentQuote].context}
          </div>
        </motion.div>

        <QuoteControls
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          quotes={quotes}
          currentQuote={currentQuote}
          onQuoteSelect={onQuoteSelect}
        />
      </div>
    </motion.div>
  );
};

export default QuoteCarousel;