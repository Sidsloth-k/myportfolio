import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Home, Search, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  const EmotionalScene = () => (
    <div className="relative w-full max-w-4xl mx-auto p-8">
      {/* Emotional text overlay */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 2, delay: Math.random() * 2 + 2 }}
            className="text-center relative z-10"
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <motion.h2 
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                A Moment Lost in Time
              </motion.h2>
              
              <motion.p 
                className="text-gray-300 text-lg leading-relaxed mb-6 italic"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  delay: 1
                }}
              >
                "In this scene, bonds transcend death, and promises echo through eternity..."
              </motion.p>
              
              <motion.div
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(255,255,255,0.1)',
                    '0 0 40px rgba(255,255,255,0.3)',
                    '0 0 20px rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-white/10 p-4 rounded-lg border border-white/20"
              >
                <p className="text-white text-sm">
                  "Listen... If you're ever sad or anything, you can think of me. 
                  I'll always be watching over you."
                </p>
                <div className="text-dazai-gold text-xs mt-2 text-right">
              - Oda Sakunosuke's final words
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-dazai-gold/5 to-dazai-brown/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2, opacity }}
          className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-dazai-dark/10 to-dazai-muted/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ x: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Return to the Agency</span>
          </motion.button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* 404 Error */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="relative inline-block mb-4">
              <motion.h1 
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(0, 0, 0, 0.3)',
                    '0 0 20px rgba(0, 0, 0, 0.6)',
                    '0 0 10px rgba(0, 0, 0, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl md:text-9xl font-bold relative"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundImage: 'linear-gradient(45deg, #1a1a1a, #333333, #1a1a1a)',
                  backgroundSize: '200% 200%'
                }}
              >
                404
              </motion.h1>
              
              {/* Crime scene tape animation that stays within the text boundaries */}
              <motion.div
                animate={{
                  backgroundPosition: ['-100% 0%', '100% 0%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundImage: 'repeating-linear-gradient(90deg, #ffd700 0px, #ffd700 120px, #000000 120px, #000000 140px, #ffd700 140px, #ffd700 260px, #000000 260px, #000000 280px)',
                  backgroundSize: '280px 20px'
                }}
              >
                <div className="text-8xl md:text-9xl font-bold">404</div>
              </motion.div>
              
              {/* Text overlay for "CRIME SCENE DO NOT CROSS" */}
              <motion.div
                animate={{
                  backgroundPosition: ['-100% 0%', '100% 0%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 120px, #000000 120px, #000000 140px, transparent 140px, transparent 260px, #000000 260px, #000000 280px)',
                  backgroundSize: '280px 20px',
                  mixBlendMode: 'multiply'
                }}
              >
                <div className="text-8xl md:text-9xl font-bold">404</div>
              </motion.div>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Case File Not Found
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              The page you're looking for seems to have disappeared, 
              like memories lost in the depths of time.
            </p>
          </motion.div>

          {/* Emotional Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.5 }}
            className="w-full max-w-6xl mx-auto mb-12"
          >
            <EmotionalScene />
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg anime-shadow"
            >
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Button>
            
            <Button
              onClick={() => navigate('/projects')}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Cases
            </Button>
          </motion.div>

          {/* Memorial quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center max-w-2xl mx-auto"
          >
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 anime-shadow">
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center justify-center mb-4"
              >
                <Heart className="w-6 h-6 text-red-500 mr-2" />
                <span className="text-foreground font-semibold">In Memory</span>
                <Heart className="w-6 h-6 text-red-500 ml-2" />
              </motion.div>
              
              <blockquote className="text-muted-foreground italic text-lg leading-relaxed">
                "People live to save themselves. But you... 
                you were willing to sacrifice yourself to save others. 
                That's what makes you so beautiful."
              </blockquote>
              
              <div className="text-primary font-semibold mt-4">
                - A bond that transcends death
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;