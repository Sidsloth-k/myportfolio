import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ImageNavigationButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}

const ImageNavigationButton: React.FC<ImageNavigationButtonProps> = ({ 
  direction, 
  onClick, 
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute ${direction === 'left' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'} top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl z-10`}
    >
      <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${direction === 'right' ? 'rotate-180' : ''}`} />
    </button>
  );
};

export default ImageNavigationButton;