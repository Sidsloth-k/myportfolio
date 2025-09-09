import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PopupCloseButton } from '../../atoms/character';
import { CharacterSelector, CharacterPopupContent } from '../../molecules/character';

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

const characters: Character[] = [
  {
    id: 'dazai',
    name: 'Dazai Osamu',
    icon: '🕴️',
    image: '/images/characters/dazai.svg',
    color: 'from-amber-500 to-orange-600',
    ability: 'No Longer Human',
    powerAnimation: 'nullification',
    element: 'void',
    quotes: [
      "Every mystery has a solution, but some solutions create new mysteries.",
      "In the world of debugging, I'm the ultimate ability - I nullify all bugs!",
      "Code without bugs? That's not living, that's just existing.",
      "The perfect algorithm is like the perfect suicide - it doesn't exist.",
      "I can nullify any supernatural bug, but regular bugs... they're still a mystery."
    ]
  },
  {
    id: 'akutagawa',
    name: 'Akutagawa Ryunosuke',
    icon: '⚔️',
    image: '/images/characters/akutagawa.svg',
    color: 'from-gray-800 to-black',
    ability: 'Rashomon',
    powerAnimation: 'darkFabric',
    element: 'shadow',
    quotes: [
      "Code must be written with the fury of a thousand dark beasts!",
      "My algorithms cut through problems like Rashomon cuts through flesh.",
      "Elegant code is for the weak. Brutal efficiency is the way.",
      "I will surpass Dazai's coding abilities, no matter the cost!",
      "The darkness of debugging reveals the true nature of a programmer."
    ]
  },
  {
    id: 'atsushi',
    name: 'Nakajima Atsushi',
    icon: '🐅',
    image: '/images/characters/atsushi.svg',
    color: 'from-yellow-400 to-orange-500',
    ability: 'Beast Beneath the Moonlight',
    powerAnimation: 'tigerTransform',
    element: 'light',
    quotes: [
      "Even the most complex problems can be solved with determination!",
      "My code transforms and adapts, just like the tiger within.",
      "Every bug I encounter makes me stronger as a developer.",
      "I may be new to this, but I'll give it everything I've got!",
      "The moonlight of inspiration guides my coding journey."
    ]
  },
  {
    id: 'chuuya',
    name: 'Nakahara Chuuya',
    icon: '🌪️',
    image: '/images/characters/chuuya.svg',
    color: 'from-red-600 to-purple-700',
    ability: 'For the Tainted Sorrow',
    powerAnimation: 'gravityField',
    element: 'gravity',
    quotes: [
      "My code has the power to bend the very fabric of applications!",
      "Gravity manipulation? More like DOM manipulation mastery!",
      "I'll crush these bugs with the force of a thousand gravitons!",
      "Elegant solutions require a delicate balance of power and finesse.",
      "The weight of responsibility drives every line of code I write."
    ]
  },
  {
    id: 'ranpo',
    name: 'Edogawa Ranpo',
    icon: '🕵️',
    image: '/images/characters/ranpo.svg',
    color: 'from-green-500 to-teal-600',
    ability: 'Ultra Deduction',
    powerAnimation: 'deductionGlow',
    element: 'mind',
    quotes: [
      "The solution is elementary! I can see through any code mystery.",
      "My deductive reasoning makes debugging child's play.",
      "Every error pattern tells a story - I just need to read it.",
      "The greatest detective ability? Knowing exactly where to look.",
      "Logic and intuition combined create the perfect debugging mindset."
    ]
  },
  {
    id: 'yosano',
    name: 'Yosano Akiko',
    icon: '⚕️',
    image: '/images/characters/yosano.svg',
    color: 'from-pink-500 to-rose-600',
    ability: 'Thou Shalt Not Die',
    powerAnimation: 'materialCreate',
    element: 'life',
    quotes: [
      "I can heal any broken code, no matter how damaged it seems.",
      "Sometimes you need to break things completely before you can fix them properly.",
      "My debugging process might be intense, but the results are worth it.",
      "Every crashed application is just waiting for the right treatment.",
      "Precision and care - that's what separates good code from great code."
    ]
  }
];

