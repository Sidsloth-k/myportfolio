import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import { SkillIcon, StarRating } from '../../atoms/skills';

interface Skill {
  name: string;
  level: number;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  color: string;
}

interface CompactSkillCardProps {
  skill: Skill;
  index: number;
  isInView: boolean;
}

const CompactSkillCard: React.FC<CompactSkillCardProps> = ({ skill, index, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="group"
    >
      <Card className="p-4 h-full text-center hover:border-accent/50 transition-all duration-300 anime-shadow hover:anime-glow relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-lg" />
        </div>

        <div className="relative z-10">
          {/* Skill Icon */}
          <SkillIcon icon={skill.icon} color={skill.color} />

          {/* Skill Name */}
          <h3 className="font-semibold hierarchy-primary mb-2 text-sm leading-tight">
            {skill.name}
          </h3>

          {/* Star Rating */}
          <StarRating level={skill.level} index={index} isInView={isInView} />

          {/* Skill Level */}
          <div className="text-xs hierarchy-tertiary">
            {skill.level}% Mastery
          </div>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="mt-2"
          >
            <Badge 
              variant="outline" 
              className="text-xs capitalize bg-muted/30 border-muted-foreground/20"
            >
              {skill.category}
            </Badge>
          </motion.div>
        </div>

        {/* Hover Animation */}
        <motion.div
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"
        />
      </Card>
    </motion.div>
  );
};

export default CompactSkillCard;