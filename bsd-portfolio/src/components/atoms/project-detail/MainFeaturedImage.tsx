import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { Badge } from '../../ui/badge';
import ImageNavigationButton from './ImageNavigationButton';

interface ProjectImage {
  url: string;
  caption: string;
  type: string;
  alt_text?: string;
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
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const MIN_SCALE = 1;
  const MAX_SCALE = 10;

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setScale((prev) => clamp(prev + delta, MIN_SCALE, MAX_SCALE));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale === 1) return;
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
  };

  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const zoomIn = () => setScale((prev) => clamp(prev + 0.2, MIN_SCALE, MAX_SCALE));
  const zoomOut = () => setScale((prev) => clamp(prev - 0.2, MIN_SCALE, MAX_SCALE));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.01, y: -5 }}
      className="relative mb-8 rounded-3xl overflow-hidden anime-shadow bg-gradient-to-br from-card to-muted/20 border border-border"
    >
      <div
        className="aspect-[21/9] relative overflow-hidden bg-background"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onDoubleClick={resetZoom}
      >
        <div
          className="w-full h-full"
          style={{
            cursor: scale > 1 ? 'grab' : 'default',
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          <ImageWithFallback
            src={image.url}
            alt={image.alt_text || image.caption}
            className="w-full h-full object-contain bg-background select-none"
            draggable={false}
          />
        </div>
        
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

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 flex items-center space-x-2 bg-black/70 text-white rounded-full px-3 py-1 text-xs backdrop-blur shadow-md">
          <button
            type="button"
            onClick={zoomOut}
            className="px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            -
          </button>
          <span className="min-w-[3ch] text-center">{scale.toFixed(1)}x</span>
          <button
            type="button"
            onClick={zoomIn}
            className="px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            +
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            reset
          </button>
        </div>

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