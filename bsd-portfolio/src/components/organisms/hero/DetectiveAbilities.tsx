import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Zap, Star } from 'lucide-react';
import { AbilitiesList, StatsGrid } from '../../molecules/hero';

interface DetectiveAbilitiesProps {
  isInView: boolean;
}

const DetectiveAbilities: React.FC<DetectiveAbilitiesProps> = ({ isInView }) => {
  const abilities = [
    {
      name: 'No Longer Human',
      description: 'Nullifies complex technical problems',
      icon: Shield,
      color: 'text-blue-600',
      specialty: 'Full-Stack Development'
    },
    {
      name: 'Art of War',
      description: 'Strategic design and user experience mastery',
      icon: Target,
      color: 'text-purple-600',
      specialty: 'UI/UX Design'
    },
    {
      name: 'Mind Control',
      description: 'Influences market behavior through data-driven insights',
      icon: Zap,
      color: 'text-green-600',
      specialty: 'Marketing Analytics'
    },
    {
      name: 'Detective Reasoning',
      description: 'Solves business challenges with analytical precision',
      icon: Star,
      color: 'text-orange-600',
      specialty: 'Problem Solving'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="text-center lg:text-left mb-8">
        <h2 className="text-3xl font-bold hierarchy-primary mb-4">
          Detective Abilities
        </h2>
        <p className="hierarchy-secondary text-lg">
          Each skill mastered through years of solving digital mysteries
        </p>
      </div>

      <AbilitiesList abilities={abilities} isInView={isInView} />
      <StatsGrid isInView={isInView} />
    </motion.div>
  );
};

export default DetectiveAbilities;