const CharacterPopupSystem: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showPowerAnimation, setShowPowerAnimation] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Idle detection
  useEffect(() => {
    const IDLE_TIMEOUT = 10000; // 10 seconds of inactivity
    const IDLE_CHECK_INTERVAL = 5000; // Check every 5 seconds

    const checkIdle = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      
      if (timeSinceLastActivity > IDLE_TIMEOUT && !isIdle && !isVisible) {
        setIsIdle(true);
        // Show a random character popup when idle
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        setActiveCharacter(randomCharacter);
        setCurrentQuoteIndex(Math.floor(Math.random() * randomCharacter.quotes.length));
        setIsVisible(true);
        setShowPowerAnimation(true);
      }
    };

    const idleCheckInterval = setInterval(checkIdle, IDLE_CHECK_INTERVAL);

    return () => {
      clearInterval(idleCheckInterval);
    };
  }, [lastActivity, isIdle, isVisible]);

  // Activity tracking with different behaviors for different interactions
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    
    const updateActivity = () => {
      setLastActivity(Date.now());
      if (isIdle) {
        setIsIdle(false);
      }
    };

    const handlePageClick = (e: Event) => {
      // Check if the click is outside the popup and character selector
      const target = e.target as Element;
      const popup = document.querySelector('.character-popup');
      const selector = document.querySelector('.character-selector');
      
      // If popup is visible and click is outside both popup and selector, close it
      if (isVisible && popup && selector) {
        const isClickInPopup = popup.contains(target);
        const isClickInSelector = selector.contains(target);
        
        if (!isClickInPopup && !isClickInSelector) {
          setIsVisible(false);
          setActiveCharacter(null);
          setShowPowerAnimation(false);
          setIsIdle(false);
        }
      }
      
      updateActivity();
    };

    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Set a new timeout to close popup after 2 seconds of no scrolling
      scrollTimeout = setTimeout(() => {
        if (isVisible && !isIdle) {
          setIsVisible(false);
          setActiveCharacter(null);
          setShowPowerAnimation(false);
        }
      }, 2000);
      
      updateActivity();
    };

    const handleOtherInteractions = () => {
      updateActivity();
    };

    // Add event listeners - removed keypress to avoid interfering with normal keyboard operations
    document.addEventListener('click', handlePageClick, true);
    document.addEventListener('scroll', handleScroll, true);
    document.addEventListener('mousemove', handleOtherInteractions, true);
    document.addEventListener('touchstart', handleOtherInteractions, true);

    return () => {
      document.removeEventListener('click', handlePageClick, true);
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('mousemove', handleOtherInteractions, true);
      document.removeEventListener('touchstart', handleOtherInteractions, true);
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [isIdle, isVisible]);

  const handleCharacterClick = (character: Character) => {
    setActiveCharacter(character);
    setCurrentQuoteIndex(0);
    setIsVisible(true);
    setShowPowerAnimation(true);
    setIsIdle(false);
  };

  // Auto-cycle quotes and manage popup visibility
  useEffect(() => {
    if (isVisible && activeCharacter) {
      const quoteInterval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % activeCharacter.quotes.length);
      }, 3000);

      // Auto-close after 18 seconds (or 8 seconds for idle popups)
      const autoCloseTime = isIdle ? 8000 : 18000;
      const timer = setTimeout(() => {
        setIsVisible(false);
        setActiveCharacter(null);
        setShowPowerAnimation(false);
        setIsIdle(false);
      }, autoCloseTime);

      return () => {
        clearInterval(quoteInterval);
        clearTimeout(timer);
      };
    }
  }, [isVisible, activeCharacter, isIdle]);

  const handleClose = () => {
    setIsVisible(false);
    setActiveCharacter(null);
    setShowPowerAnimation(false);
    setIsIdle(false);
  };

  const handlePopupClick = (e: React.MouseEvent) => {
    // Prevent clicks inside the popup from bubbling up
    e.stopPropagation();
  };

  return (
    <>
      {/* Character Selector */}
      <CharacterSelector
        characters={characters}
        activeCharacter={activeCharacter}
        onCharacterClick={handleCharacterClick}
      />

      {/* Character Popup */}
      {isVisible && activeCharacter && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50"
          onClick={handlePopupClick}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-sm w-full rounded-3xl p-6 overflow-hidden character-popup backdrop-blur-md"
          >
            <PopupCloseButton onClick={handleClose} />
            
            <CharacterPopupContent
              character={activeCharacter}
              currentQuoteIndex={currentQuoteIndex}
              showPowerAnimation={showPowerAnimation}
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default CharacterPopupSystem;