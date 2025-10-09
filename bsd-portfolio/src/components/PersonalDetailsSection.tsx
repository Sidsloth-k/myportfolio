import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Coffee, BookOpen, Code, Heart, MapPin, Calendar, Star, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const PersonalDetailsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const personalFacts = [
    {
      icon: Coffee,
      label: 'Fuel of Choice',
      value: 'Black Coffee & Literature',
      description: 'Like Dazai, finds inspiration in caffeine and classic novels',
      color: 'text-amber-600'
    },
    {
      icon: BookOpen,
      label: 'Favorite Genre',
      value: 'Mystery & Detective Fiction',
      description: 'Drawn to stories that challenge the mind and reveal human nature',
      color: 'text-purple-600'
    },
    {
      icon: Code,
      label: 'First Language',
      value: 'JavaScript (the gateway drug)',
      description: 'Started the coding journey and never looked back',
      color: 'text-blue-600'
    },
    {
      icon: MapPin,
      label: 'Based In',
      value: 'Yokohama, Japan',
      description: 'Where real detective work meets digital mysteries',
      color: 'text-green-600'
    },
    {
      icon: Calendar,
      label: 'Detective Since',
      value: '2020',
      description: '4+ years solving digital cases and creating solutions',
      color: 'text-indigo-600'
    },
    {
      icon: Heart,
      label: 'Secret Weakness',
      value: 'Perfectly Designed UIs',
      description: 'Gets unreasonably excited about clean code and beautiful interfaces',
      color: 'text-red-600'
    }
  ];

  const philosophies = [
    {
      quote: "Every bug is just a mystery waiting to be solved",
      context: "Debugging Philosophy",
      icon: Zap
    },
    {
      quote: "Good design is like a good detective story - every element has a purpose",
      context: "Design Approach",
      icon: Star
    },
    {
      quote: "Code should be poetry that machines can read",
      context: "Development Mindset",
      icon: BookOpen
    }
  ];

  const quirks = [
    "Names variables after BSD characters",
    "Writes commit messages as haikus",
    "Has a rubber duck named 'Kunikida'",
    "Color-codes everything by detective agency ranks",
    "Debugs while listening to jazz music",
    "Believes every project needs an easter egg"
  ];

  return (
    <section ref={containerRef} className="py-20 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold hierarchy-primary mb-6">
            The Detective Behind the Code
          </h2>
          <p className="text-xl hierarchy-secondary max-w-3xl mx-auto leading-relaxed">
            Beyond the technical skills and case files lies a person driven by curiosity, 
            creativity, and an unending quest to solve the mysteries of digital innovation.
          </p>
          
          {/* Dazai Quote */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="italic text-accent text-lg max-w-2xl mx-auto bg-accent/10 p-6 rounded-2xl border border-accent/20 mt-8"
          >
            "The most important thing is not to stop questioning. Curiosity has its own reason for existing."
            <div className="text-sm font-semibold mt-2 hierarchy-primary">- Sidney's Development Philosophy</div>
          </motion.div>
        </motion.div>

        {/* Personal Facts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {personalFacts.map((fact, index) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="p-6 h-full hover:border-accent/50 transition-all duration-300 anime-shadow hover:anime-glow relative overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent" />
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4 ${fact.color}`}>
                    <fact.icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold hierarchy-primary mb-2">{fact.label}</h3>
                  <div className="hierarchy-accent font-medium mb-3">{fact.value}</div>
                  <p className="text-sm hierarchy-tertiary leading-relaxed">{fact.description}</p>
                </div>

                {/* Hover Effect */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 0.1, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-lg pointer-events-none"
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Philosophy Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="p-8 h-full">
              <h3 className="text-2xl font-bold hierarchy-primary mb-8 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-accent" />
                Detective Philosophy
              </h3>
              
              <div className="space-y-6">
                {philosophies.map((philosophy, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="border-l-4 border-accent/30 pl-6 py-2"
                  >
                    <div className="flex items-start space-x-3">
                      <philosophy.icon className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <blockquote className="hierarchy-primary italic text-lg leading-relaxed mb-2">
                          "{philosophy.quote}"
                        </blockquote>
                        <div className="text-sm hierarchy-tertiary">- {philosophy.context}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quirks & Personality */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="p-8 h-full">
              <h3 className="text-2xl font-bold hierarchy-primary mb-8 flex items-center">
                <Star className="w-6 h-6 mr-3 text-accent" />
                Detective Quirks
              </h3>
              
              <div className="space-y-4">
                {quirks.map((quirk, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ scale: 1.05, x: 8 }}
                    className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl hover:bg-accent/10 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300" />
                    <span className="hierarchy-secondary text-base">{quirk}</span>
                  </motion.div>
                ))}
              </div>

              {/* Fun Stats */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-lg font-semibold hierarchy-primary mb-4">Fun Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted/20 rounded-lg border border-border">
                    <div className="text-2xl font-bold hierarchy-primary">42</div>
                    <div className="text-sm hierarchy-tertiary">Coffee cups/week</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg border border-border">
                    <div className="text-2xl font-bold hierarchy-primary">∞</div>
                    <div className="text-sm hierarchy-tertiary">Learning curiosity</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg border border-border">
                    <div className="text-2xl font-bold hierarchy-primary">7</div>
                    <div className="text-sm hierarchy-tertiary">Favorite BSD character</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg border border-border">
                    <div className="text-2xl font-bold hierarchy-primary">100%</div>
                    <div className="text-sm hierarchy-tertiary">Commitment to craft</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="p-8 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
            <h3 className="text-2xl font-bold hierarchy-primary mb-4">
              Ready to Solve Your Digital Mystery?
            </h3>
            <p className="text-lg hierarchy-secondary mb-6 max-w-2xl mx-auto">
              Whether it's a complex web application, a design challenge, or a marketing puzzle, 
              every problem is just another case waiting to be cracked.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Curious', 'Creative', 'Collaborative', 'Committed'].map((trait, index) => (
                <motion.div
                  key={trait}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 1 + index * 0.1, type: 'spring' }}
                >
                  <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2">
                    {trait}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PersonalDetailsSection;