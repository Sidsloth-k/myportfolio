import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, CheckCircle, Zap, Star, ArrowDown } from 'lucide-react';
import { Badge } from '../../ui/badge';

interface ProjectPhase {
  phase: string;
  description: string;
  duration: string;
  deliverables: string[];
  challenges: string[];
  solutions: string[];
  status: string;
  progress_percent?: number;
}

interface CompactRoadmapFlowProps {
  roadmap: ProjectPhase[];
  isInView: boolean;
}

const getPhasePercent = (phase: ProjectPhase): number => {
  if (typeof phase.progress_percent === 'number') return Math.max(0, Math.min(100, phase.progress_percent));
  const status = (phase.status || '').toLowerCase();
  if (status.includes('completed')) return 100;
  if (status.includes('in') && status.includes('progress')) {
    const match = status.match(/(\d{1,3})%/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (!isNaN(n)) return Math.max(0, Math.min(100, n));
    }
    return 50;
  }
  if (status.includes('not') && status.includes('started')) return 0;
  return 0;
};

const CompactRoadmapFlow: React.FC<CompactRoadmapFlowProps> = ({ roadmap, isInView }) => {
  return (
    <div className="relative py-16 mb-20">
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold hierarchy-primary mb-12 text-center"
      >
        Development Journey
        <div className="text-lg hierarchy-secondary mt-2 font-normal">
          Three-phase development approach with comprehensive deliverables
        </div>
      </motion.h3>
      
      {/* Desktop Timeline */}
      <div className="hidden md:block relative max-w-6xl mx-auto">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-accent via-primary to-secondary rounded-full" />

        {roadmap.map((phase, index) => {
          const isEven = index % 2 === 0;
          const phaseRef = useRef<HTMLDivElement>(null);
          const phaseInView = useInView(phaseRef, { once: true, margin: '-50px' });
          const percent = getPhasePercent(phase);
          
          return (
            <motion.div
              key={index}
              ref={phaseRef}
              initial={{ opacity: 0, x: isEven ? -30 : 30 }}
              animate={phaseInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative mb-16 ${isEven ? 'text-left pr-1/2' : 'text-right pl-1/2 ml-auto'}`}
              style={{ width: '48%' }}
            >
              {/* Timeline Node */}
              <motion.div
                initial={{ scale: 0 }}
                animate={phaseInView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                className={`absolute top-6 w-6 h-6 bg-gradient-to-br from-accent to-primary rounded-full border-4 border-card z-10 ${
                  isEven ? 'right-0 transform translate-x-1/2' : 'left-0 transform -translate-x-1/2'
                }`}
              />

              {/* Compact Phase Card */}
              <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border rounded-2xl p-6 anime-shadow relative overflow-hidden group hover:border-accent/50 transition-all duration-300"
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                {/* Phase Number */}
                <div className={`absolute ${isEven ? '-right-4' : '-left-4'} -top-4 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg border-4 border-accent/50 anime-shadow`}>
                  {index + 1}
                </div>

                {/* Status and Duration */}
                <div className={`flex items-center gap-3 mb-4 ${isEven ? 'justify-start' : 'justify-end'}`}>
                  <Badge 
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-300 px-3 py-1"
                  >
                    ✓ {phase.status}
                  </Badge>
                  <div className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                    {phase.duration}
                  </div>
                </div>

                {/* Phase Content */}
                <h4 className="text-xl font-bold hierarchy-primary mb-3">
                  {phase.phase}
                </h4>
                
                <p className="hierarchy-secondary mb-4 text-base leading-relaxed">
                  {phase.description}
                </p>

                {/* Deliverables Grid */}
                <div className="mb-4">
                  <h5 className="font-semibold hierarchy-primary mb-2 flex items-center text-sm">
                    <Target className="w-4 h-4 mr-2 text-accent" />
                    Key Deliverables
                  </h5>
                  <div className="grid grid-cols-2 gap-1">
                    {phase.deliverables.map((deliverable, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={phaseInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: index * 0.1 + i * 0.05, duration: 0.3 }}
                        className="flex items-center space-x-1 p-1 bg-muted/20 rounded text-xs"
                      >
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <span className="hierarchy-secondary text-xs truncate">{deliverable}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Challenges and Solutions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                    <h6 className="font-semibold text-red-800 dark:text-red-400 mb-1 flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      Challenges
                    </h6>
                    <ul className="space-y-0.5">
                      {phase.challenges.map((challenge, i) => (
                        <li key={i} className="text-red-700 dark:text-red-300">• {challenge}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                    <h6 className="font-semibold text-green-800 dark:text-green-400 mb-1 flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Solutions
                    </h6>
                    <ul className="space-y-0.5">
                      {phase.solutions.map((solution, i) => (
                        <li key={i} className="text-green-700 dark:text-green-300">• {solution}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-4 pt-3 border-t border-border/30">
                  <div className="flex justify-between items-center text-xs hierarchy-tertiary">
                    <span>Phase Progress</span>
                    <span className="font-semibold hierarchy-primary">{percent}%</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1.5 mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={phaseInView ? { width: `${percent}%` } : {}}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className="bg-gradient-to-r from-accent to-primary h-1.5 rounded-full relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-0 left-0 w-full h-full bg-white/20"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Timeline with Arrows */}
      <div className="md:hidden space-y-6 px-4">
        {roadmap.map((phase, index) => {
          const phaseRef = useRef<HTMLDivElement>(null);
          const phaseInView = useInView(phaseRef, { once: true, margin: '-30px' });
          const percent = getPhasePercent(phase);
          
          return (
            <motion.div
              key={index}
              ref={phaseRef}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              {/* Phase Number Node */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={phaseInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  className="w-14 h-14 bg-gradient-to-br from-accent to-primary rounded-full border-4 border-card flex items-center justify-center text-primary-foreground font-bold text-lg anime-shadow z-10"
                >
                  {index + 1}
                </motion.div>
              </div>

              {/* Phase Card */}
              <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-6 anime-shadow relative overflow-hidden group hover:border-accent/50 transition-all duration-300"
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                {/* Status and Duration */}
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <Badge 
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-300 px-3 py-1"
                  >
                    ✓ {phase.status}
                  </Badge>
                  <div className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                    {phase.duration}
                  </div>
                </div>

                {/* Phase Content */}
                <h4 className="text-lg sm:text-xl font-bold hierarchy-primary mb-3 text-center">
                  {phase.phase}
                </h4>
                
                <p className="hierarchy-secondary mb-4 text-sm sm:text-base leading-relaxed text-center">
                  {phase.description}
                </p>

                {/* Deliverables Grid */}
                <div className="mb-4">
                  <h5 className="font-semibold hierarchy-primary mb-2 flex items-center justify-center text-sm">
                    <Target className="w-4 h-4 mr-2 text-accent" />
                    Key Deliverables
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {phase.deliverables.map((deliverable, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={phaseInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: index * 0.1 + i * 0.05, duration: 0.3 }}
                        className="flex items-center space-x-1 p-1 bg-muted/20 rounded text-xs"
                      >
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <span className="hierarchy-secondary text-xs truncate">{deliverable}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Challenges and Solutions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                    <h6 className="font-semibold text-red-800 dark:text-red-400 mb-1 flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      Challenges
                    </h6>
                    <ul className="space-y-0.5">
                      {phase.challenges.map((challenge, i) => (
                        <li key={i} className="text-red-700 dark:text-red-300">• {challenge}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                    <h6 className="font-semibold text-green-800 dark:text-green-400 mb-1 flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Solutions
                    </h6>
                    <ul className="space-y-0.5">
                      {phase.solutions.map((solution, i) => (
                        <li key={i} className="text-green-700 dark:text-green-300">• {solution}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-4 pt-3 border-t border-border/30">
                  <div className="flex justify-between items-center text-xs hierarchy-tertiary">
                    <span>Phase Progress</span>
                    <span className="font-semibold hierarchy-primary">{percent}%</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1.5 mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={phaseInView ? { width: `${percent}%` } : {}}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className="bg-gradient-to-r from-accent to-primary h-1.5 rounded-full relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-0 left-0 w-full h-full bg-white/20"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Arrow pointing down (except for last item) */}
              {index < roadmap.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex justify-center mt-4"
                >
                  <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 bg-gradient-to-b from-accent to-primary rounded-full flex items-center justify-center"
                  >
                    <ArrowDown className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CompactRoadmapFlow;