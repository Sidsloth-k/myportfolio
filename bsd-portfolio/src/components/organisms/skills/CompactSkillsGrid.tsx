import React from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, TrendingUp, Database, Cloud, Shield } from 'lucide-react';
import { CompactSkillCard } from '../../molecules/skills';

interface CompactSkillsGridProps {
  isInView: boolean;
}

const CompactSkillsGrid: React.FC<CompactSkillsGridProps> = ({ isInView }) => {
  const skills = [
    {
      name: 'React',
      level: 95,
      icon: Code,
      category: 'frontend',
      color: 'text-blue-600'
    },
    {
      name: 'UI/UX Design',
      level: 90,
      icon: Palette,
      category: 'design',
      color: 'text-pink-600'
    },
    {
      name: 'Node.js',
      level: 88,
      icon: Shield,
      category: 'backend',
      color: 'text-green-600'
    },
    {
      name: 'Marketing Analytics',
      level: 85,
      icon: TrendingUp,
      category: 'marketing',
      color: 'text-orange-600'
    },
    {
      name: 'PostgreSQL',
      level: 82,
      icon: Database,
      category: 'database',
      color: 'text-indigo-600'
    },
    {
      name: 'AWS Cloud',
      level: 80,
      icon: Cloud,
      category: 'cloud',
      color: 'text-purple-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8"
    >
      {skills.map((skill, index) => (
        <CompactSkillCard
          key={skill.name}
          skill={skill}
          index={index}
          isInView={isInView}
        />
      ))}
    </motion.div>
  );
};

export default CompactSkillsGrid;