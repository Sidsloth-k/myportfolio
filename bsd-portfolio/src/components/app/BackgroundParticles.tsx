import React from 'react';
import { motion } from 'framer-motion';

const BackgroundParticles: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-accent/20 rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: 0,
        }}
        animate={{
          y: [null, -window.innerHeight - 100],
          x: [null, Math.random() * 200 - 100],
          opacity: [0, 0.6, 0],
          scale: [0.5, 1.2, 0.5],
        }}
        transition={{
          duration: 20 + Math.random() * 15,
          repeat: Infinity,
          delay: Math.random() * 15,
          ease: 'linear',
        }}
      />
    ))}

    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`element-${i}`}
        className="absolute w-4 h-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 100,
          rotate: 0,
        }}
        animate={{
          y: [null, -200],
          x: [null, Math.random() * 300 - 150],
          rotate: [0, 360],
          opacity: [0, 0.8, 0],
          scale: [0.5, 1.5, 0.5],
        }}
        transition={{
          duration: 12 + Math.random() * 8,
          repeat: Infinity,
          delay: Math.random() * 12,
          ease: 'easeOut',
        }}
      />
    ))}
  </div>
);

export default BackgroundParticles;


