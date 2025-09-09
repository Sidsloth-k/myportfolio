import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../ui/badge';

interface Technology {
  name: string;
  category: string;
  level: string;
  icon: string;
  // Optional dynamic fields if backend provides them
  levelPercent?: number;
  level_percent?: number;
  proficiency?: number;
  score?: number;
  level_label?: string;
  level_min?: number;
  level_max?: number;
}

interface TechnicalStackShowcaseProps {
  technologies: Technology[];
  isInView: boolean;
}

const getLevelPercent = (tech: Technology): number => {
  // Prefer explicit numeric fields if present
  if (typeof tech.levelPercent === 'number') return Math.max(0, Math.min(100, tech.levelPercent));
  if (typeof tech.level_percent === 'number') return Math.max(0, Math.min(100, tech.level_percent));
  if (typeof tech.proficiency === 'number') return Math.max(0, Math.min(100, tech.proficiency));
  if (typeof tech.score === 'number') return Math.max(0, Math.min(100, tech.score));

  // If level contains a percent like "85%", parse it
  if (typeof tech.level === 'string') {
    const match = tech.level.match(/(\d{1,3})%/);
    if (match) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val)) return Math.max(0, Math.min(100, val));
    }
  }

  // Fallback mapping by qualitative level
  switch (tech.level) {
    case 'Expert':
      return 95;
    case 'Advanced':
      return 85;
    case 'Intermediate':
      return 70;
    case 'Beginner':
      return 50;
    default:
      return 70;
  }
};

const TechnicalStackShowcase: React.FC<TechnicalStackShowcaseProps> = ({ technologies, isInView }) => {
  return (
    <div className="mb-20">
      <motion.h3 
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-3xl font-bold hierarchy-primary mb-12 text-center"
      >
        Technical Arsenal & Architecture
        <div className="text-lg hierarchy-secondary mt-2 font-normal">
          Cutting-edge technologies powering the solution
        </div>
      </motion.h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {technologies.map((tech, index) => {
          const percent = getLevelPercent(tech);
          const badgeLabel = tech.level_label || tech.level || 'Level';
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring' }}
              whileHover={{ y: -8, rotateY: 5, scale: 1.02 }}
              className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border rounded-2xl p-6 anime-shadow hover:border-accent/50 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Background Tech Pattern */}
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent" />
              </div>

              <div className="relative z-10">
                {/* Tech Icon and Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{tech.icon}</div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${
                      badgeLabel === 'Master' || badgeLabel === 'Expert' ? 'text-green-600 border-green-300 bg-green-50 dark:bg-green-950/20' :
                      badgeLabel === 'Advanced' ? 'text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/20' :
                      badgeLabel === 'Intermediate' ? 'text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20' :
                      'text-muted-foreground border-border'
                    }`}
                  >
                    {badgeLabel}
                  </Badge>
                </div>

                {/* Tech Name and Category */}
                <h4 className="text-xl font-bold hierarchy-primary mb-2">{tech.name}</h4>
                <div className="text-sm hierarchy-tertiary mb-4">{tech.category}</div>
                
                {/* Skill Level Visualization */}
                <div className="relative">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="hierarchy-tertiary">Proficiency</span>
                    <span className="hierarchy-primary font-semibold">{percent}%</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${percent}%` } : {}}
                      transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
                      className="bg-gradient-to-r from-accent to-primary h-3 rounded-full relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-0 left-0 w-full h-full bg-white/30"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Hover Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-2xl"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TechnicalStackShowcase;