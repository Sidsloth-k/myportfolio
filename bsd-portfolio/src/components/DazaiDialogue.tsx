import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const DazaiDialogue: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState('');
  const [lastActivity, setLastActivity] = useState(Date.now());

  const dialogues = [
    "Ah, taking a break? Even I need rest between my brilliant schemes.",
    "You know, staring at the screen won't make Sidney's projects code themselves.",
    "Double suicide... wait, wrong context. How about we double-click that project?",
    "I see you're admiring my aesthetic choices. Impeccable taste, wouldn't you agree?",
    "The Port Mafia taught me efficiency. Perhaps you should learn from Sidney's workflow?",
    "Boredom is the enemy of creativity. Shall we explore more of this portfolio?",
    "Even Dostoyevsky would appreciate the depth of Sidney's technical skills.",
    "My ability 'No Longer Human' nullifies other abilities... but it can't nullify good design.",
    "You're as still as I am when plotting. Coincidence? I think not.",
    "The beauty of bandages is in their simplicity... much like clean code.",
    "Kunikida would have a schedule for portfolio viewing. You're more like me - spontaneous.",
    "These projects are almost as mesmerizing as my dramatic entrances."
  ];

  const resetIdleTimer = () => {
    setLastActivity(Date.now());
    if (isVisible) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'scroll', 'touchstart']; // Removed keypress to avoid interfering with normal keyboard operations
    
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer, true);
      });
    };
  }, [isVisible]);

  useEffect(() => {
    const checkIdle = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActivity;
      
      // Show dialogue after 8 seconds of inactivity
      if (idleTime > 8000 && !isVisible) {
        const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
        setCurrentDialogue(randomDialogue);
        setIsVisible(true);
      }
    }, 1000);

    return () => clearInterval(checkIdle);
  }, [lastActivity, isVisible, dialogues]);

  const handleClose = () => {
    setIsVisible(false);
    setLastActivity(Date.now());
  };

  return (
    <>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="fixed bottom-8 right-8 z-50 max-w-sm"
        >
          {/* Dazai Avatar */}
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="relative"
          >
            {/* Speech Bubble */}
            <div className="relative bg-white rounded-2xl p-4 mb-4 anime-shadow border-2 border-dazai-gold/30">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute -top-2 -right-2 w-6 h-6 bg-dazai-brown text-white rounded-full flex items-center justify-center hover:bg-dazai-dark transition-colors"
              >
                <X size={14} />
              </button>
              
              {/* Dialogue Text */}
              <div className="text-dazai-dark text-sm leading-relaxed pr-4">
                {currentDialogue}
              </div>
              
              {/* Speech Bubble Tail */}
              <div className="absolute bottom-0 right-8 transform translate-y-full">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-white"></div>
                <div className="absolute top-0 left-0 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-dazai-gold/30 transform translate-y-[2px]"></div>
              </div>
            </div>

            {/* Dazai Character Representation */}
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [-1, 1, -1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-16 h-16 bg-gradient-to-br from-dazai-brown to-dazai-dark rounded-full border-4 border-dazai-gold/50 relative overflow-hidden anime-glow ml-auto mr-4"
            >
              {/* Character silhouette/representation */}
              <div className="absolute inset-0 bg-gradient-to-t from-dazai-dark via-dazai-brown to-dazai-beige opacity-80"></div>
              
              {/* Bandage representation */}
              <div className="absolute top-2 left-1 w-8 h-1 bg-dazai-cream opacity-70 rounded transform rotate-12"></div>
              <div className="absolute bottom-3 right-1 w-6 h-1 bg-dazai-cream opacity-70 rounded transform -rotate-12"></div>
              
              {/* Eye representation */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-dazai-gold rounded-full"></div>
            </motion.div>

            {/* Character Label */}
            <div className="text-center mt-2">
              <div className="text-xs text-dazai-brown font-medium">Dazai Osamu</div>
              <div className="text-xs text-dazai-muted">Port Mafia Consultant</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default DazaiDialogue;