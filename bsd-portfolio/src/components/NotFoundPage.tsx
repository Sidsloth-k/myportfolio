import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Home, Search, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 20,
        y: (clientY / innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const EmotionalScene = () => (
    <div className="relative w-full h-full min-h-[60vh] flex items-center justify-center">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90 rounded-3xl" />
      
      {/* Atmospheric particles */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5
            }}
            animate={{
              y: ['0px', '-10px', '0px'],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Main scene container with 3D effects */}
      <motion.div
        ref={sceneRef}
        style={{
          rotateX: mousePosition.y * 0.1,
          rotateY: mousePosition.x * 0.1,
          transformStyle: 'preserve-3d'
        }}
        className="relative w-full max-w-4xl mx-auto p-8"
      >
        {/* Background scene elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 2 }}
          className="relative"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Central figures - Dazai and Oda */}
          <div className="relative w-full h-96 mb-8">
            {/* Oda's silhouette (lying) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 0.7, x: 0 } : {}}
              transition={{ duration: 3, delay: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full opacity-70"
              style={{ transform: 'translateZ(30px) rotateZ(-5deg)' }}
            >
              {/* Oda's coat details */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-full" />
              <div className="absolute top-2 left-4 w-8 h-1 bg-blue-800/60 rounded" />
              <div className="absolute top-4 left-6 w-6 h-1 bg-blue-800/60 rounded" />
            </motion.div>

            {/* Dazai's silhouette (kneeling/cradling) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 0.8, y: 0 } : {}}
              transition={{ duration: 3, delay: 1.5 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-x-8"
              style={{ transform: 'translateZ(40px)' }}
            >
              <div className="relative w-32 h-40 bg-gradient-to-t from-dazai-brown to-dazai-beige rounded-t-full">
                {/* Dazai's bandages */}
                <motion.div
                  animate={{ opacity: [0.6, 0.9, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-8 left-4 w-12 h-1 bg-dazai-cream/80 rounded transform rotate-12"
                />
                <motion.div
                  animate={{ opacity: [0.6, 0.9, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute top-12 right-6 w-8 h-1 bg-dazai-cream/80 rounded transform -rotate-12"
                />
                <motion.div
                  animate={{ opacity: [0.6, 0.9, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-16 left-2 w-6 h-1 bg-dazai-cream/80 rounded transform rotate-45"
                />
                
                {/* Dazai's coat */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dazai-dark to-dazai-brown rounded-b-lg" />
                
                {/* Emotional aura around Dazai */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 bg-blue-500/20 rounded-t-full blur-md"
                />
              </div>
            </motion.div>

            {/* Environmental details */}
            {/* Scattered papers/documents */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  rotate: Math.random() * 360,
                  scale: 0 
                }}
                animate={isInView ? { 
                  opacity: 0.4, 
                  rotate: Math.random() * 45,
                  scale: 1 
                } : {}}
                transition={{ 
                  duration: 2, 
                  delay: 2 + i * 0.2 
                }}
                className="absolute w-6 h-8 bg-white/60 rounded shadow-lg"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${60 + Math.random() * 30}%`,
                  transform: `translateZ(${10 + i * 5}px)`
                }}
              >
                <div className="w-full h-0.5 bg-gray-400 mt-2 mx-1" />
                <div className="w-3/4 h-0.5 bg-gray-300 mt-1 mx-1" />
                <div className="w-1/2 h-0.5 bg-gray-300 mt-1 mx-1" />
              </motion.div>
            ))}
          </div>

          {/* Emotional text overlay */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 2, delay: 3 }}
            className="text-center relative z-10"
            style={{ transform: 'translateZ(50px)' }}
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
                  — Oda Sakunosuke's final words
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating memories/flashbacks */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                scale: 0,
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%'
              }}
              animate={isInView ? {
                opacity: [0, 0.3, 0],
                scale: [0, 1, 0],
                rotate: [0, 360]
              } : {}}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 4 + i * 2,
                ease: 'easeInOut'
              }}
              className="absolute w-16 h-16 border-2 border-white/30 rounded-full"
              style={{ transform: `translateZ(${60 + i * 10}px)` }}
            >
              <div className="w-full h-full bg-gradient-to-br from-dazai-gold/20 to-dazai-brown/20 rounded-full" />
            </motion.div>
          ))}
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
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <motion.h1 
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(201, 169, 110, 0.3)',
                  '0 0 20px rgba(201, 169, 110, 0.6)',
                  '0 0 10px rgba(201, 169, 110, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl md:text-9xl font-bold text-primary mb-4"
            >
              404
            </motion.h1>
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
            transition={{ duration: 1, delay: 1 }}
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
            transition={{ duration: 2, delay: 2 }}
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
                — A bond that transcends death
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;