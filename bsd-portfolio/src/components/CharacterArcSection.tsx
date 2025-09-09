import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Zap, Heart, Trophy } from 'lucide-react';

const CharacterArcSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const [activeChapter, setActiveChapter] = useState(0);

  const characterArc = [
    {
      chapter: 'Chapter 1',
      title: 'The Newcomer',
      year: '2018',
      age: 'Fresh Graduate',
      description: 'Like Atsushi arriving at the Armed Detective Agency, Sidney entered the tech world with curiosity and determination.',
      story: 'Armed with nothing but passion for coding and a head full of dreams, Sidney took his first steps into the vast world of technology. Every bug was a mystery to solve, every successful deployment a small victory.',
      skills: ['Basic HTML/CSS', 'JavaScript Fundamentals', 'Problem Solving'],
      personality: ['Curious', 'Eager to Learn', 'Optimistic'],
      challenge: 'Learning to navigate the complex world of web development',
      victory: 'First successful web application deployment',
      quote: "Every expert was once a beginner. Every pro was once an amateur.",
      illustration: 'young developer learning code',
      panelStyle: 'sepia',
      mood: 'hopeful'
    },
    {
      chapter: 'Chapter 2',
      title: 'The Awakening',
      year: '2019-2020',
      age: 'Junior Developer',
      description: 'Discovery of design principles, like Dazai understanding the depths of human psychology.',
      story: 'The revelation came suddenly - code wasn\'t just about functionality, but about creating experiences. Sidney discovered the art of UI/UX design, realizing that beautiful interfaces could tell stories as compelling as any novel.',
      skills: ['React Mastery', 'UI/UX Fundamentals', 'Design Thinking', 'User Research'],
      personality: ['Analytical', 'Creative', 'Detail-Oriented'],
      challenge: 'Balancing technical skills with creative design',
      victory: 'First design system implementation',
      quote: "Code is poetry, and design is the rhythm that makes it sing.",
      illustration: 'designer working on interface mockups',
      panelStyle: 'vibrant',
      mood: 'inspired'
    },
    {
      chapter: 'Chapter 3',
      title: 'The Strategist',
      year: '2021-2022',
      age: 'Mid-Level Developer',
      description: 'Understanding user psychology and market dynamics, channeling Ranpo\'s deductive abilities.',
      story: 'True mastery came with understanding not just how to build, but why to build. Sidney delved into marketing psychology, learning to read user behavior like Ranpo reads crime scenes - every click a clue, every conversion a solved mystery.',
      skills: ['Full-Stack Architecture', 'Marketing Analytics', 'User Psychology', 'Growth Hacking'],
      personality: ['Strategic', 'Empathetic', 'Results-Driven'],
      challenge: 'Integrating technical excellence with business strategy',
      victory: 'Led a project that increased user engagement by 300%',
      quote: "Understanding the user is the key to unlocking infinite possibilities.",
      illustration: 'strategist analyzing user behavior data',
      panelStyle: 'noir',
      mood: 'contemplative'
    },
    {
      chapter: 'Chapter 4',
      title: 'The Master Detective',
      year: '2023-2024',
      age: 'Senior Developer',
      description: 'Achieving mastery across all domains, like Dazai\'s multifaceted expertise.',
      story: 'Now Sidney operates with the confidence of a master detective, seamlessly weaving together technology, design, and strategy. Each project is a case to be solved, each challenge an opportunity to demonstrate the full breadth of accumulated wisdom.',
      skills: ['System Architecture', 'Team Leadership', 'Strategic Planning', 'Innovation'],
      personality: ['Confident', 'Visionary', 'Mentor'],
      challenge: 'Leading complex projects and mentoring others',
      victory: 'Successfully architected and led multiple high-impact projects',
      quote: "Mastery is not a destination, but a way of traveling.",
      illustration: 'senior developer leading team meeting',
      panelStyle: 'golden',
      mood: 'accomplished'
    }
  ];

  const currentChapter = characterArc[activeChapter];

  const MangaPanel = ({ chapter, index, isActive }: { chapter: any, index: number, isActive: boolean }) => (
    <motion.div
      layoutId={`panel-${index}`}
      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
      animate={{ 
        opacity: isActive ? 1 : 0.6, 
        scale: isActive ? 1 : 0.9,
        rotateY: 0
      }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
      whileHover={{ scale: isActive ? 1.02 : 0.95, rotateY: 5 }}
      onClick={() => setActiveChapter(index)}
      className={`relative cursor-pointer border-4 rounded-2xl overflow-hidden anime-shadow ${
        isActive ? 'border-accent' : 'border-border/50'
      }`}
      style={{
        width: isActive ? 'clamp(280px, 90vw, 400px)' : 'clamp(200px, 70vw, 280px)',
        height: isActive ? 'clamp(350px, 80vh, 500px)' : 'clamp(250px, 60vh, 350px)',
        filter: chapter.panelStyle === 'sepia' ? 'sepia(0.3)' : 
               chapter.panelStyle === 'noir' ? 'contrast(120%) saturate(80%)' :
               chapter.panelStyle === 'golden' ? 'hue-rotate(30deg) saturate(110%)' : 'none'
      }}
    >
      {/* Background illustration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 dark:from-slate-200 dark:via-purple-100 dark:to-indigo-100">
        {/* Manga-style background pattern */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
              className="absolute w-2 h-2 bg-accent rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>

      {/* Chapter content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 p-4 sm:p-6 flex flex-col justify-between">
        {/* Chapter header */}
        <div>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block bg-white/95 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold text-slate-800 mb-2"
          >
            {chapter.chapter}
          </motion.div>
          <h3 className="text-white font-bold text-lg sm:text-xl mb-2 drop-shadow-lg">{chapter.title}</h3>
          <div className="text-accent font-semibold text-sm sm:text-base drop-shadow-lg">{chapter.year}</div>
        </div>

        {/* Chapter illustration placeholder */}
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-dazai-brown/30 to-dazai-gold/30 rounded-full flex items-center justify-center border-4 border-white/50">
            {index === 0 && <Star className="w-10 h-10 sm:w-16 sm:h-16 text-white" />}
            {index === 1 && <Zap className="w-10 h-10 sm:w-16 sm:h-16 text-white" />}
            {index === 2 && <Heart className="w-10 h-10 sm:w-16 sm:h-16 text-white" />}
            {index === 3 && <Trophy className="w-10 h-10 sm:w-16 sm:h-16 text-white" />}
          </div>
        </motion.div>

        {/* Bottom info */}
        <div>
          <div className="text-white/95 text-xs sm:text-sm mb-2 drop-shadow-lg font-medium">{chapter.age}</div>
          <div className="text-white/90 text-xs sm:text-sm line-clamp-2 drop-shadow-lg">{chapter.description}</div>
        </div>
      </div>

      {/* Manga panel effects */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-dazai-gold rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm border-2 border-white"
        >
          !
        </motion.div>
      )}
    </motion.div>
  );

  // Mobile-specific manga panel for stacking
  const MobileMangaPanel = ({ chapter, index, isActive }: { chapter: any, index: number, isActive: boolean }) => (
    <motion.div
      layoutId={`mobile-panel-${index}`}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1
      }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.2, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={() => setActiveChapter(index)}
      className={`relative cursor-pointer border-4 rounded-2xl overflow-hidden anime-shadow w-full max-w-sm mx-auto ${
        isActive ? 'border-accent shadow-lg z-20' : 'border-border/50 z-10'
      }`}
      style={{
        height: '280px',
        filter: chapter.panelStyle === 'sepia' ? 'sepia(0.3)' : 
               chapter.panelStyle === 'noir' ? 'contrast(120%) saturate(80%)' :
               chapter.panelStyle === 'golden' ? 'hue-rotate(30deg) saturate(110%)' : 'none'
      }}
    >
      {/* Background illustration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 dark:from-slate-200 dark:via-purple-100 dark:to-indigo-100">
        {/* Manga-style background pattern */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
              className="absolute w-1.5 h-1.5 bg-accent rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>

      {/* Chapter content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 p-4 flex flex-col justify-between">
        {/* Chapter header */}
        <div>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block bg-white/95 px-2 py-1 rounded-full text-xs font-bold text-slate-800 mb-2"
          >
            {chapter.chapter}
          </motion.div>
          <h3 className="text-white font-bold text-lg mb-2 drop-shadow-lg">{chapter.title}</h3>
          <div className="text-accent font-semibold text-sm drop-shadow-lg">{chapter.year}</div>
        </div>

        {/* Chapter illustration placeholder */}
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-dazai-brown/30 to-dazai-gold/30 rounded-full flex items-center justify-center border-4 border-white/50">
            {index === 0 && <Star className="w-8 h-8 text-white" />}
            {index === 1 && <Zap className="w-8 h-8 text-white" />}
            {index === 2 && <Heart className="w-8 h-8 text-white" />}
            {index === 3 && <Trophy className="w-8 h-8 text-white" />}
          </div>
        </motion.div>

        {/* Bottom info */}
        <div>
          <div className="text-white/95 text-xs mb-2 drop-shadow-lg font-medium">{chapter.age}</div>
          <div className="text-white/90 text-xs line-clamp-2 drop-shadow-lg">{chapter.description}</div>
        </div>
      </div>

      {/* Manga panel effects */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-dazai-gold rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white"
        >
          !
        </motion.div>
      )}
    </motion.div>
  );

  // Deck-style mobile layout component
  const MobileDeckLayout = () => {
    const [isShuffling, setIsShuffling] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<'left' | 'right' | null>(null);

    const handleCardChange = (direction: 'left' | 'right') => {
      if (isShuffling) return;
      
      setIsShuffling(true);
      setScrollDirection(direction);
      
      if (direction === 'left') {
        setActiveChapter(Math.max(0, activeChapter - 1));
      } else {
        setActiveChapter(Math.min(characterArc.length - 1, activeChapter + 1));
      }
      
      setTimeout(() => {
        setIsShuffling(false);
        setScrollDirection(null);
      }, 600);
    };

    return (
      <div className="mobile-deck deck-container relative">
        {/* Scroll Navigation */}
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-30">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCardChange('left')}
            disabled={activeChapter === 0 || isShuffling}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-30">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCardChange('right')}
            disabled={activeChapter === characterArc.length - 1 || isShuffling}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Stacked cards behind the active one - Fanned Deck Style */}
        {characterArc.map((chapter, index) => {
          const isActive = index === activeChapter;
          const stackOffset = index - activeChapter;
          
          // Only show cards that are close to the active one (fanned deck effect)
          if (Math.abs(stackOffset) > 3) return null;
          
          // Calculate fanned deck positioning
          const fanAngle = stackOffset * 8; // Degrees of fan spread
          const fanRadius = 200; // Radius of the fan arc
          const fanX = Math.sin(fanAngle * Math.PI / 180) * fanRadius;
          const fanY = stackOffset * 4; // Vertical offset
          const fanScale = isActive ? 1 : 0.9 - Math.abs(stackOffset) * 0.05;
          const fanOpacity = isActive ? 1 : 0.8 - Math.abs(stackOffset) * 0.2;
          const fanZ = isActive ? 20 : 15 - Math.abs(stackOffset);
          
          return (
            <motion.div
              key={index}
              layoutId={`deck-card-${index}`}
              initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: 0 }}
              animate={{ 
                opacity: fanOpacity,
                y: fanY,
                x: fanX,
                scale: fanScale,
                rotateY: fanAngle,
                z: fanZ
              }}
              transition={{ 
                duration: isShuffling ? 0.3 : 0.6, 
                type: 'spring', 
                bounce: 0.2,
                delay: isShuffling ? 0 : Math.abs(stackOffset) * 0.1
              }}
              whileHover={{ 
                scale: isActive ? 1.02 : 0.98,
                y: isActive ? -5 : fanY,
                rotateY: isActive ? 0 : fanAngle
              }}
              onClick={() => {
                if (!isShuffling) {
                  setActiveChapter(index);
                }
              }}
              className={`mobile-deck-card deck-card cursor-pointer border-4 rounded-2xl overflow-hidden anime-shadow w-full max-w-sm absolute ${
                isActive ? 'border-accent shadow-xl' : 'border-border/30 shadow-md'
              }`}
              style={{
                filter: chapter.panelStyle === 'sepia' ? 'sepia(0.3)' : 
                       chapter.panelStyle === 'noir' ? 'contrast(120%) saturate(80%)' :
                       chapter.panelStyle === 'golden' ? 'hue-rotate(30deg) saturate(110%)' : 'none',
                transform: `translate(${fanX}px, ${fanY}px) scale(${fanScale}) rotateY(${fanAngle}deg)`,
                zIndex: fanZ
              }}
            >
              {/* Card Dealer Shuffle Animation */}
              {isShuffling && isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    y: scrollDirection === 'left' ? [0, -20, 0] : [0, 20, 0],
                    x: scrollDirection === 'left' ? [0, -10, 0] : [0, 10, 0]
                  }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-accent/20 rounded-2xl flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.6 }}
                    className="w-8 h-8 bg-accent rounded-full flex items-center justify-center"
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
              )}

              {/* Background illustration */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 dark:from-slate-200 dark:via-purple-100 dark:to-indigo-100">
                {/* Manga-style background pattern */}
                <div className="absolute inset-0 opacity-30">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3
                      }}
                      className="absolute w-1.5 h-1.5 bg-accent rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Chapter content overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 p-4 flex flex-col justify-between">
                {/* Chapter header */}
                <div>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="inline-block bg-white/95 px-2 py-1 rounded-full text-xs font-bold text-slate-800 mb-2"
                  >
                    {chapter.chapter}
                  </motion.div>
                  <h3 className="text-white font-bold text-lg mb-2 drop-shadow-lg">{chapter.title}</h3>
                  <div className="text-accent font-semibold text-sm drop-shadow-lg">{chapter.year}</div>
                </div>

                {/* Chapter illustration placeholder */}
                <motion.div
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-1 flex items-center justify-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-dazai-brown/30 to-dazai-gold/30 rounded-full flex items-center justify-center border-4 border-white/50">
                    {index === 0 && <Star className="w-8 h-8 text-white" />}
                    {index === 1 && <Zap className="w-8 h-8 text-white" />}
                    {index === 2 && <Heart className="w-8 h-8 text-white" />}
                    {index === 3 && <Trophy className="w-8 h-8 text-white" />}
                  </div>
                </motion.div>

                {/* Bottom info */}
                <div>
                  <div className="text-white/95 text-xs mb-2 drop-shadow-lg font-medium">{chapter.age}</div>
                  <div className="text-white/90 text-xs line-clamp-2 drop-shadow-lg">{chapter.description}</div>
                </div>
              </div>

              {/* Manga panel effects */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-dazai-gold rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white"
                >
                  !
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Deck indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2"
        >
          <div className="flex space-x-2">
            {characterArc.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  if (!isShuffling) {
                    setActiveChapter(index);
                  }
                }}
                animate={{ 
                  scale: index === activeChapter ? 1.3 : 1,
                  opacity: index === activeChapter ? 1 : 0.5
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === activeChapter ? 'bg-accent shadow-lg' : 'bg-border hover:bg-accent/50'
                }`}
              />
            ))}
          </div>
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center space-x-2"
          >
            <div className="w-4 h-4 bg-accent/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-accent rounded-full deck-pulse"></div>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Fanned Deck</span>
          </motion.div>
        </motion.div>
      </div>
    );
  };

  const DetailedStory = () => (
    <motion.div
      key={activeChapter}
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -30, rotateX: 10 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md border border-dazai-gold/30 rounded-2xl p-4 sm:p-6 lg:p-8 anime-shadow"
    >
      {/* Story content */}
      <div className="mb-6 sm:mb-8">
        <h4 className="text-xl sm:text-2xl font-bold text-dazai-brown mb-3 sm:mb-4">
          {currentChapter.title} - {currentChapter.year}
        </h4>
        <p className="text-base sm:text-lg leading-relaxed text-dazai-dark mb-4 sm:mb-6">
          {currentChapter.story}
        </p>
        
        {/* Quote */}
        <motion.blockquote
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="border-l-4 border-dazai-gold pl-4 sm:pl-6 italic text-dazai-brown text-base sm:text-lg mb-4 sm:mb-6"
        >
          "{currentChapter.quote}"
        </motion.blockquote>
      </div>

      {/* Skills and personality grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Skills */}
        <div>
          <h5 className="font-bold text-dazai-brown mb-3 sm:mb-4">Skills Acquired</h5>
          <div className="space-y-2">
            {currentChapter.skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-dazai-gold rounded-full"></div>
                <span className="text-sm sm:text-base text-dazai-dark">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Personality traits */}
        <div>
          <h5 className="font-bold text-dazai-brown mb-3 sm:mb-4">Character Traits</h5>
          <div className="space-y-2">
            {currentChapter.personality.map((trait, index) => (
              <motion.div
                key={trait}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-dazai-brown rounded-full"></div>
                <span className="text-sm sm:text-base text-dazai-dark">{trait}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge and victory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <h6 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Main Challenge</h6>
          <p className="text-red-700 text-xs sm:text-sm">{currentChapter.challenge}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
          <h6 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Key Victory</h6>
          <p className="text-green-700 text-xs sm:text-sm">{currentChapter.victory}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section ref={containerRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-20 w-48 h-48 sm:w-96 sm:h-96 bg-dazai-gold/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-dazai-dark mb-4 sm:mb-6">
            Character Development Arc
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-dazai-muted max-w-3xl mx-auto px-4">
            Like the protagonists in Bungou Stray Dogs, every developer has their own story 
            of growth, challenges, and transformation. This is Sidney's journey.
          </p>
        </motion.div>

        {/* Manga panels - Mobile deck, Desktop horizontal */}
        <div className="mb-12 sm:mb-16">
          {/* Mobile: Deck-style stacked cards */}
          <motion.div 
            className="block sm:hidden px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <MobileDeckLayout />
          </motion.div>

          {/* Desktop: Horizontal scroll with smooth transition */}
          <motion.div 
            className="hidden sm:flex justify-center items-center gap-4 lg:gap-8 overflow-x-auto pb-8 scrollbar-hide"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {characterArc.map((chapter, index) => (
              <MangaPanel
                key={index}
                chapter={chapter}
                index={index}
                isActive={index === activeChapter}
              />
            ))}
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
            disabled={activeChapter === 0}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-accent to-primary text-accent-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-primary hover:to-accent transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Previous Chapter</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveChapter(Math.min(characterArc.length - 1, activeChapter + 1))}
            disabled={activeChapter === characterArc.length - 1}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-accent to-primary text-accent-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-primary hover:to-accent transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>

        {/* Detailed story */}
        <DetailedStory />
      </div>
    </section>
  );
};

export default CharacterArcSection;