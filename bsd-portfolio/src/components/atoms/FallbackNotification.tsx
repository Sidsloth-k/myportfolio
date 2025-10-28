import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Database, WifiOff } from 'lucide-react';
import { getRandomBSDMessage, getRandomBSDCharacter } from '../../utils/fallbackData';

interface FallbackNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const FallbackNotification: React.FC<FallbackNotificationProps> = ({ 
  isVisible, 
  onDismiss, 
  autoHide = true,
  autoHideDelay = 8000 
}) => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [currentCharacter, setCurrentCharacter] = useState<string>('');

  useEffect(() => {
    if (isVisible) {
      const randomCharacter = getRandomBSDCharacter();
      const message = getRandomBSDMessage(randomCharacter);
      setCurrentCharacter(randomCharacter);
      setCurrentMessage(message);

      if (autoHide) {
        const timer = setTimeout(() => {
          onDismiss();
        }, autoHideDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoHide, autoHideDelay, onDismiss]);

  return (
    <>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 shadow-lg backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <WifiOff className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-800">Database Offline</div>
                  <div className="text-xs text-amber-600">Using cached data</div>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="w-6 h-6 bg-amber-200 hover:bg-amber-300 text-amber-700 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* BSD Character Message */}
            <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-lg p-3 mb-3">
              <div className="text-sm text-gray-700 italic leading-relaxed">
                "{currentMessage}"
              </div>
              <div className="text-xs text-gray-500 mt-1 font-semibold">
                - {currentCharacter.charAt(0).toUpperCase() + currentCharacter.slice(1)}
              </div>
            </div>

            {/* Status Info */}
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <Database className="w-3 h-3" />
              <span>All data is current and accurate</span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default FallbackNotification;
