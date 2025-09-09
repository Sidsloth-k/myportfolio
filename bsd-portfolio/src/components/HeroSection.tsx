import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { HeroBackground } from './atoms/hero';
import { HeroContent, DetectiveAbilities } from './organisms/hero';
import PersonalDetailsSection from './PersonalDetailsSection';

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const isInView = useInView(containerRef, { once: true });
  
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  const heroQuotes = [
    {
      text: "Every mystery has a solution waiting to be discovered",
      author: "Detective's Creed",
      context: "The foundation of all problem-solving"
    },
    {
      text: "In the world of code, bugs are just unsolved cases",
      author: "Sidney's Philosophy",
      context: "Debugging with detective precision"
    },
    {
      text: "Design is the art of making the complex beautifully simple",
      author: "UX Detective Approach", 
      context: "User experience through investigation"
    },
    {
      text: "Every great solution starts with understanding the human story",
      author: "Marketing Detective Mindset",
      context: "Connecting with audiences authentically"
    }
  ];

  // Auto-rotate quotes
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % heroQuotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, heroQuotes.length]);

  const handleBeginInvestigation = () => {
    const nextSection = document.querySelector('#personal-details');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewCaseFiles = () => {
    window.location.href = '/projects';
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleQuoteSelect = (index: number) => {
    setCurrentQuote(index);
  };

  return (
    <>
      <section ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <HeroBackground y1={y1} y2={y2} opacity={opacity} />

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <HeroContent
              isInView={isInView}
              quotes={heroQuotes}
              currentQuote={currentQuote}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onQuoteSelect={handleQuoteSelect}
              onBeginInvestigation={handleBeginInvestigation}
              onViewCaseFiles={handleViewCaseFiles}
            />

            {/* Right Column - Detective Abilities */}
            <DetectiveAbilities isInView={isInView} />
          </div>
        </div>

        {/* Scroll Indicator */}
        
      </section>

      {/* Personal Details Section */}
      <div id="personal-details">
        <PersonalDetailsSection />
      </div>
    </>
  );
};

export default HeroSection;