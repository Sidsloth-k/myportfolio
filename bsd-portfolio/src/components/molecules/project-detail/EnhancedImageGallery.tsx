import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MainFeaturedImage, ImageThumbnail } from '../../atoms/project-detail';

interface ProjectImage {
  url: string;
  caption: string;
  type: string;
}

interface EnhancedImageGalleryProps {
  images: ProjectImage[];
  isInView: boolean;
}

const EnhancedImageGallery: React.FC<EnhancedImageGalleryProps> = ({ images, isInView }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevious = () => {
    // Infinite scroll: if at first image, go to last image
    if (currentImageIndex === 0) {
      setCurrentImageIndex(images.length - 1);
    } else {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNext = () => {
    // Infinite scroll: if at last image, go to first image
    if (currentImageIndex === images.length - 1) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Create extended array for smooth infinite scroll effect
  const extendedImages = [...images, ...images, ...images];
  const virtualIndex = currentImageIndex + images.length; // Start in the middle section

  return (
    <div className="mb-20">
      <motion.h3 
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-3xl font-bold hierarchy-primary mb-12 text-center"
      >
        Visual Documentation & Screenshots
        <div className="text-lg hierarchy-secondary mt-2 font-normal">
          Comprehensive visual overview of the system
        </div>
      </motion.h3>
      
      {/* Main Featured Image with Infinite Scroll */}
      <MainFeaturedImage
        image={images[currentImageIndex]}
        currentIndex={currentImageIndex}
        totalImages={images.length}
        isInView={isInView}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={true} // Always true for infinite scroll
        canGoNext={true} // Always true for infinite scroll
      />

      {/* Thumbnail Grid with Infinite Scroll Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {images.map((image, index) => (
          <ImageThumbnail
            key={index}
            image={image}
            index={index}
            isActive={index === currentImageIndex}
            isInView={isInView}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>

      {/* Infinite Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center mt-6"
      >
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-accent rounded-full"></div>
          <span>Infinite Scroll Enabled</span>
          <div className="w-2 h-2 bg-accent rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedImageGallery;