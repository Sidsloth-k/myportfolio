import React from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

interface ProjectImage {
  url: string;
  caption: string;
  type: string;
}

interface ImageThumbnailProps {
  image: ProjectImage;
  index: number;
  isActive: boolean;
  isInView: boolean;
  onClick: () => void;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ 
  image, 
  index, 
  isActive, 
  isInView, 
  onClick 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 group touch-manipulation ${
        isActive
          ? 'border-accent anime-glow shadow-lg'
          : 'border-border hover:border-accent/50 hover:shadow-md'
      }`}
    >
      <div className="aspect-video">
        <ImageWithFallback
          src=""
          alt={image.caption}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      {/* Thumbnail Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2">
          <div className="text-white text-xs font-medium truncate">
            {image.caption}
          </div>
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeImage"
          className="absolute top-1 sm:top-2 right-1 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full border-2 border-white shadow-sm"
        />
      )}

      {/* Mobile Touch Indicator */}
      <div className="absolute inset-0 bg-transparent group-active:bg-white/10 transition-colors duration-150 sm:hidden" />
    </motion.div>
  );
};

export default ImageThumbnail;