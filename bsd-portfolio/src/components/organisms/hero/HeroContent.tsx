import React from 'react';
import { motion } from 'framer-motion';
import { AgencyBadge, HeroTitle, HeroSubtitle } from '../../atoms/hero';
import { QuoteCarousel, HeroCTAButtons } from '../../molecules/hero';

interface Quote {
  text: string;
  author: string;
  context: string;
}

interface HeroContentProps {
  isInView: boolean;
  quotes: Quote[];
  currentQuote: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onQuoteSelect: (index: number) => void;
  onBeginInvestigation: () => void;
  onViewCaseFiles: () => void;
}

const HeroContent: React.FC<HeroContentProps> = ({
  isInView,
  quotes,
  currentQuote,
  isPlaying,
  onTogglePlay,
  onQuoteSelect,
  onBeginInvestigation,
  onViewCaseFiles
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1 }}
      className="text-center lg:text-left"
    >
      <AgencyBadge isInView={isInView} />
      <HeroTitle isInView={isInView} />
      <HeroSubtitle isInView={isInView} />
      <QuoteCarousel
        quotes={quotes}
        currentQuote={currentQuote}
        isPlaying={isPlaying}
        isInView={isInView}
        onTogglePlay={onTogglePlay}
        onQuoteSelect={onQuoteSelect}
      />
      <HeroCTAButtons
        isInView={isInView}
        onBeginInvestigation={onBeginInvestigation}
        onViewCaseFiles={onViewCaseFiles}
      />
    </motion.div>
  );
};

export default HeroContent;