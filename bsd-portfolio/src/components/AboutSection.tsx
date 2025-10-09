import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Award, Heart, Coffee, Book, ArrowDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const timeline = [
    {
      year: '2018',
      title: 'The Beginning',
      description: 'Started programming journey, inspired by the complexity of detective mysteries',
      icon: Book,
      color: 'dazai-brown'
    },
    {
      year: '2020',
      title: 'Design Awakening',
      description: 'Discovered the art of UI/UX design, finding beauty in simplicity',
      icon: Heart,
      color: 'dazai-gold'
    },
    {
      year: '2022',
      title: 'Marketing Mind',
      description: 'Learned the psychology of user behavior and market strategies',
      icon: Award,
      color: 'dazai-dark'
    },
    {
      year: '2024',
      title: 'The Present',
      description: 'Combining all skills to create meaningful digital experiences',
      icon: Coffee,
      color: 'dazai-muted'
    }
  ];

  const characteristics = [
    {
      title: 'Strategic Thinking',
      description: 'Like Dazai planning his moves, I approach every project with careful consideration',
      percentage: 95
    },
    {
      title: 'Creative Problem Solving',
      description: 'Finding elegant solutions to complex challenges, much like solving mysteries',
      percentage: 92
    },
    {
      title: 'Attention to Detail',
      description: 'Every pixel, every line of code matters - the devil is in the details',
      percentage: 89
    },
    {
      title: 'User Empathy',
      description: 'Understanding users like understanding characters in a story',
      percentage: 94
    }
  ];

  return (
    <section ref={containerRef} className="py-20 px-6 relative overflow-hidden">
      {/* Anime-style Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dazai-cream/50 to-dazai-beige/30"></div>
        
        {/* Floating Elements - like cherry blossoms */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-dazai-gold/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              x: [null, Math.random() * 100 - 50],
              opacity: [0, 0.7, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-dazai-dark mb-6">
            The Detective's Story
          </h2>
          <p className="text-xl text-dazai-muted max-w-3xl mx-auto">
            Like every character in Bungou Stray Dogs, Sidney has a unique backstory 
            that shaped his abilities and perspective on solving digital mysteries.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Character Portrait & Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Portrait */}
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="relative w-80 h-96 mx-auto bg-gradient-to-br from-dazai-brown/20 to-dazai-gold/20 rounded-2xl overflow-hidden anime-shadow border-4 border-dazai-gold/30"
            >
              <ImageWithFallback
                src=""
                alt="Sidney - The Developer Detective"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with anime-style effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-dazai-dark/60 via-transparent to-transparent"></div>
              
              {/* Character Badge */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="w-4 h-4 text-dazai-brown" />
                    <span className="text-dazai-brown font-semibold">Yokohama, Japan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-dazai-muted" />
                    <span className="text-dazai-muted text-sm">Active Detective since 2018</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Character Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-dazai-cream/50 backdrop-blur-sm border border-dazai-gold/30 rounded-2xl p-6 anime-shadow"
            >
              <div className="text-dazai-brown text-lg italic mb-4">
                "In the world of code, design, and strategy, every challenge is a mystery waiting to be solved. 
                Like Dazai, I believe that understanding the human element is key to any solution."
              </div>
              <div className="text-dazai-muted font-semibold">- Sidney, Digital Detective</div>
            </motion.div>
          </motion.div>

          {/* Character Characteristics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-dazai-brown mb-6">Character Traits</h3>
              
              {characteristics.map((trait, index) => (
                <motion.div
                  key={trait.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="mb-6 last:mb-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-dazai-dark">{trait.title}</h4>
                    <span className="text-dazai-gold font-bold">{trait.percentage}%</span>
                  </div>
                  
                  <p className="text-dazai-muted text-sm mb-3">{trait.description}</p>
                  
                  <div className="w-full bg-dazai-beige/30 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${trait.percentage}%` } : {}}
                      transition={{ duration: 1.5, delay: 0.8 + index * 0.2 }}
                      className="h-full bg-gradient-to-r from-dazai-gold to-dazai-brown relative"
                    >
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full opacity-80"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-gradient-to-br from-dazai-brown/10 to-dazai-gold/10 border border-dazai-brown/20 rounded-2xl p-6"
            >
              <h4 className="text-lg font-semibold text-dazai-brown mb-3">Detective Philosophy</h4>
              <p className="text-dazai-muted leading-relaxed">
                Just as Dazai Osamu uses his keen insight to understand people and situations, 
                I approach every project with curiosity, empathy, and strategic thinking. 
                Technology should serve humanity, design should tell stories, and marketing 
                should build genuine connections.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-dazai-dark text-center mb-12">
            Character Development Arc
          </h3>
          
          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-dazai-gold to-dazai-brown rounded-full"></div>
            
            <div className="space-y-16">
              {timeline.map((event, index) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-card/80 backdrop-blur-sm border border-dazai-gold/30 rounded-2xl p-6 anime-shadow">
                      <div className="text-2xl font-bold text-dazai-brown mb-2">{event.year}</div>
                      <h4 className="text-lg font-semibold text-dazai-dark mb-2">{event.title}</h4>
                      <p className="text-dazai-muted">{event.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Node */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    className={`w-16 h-16 bg-gradient-to-br from-dazai-${event.color}/80 to-dazai-${event.color} rounded-full border-4 border-white flex items-center justify-center anime-shadow z-10`}
                  >
                    <event.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  {/* Spacer */}
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline with Arrows */}
          <div className="md:hidden space-y-8">
            {timeline.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                className="relative"
              >
                {/* Timeline Node */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-14 h-14 bg-gradient-to-br from-dazai-${event.color}/80 to-dazai-${event.color} rounded-full border-4 border-white flex items-center justify-center anime-shadow z-10`}
                  >
                    <event.icon className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="bg-card/80 backdrop-blur-sm border border-dazai-gold/30 rounded-2xl p-4 sm:p-6 anime-shadow mx-4">
                  <div className="text-xl sm:text-2xl font-bold text-dazai-brown mb-2">{event.year}</div>
                  <h4 className="text-base sm:text-lg font-semibold text-dazai-dark mb-2">{event.title}</h4>
                  <p className="text-sm sm:text-base text-dazai-muted">{event.description}</p>
                </div>

                {/* Arrow pointing down (except for last item) */}
                {index < timeline.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                    className="flex justify-center mt-4"
                  >
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 bg-gradient-to-b from-dazai-gold to-dazai-brown rounded-full flex items-center justify-center"
                    >
                      <ArrowDown className="w-4 h-4 text-white" />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center bg-gradient-to-r from-dazai-brown/10 to-dazai-gold/10 rounded-2xl p-8 border border-dazai-gold/30"
        >
          <h3 className="text-2xl font-bold text-dazai-dark mb-4">
            Ready to Start a New Investigation?
          </h3>
          <p className="text-dazai-muted mb-6 max-w-2xl mx-auto">
            Like the Armed Detective Agency taking on new cases, Sidney is always ready 
            for the next challenge. Let's solve your digital mysteries together.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(201, 169, 110, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-dazai-brown to-dazai-dark text-white rounded-xl font-semibold anime-shadow"
          >
            Begin the Investigation
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;