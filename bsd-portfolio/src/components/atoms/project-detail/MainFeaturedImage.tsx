import React from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { Badge } from '../../ui/badge';
import ImageNavigationButton from './ImageNavigationButton';

interface ProjectImage {
  url: string;
  caption: string;
  type: string;
}

interface MainFeaturedImageProps {
  image: ProjectImage;
  currentIndex: number;
  totalImages: number;
  isInView: boolean;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const MainFeaturedImage: React.FC<MainFeaturedImageProps> = ({
  image,
  currentIndex,
  totalImages,
  isInView,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.01, y: -5 }}
      className="relative mb-8 rounded-3xl overflow-hidden anime-shadow bg-gradient-to-br from-card to-muted/20 border border-border"
    >
      <div className="aspect-video relative overflow-hidden">
        <ImageWithFallback
          src=""
          alt={image.caption}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Image Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-lg sm:text-xl font-semibold mb-2 truncate">
                {image.caption}
              </h4>
              <div className="flex items-center space-x-3">
                <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                  {image.type}
                </Badge>
                <span className="text-white/80 text-xs sm:text-sm">
                  {currentIndex + 1} / {totalImages}
                </span>
              </div>
            </div>
            
            {/* Infinite Scroll Indicator */}
            <div className="hidden sm:flex items-center space-x-2 ml-4">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      i === 1 ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/60 text-xs">∞</span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Always visible for infinite scroll */}
        <ImageNavigationButton
          direction="left"
          onClick={onPrevious}
          disabled={false} // Always enabled for infinite scroll
        />
        <ImageNavigationButton
          direction="right"
          onClick={onNext}
          disabled={false} // Always enabled for infinite scroll
        />

        {/* Mobile Navigation Dots */}
        <div className="sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {[...Array(Math.min(5, totalImages))].map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex % 5 ? 'bg-white scale-125' : 'bg-white/40'
                }`}
                whileHover={{ scale: 1.2 }}
                onClick={() => {
                  // Calculate which image to show based on current position
                  const targetIndex = Math.floor(currentIndex / 5) * 5 + i;
                  if (targetIndex < totalImages) {
                    // This would need to be passed as a prop or handled differently
                    // For now, just show the dot indicator
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MainFeaturedImage;