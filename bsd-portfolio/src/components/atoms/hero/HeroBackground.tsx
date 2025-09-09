import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { Star } from 'lucide-react';

interface HeroBackgroundProps {
  y1: MotionValue<number>;
  y2: MotionValue<number>;
  opacity: MotionValue<number>;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ y1, y2, opacity }) => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Primary Background Gradients */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-3xl"
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, -window.innerHeight - 100],
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Detective Agency Symbol */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5"
      >
        <div className="w-full h-full border-4 border-accent rounded-full flex items-center justify-center">
          <div className="w-3/4 h-3/4 border-2 border-primary rounded-full flex items-center justify-center">
            <Star className="w-24 h-24 text-accent" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroBackground;