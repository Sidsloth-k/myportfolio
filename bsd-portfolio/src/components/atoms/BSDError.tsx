import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Database, Wifi, WifiOff } from 'lucide-react';
import { getRandomBSDMessage, getRandomBSDCharacter, BSD_DATABASE_ERROR_MESSAGES } from '../../utils/fallbackData';
import { RetryManager } from '../../utils/retryManager';

interface BSDErrorProps {
  error?: string | null;
  onRetry?: () => void;
  character?: keyof typeof BSD_DATABASE_ERROR_MESSAGES;
  showRetryButton?: boolean;
  className?: string;
}

const BSDError: React.FC<BSDErrorProps> = ({ 
  error, 
  onRetry, 
  character = 'dazai',
  showRetryButton = true,
  className = ""
}) => {
  const [currentMessage, setCurrentMessage] = React.useState<string>('');
  const [currentCharacter, setCurrentCharacter] = React.useState<keyof typeof BSD_DATABASE_ERROR_MESSAGES>(character);

  React.useEffect(() => {
    const randomCharacter = getRandomBSDCharacter();
    const message = getRandomBSDMessage(randomCharacter);
    setCurrentCharacter(randomCharacter);
    setCurrentMessage(message);
  }, [error]);

  const handleRetry = () => {
    // Reset retry state for all API keys
    RetryManager.resetRetryState('projects');
    RetryManager.resetRetryState('skills');
    RetryManager.resetRetryState('projectCategories');
    
    console.log('🔄 Manual retry initiated - resetting all retry states');
    
    if (onRetry) {
      onRetry();
    } else {
      // Default retry behavior - reload the page
      window.location.reload();
    }
  };

  const getCharacterColor = (char: keyof typeof BSD_DATABASE_ERROR_MESSAGES) => {
    const colors: Record<keyof typeof BSD_DATABASE_ERROR_MESSAGES, string> = {
      dazai: 'from-dazai-brown to-dazai-dark',
      kunikida: 'from-green-600 to-green-800',
      ranpo: 'from-purple-600 to-purple-800',
      chuuya: 'from-red-600 to-red-800',
      atsushi: 'from-orange-600 to-orange-800',
      yosano: 'from-pink-600 to-pink-800'
    };
    return colors[char];
  };

  const getCharacterName = (char: keyof typeof BSD_DATABASE_ERROR_MESSAGES) => {
    const names: Record<keyof typeof BSD_DATABASE_ERROR_MESSAGES, string> = {
      dazai: 'Dazai Osamu',
      kunikida: 'Kunikida Doppo',
      ranpo: 'Edogawa Ranpo',
      chuuya: 'Nakahara Chuuya',
      atsushi: 'Nakajima Atsushi',
      yosano: 'Yosano Akiko'
    };
    return names[char];
  };

  const getCharacterTitle = (char: keyof typeof BSD_DATABASE_ERROR_MESSAGES) => {
    const titles: Record<keyof typeof BSD_DATABASE_ERROR_MESSAGES, string> = {
      dazai: 'Port Mafia Consultant',
      kunikida: 'Armed Detective Agency',
      ranpo: 'Ultra Deduction',
      chuuya: 'Port Mafia Executive',
      atsushi: 'Armed Detective Agency',
      yosano: 'Armed Detective Agency'
    };
    return titles[char];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8 text-center ${className}`}
    >
      {/* Character Avatar */}
      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        className="relative mb-6"
      >
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
          className={`w-20 h-20 bg-gradient-to-br ${getCharacterColor(currentCharacter)} rounded-full border-4 border-white shadow-lg mx-auto relative overflow-hidden`}
        >
          {/* Character silhouette/representation */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20"></div>
          
          {/* Bandage representation for Dazai */}
          {currentCharacter === 'dazai' && (
            <>
              <div className="absolute top-2 left-1 w-8 h-1 bg-white/70 rounded transform rotate-12"></div>
              <div className="absolute bottom-3 right-1 w-6 h-1 bg-white/70 rounded transform -rotate-12"></div>
            </>
          )}
          
          {/* Eye representation */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-white rounded-full"></div>
        </motion.div>

        {/* Character Label */}
        <div className="text-center mt-2">
          <div className="text-sm font-bold text-gray-800">{getCharacterName(currentCharacter)}</div>
          <div className="text-xs text-gray-600">{getCharacterTitle(currentCharacter)}</div>
        </div>
      </motion.div>

      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="mb-4"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <Database className="w-8 h-8 text-red-600" />
        </div>
      </motion.div>

      {/* Error Title */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-bold text-red-800 mb-2"
      >
        Database Connection Lost
      </motion.h3>

      {/* Character Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 mb-4"
      >
        <div className="text-gray-700 italic text-sm leading-relaxed">
          "{currentMessage}"
        </div>
        <div className="text-xs text-gray-500 mt-2 font-semibold">
          - {getCharacterName(currentCharacter)}
        </div>
      </motion.div>

      {/* Error Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-gray-600 mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <WifiOff className="w-4 h-4 text-red-500" />
          <span>Unable to connect to the database</span>
        </div>
        <p className="text-xs text-gray-500">
          Don't worry! We're showing you Sidney's work using backup data. 
          The investigation continues with cached evidence.
        </p>
      </motion.div>

      {/* Retry Button */}
      {showRetryButton && onRetry && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleRetry}
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </motion.button>
      )}

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 text-xs text-gray-500"
      >
        <div className="flex items-center justify-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>Using fallback data - all information is current</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BSDError;
