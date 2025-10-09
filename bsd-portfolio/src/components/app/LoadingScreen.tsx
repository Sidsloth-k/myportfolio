import React from 'react';
import { motion } from 'framer-motion';
import AnimeOrb from './Loading/AnimeOrb';
import LoadingDots from './Loading/LoadingDots';

const LoadingScreen: React.FC = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
    className="fixed inset-0 z-50 bg-gradient-to-br from-background via-card to-muted flex items-center justify-center overflow-hidden"
  >
    <div className="absolute inset-0">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            opacity: 0,
          }}
          animate={{
            y: [null, -150],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>

    <div className="text-center relative z-10">
      <AnimeOrb />

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-5xl font-bold hierarchy-primary mb-6"
      >
        Armed Detective Agency
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="hierarchy-secondary text-xl mb-10"
      >
        Loading Sidney's Portfolio...
      </motion.p>

      <LoadingDots />

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
        className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-8 mx-auto max-w-md"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-10 italic text-accent text-lg max-w-lg mx-auto bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border"
      >
        "Every masterpiece begins with a single stroke, every mystery with a single clue..."
        <div className="text-sm font-semibold mt-2 hierarchy-primary">- Dazai Osamu</div>
      </motion.div>
    </div>
  </motion.div>
);

export default LoadingScreen;


