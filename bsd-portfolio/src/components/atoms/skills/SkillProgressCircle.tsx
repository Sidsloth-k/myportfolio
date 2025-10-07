import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Skill } from '../../../hooks/useSkillsList';

interface SkillProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  skill: Skill;
}

const SkillProgressCircle: React.FC<SkillProgressCircleProps> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color, 
  skill 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const skillRef = useRef<HTMLDivElement>(null);
  const skillInView = useInView(skillRef, { once: true });

  return (
    <div ref={skillRef} className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        
        {/* Animated Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={skillInView ? { strokeDashoffset: offset } : {}}
          transition={{ 
            duration: 2, 
            delay: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`
          }}
        />

        {/* Glowing Effect */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={2}
          fill="none"
          opacity={0.3}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={skillInView ? { 
            strokeDashoffset: offset,
            opacity: [0.3, 0.6, 0.3]
          } : {}}
          transition={{ 
            strokeDashoffset: { duration: 2, delay: 0.3 },
            opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={skillInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 1, type: 'spring' }}
          className="text-center"
        >
          <div 
            className="w-8 h-8 mb-2 mx-auto rounded-full flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {skill.name.charAt(0)}
          </div>
          <motion.div 
            className="text-2xl font-bold text-foreground"
            animate={skillInView ? { 
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ 
              delay: 1.5, 
              duration: 0.5, 
              repeat: Infinity, 
              repeatDelay: 3 
            }}
          >
            {progress}%
          </motion.div>
          <div className="text-xs text-muted-foreground font-medium">
            Proficiency
          </div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ backgroundColor: color }}
            initial={{
              x: size / 2,
              y: size / 2,
              opacity: 0
            }}
            animate={skillInView ? {
              x: [
                size / 2,
                size / 2 + Math.cos((i * 60) * Math.PI / 180) * (radius + 20)
              ],
              y: [
                size / 2,
                size / 2 + Math.sin((i * 60) * Math.PI / 180) * (radius + 20)
              ],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            } : {}}
            transition={{
              duration: 2,
              delay: 1.8 + i * 0.1,
              repeat: Infinity,
              repeatDelay: 4
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillProgressCircle; 