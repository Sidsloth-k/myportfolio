import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Badge } from '../../ui/badge';
import { SkillProgressCircle } from '../../atoms/skills';
import { Skill, SkillCategory } from '../../../hooks/useSkillsList';

interface SkillCardProps {
  skill: Skill;
  category: SkillCategory;
  onSkillClick: (skill: Skill) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, category, onSkillClick }) => {
  // Get the icon component for the skill
  const getSkillIcon = (skill: Skill) => {
    const iconKey = skill.icon_key || 'Code';
    const IconComponent = (LucideIcons as any)[iconKey];
    return IconComponent || LucideIcons.Code;
  };

  const SkillIcon = getSkillIcon(skill);

  return (
  <motion.div
    whileHover={{ 
      scale: 1.02, 
      y: -8,
      boxShadow: `0 20px 40px ${skill.color}20`
    }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onSkillClick(skill)}
    className="cursor-pointer bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border/50 rounded-2xl p-5 anime-shadow hover:border-accent/50 transition-all duration-500 group relative overflow-hidden h-full"
  >
    {/* Background Gradient Effect */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
      style={{
        background: `linear-gradient(135deg, ${skill.color}20, transparent)`
      }}
    />

    <div className="relative z-10 flex flex-col h-full">
      {/* Skill Icon */}
      <div className="flex justify-center mb-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${skill.color}20` }}
        >
          <SkillIcon 
            className="w-6 h-6" 
            style={{ color: skill.color }}
          />
        </div>
      </div>

      {/* Skill Name */}
      <h3 className="font-semibold text-foreground mb-2 text-center text-base leading-tight">
        {skill.name}
      </h3>

      {/* Proficiency Level - Compact */}
      <div className="text-center mb-3">
        <div 
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: `${skill.color}20`,
            color: skill.color,
            border: `1px solid ${skill.color}40`
          }}
        >
          {skill.proficiency_level}% Mastery
        </div>
      </div>

      {/* Technologies Preview - Max 2 */}
      <div className="flex flex-wrap justify-center gap-1 mb-3">
        {skill.technologies.slice(0, 2).map((tech: string) => (
          <motion.span
            key={tech}
            whileHover={{ scale: 1.05 }}
            className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-md border border-border/50"
          >
            {tech}
          </motion.span>
        ))}
        {skill.technologies.length > 2 && (
          <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md border border-accent/20">
            +{skill.technologies.length - 2}
          </span>
        )}
      </div>

      {/* Project Count */}
      <div className="flex items-center justify-between text-xs mt-auto">
        <span className="text-muted-foreground">
          {skill.project_count || 0} {skill.project_count === 1 ? 'case' : 'cases'}
        </span>
        <ChevronRight 
          className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" 
        />
      </div>
    </div>

    {/* Hover Glow Effect */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileHover={{ opacity: 0.1, scale: 1.2 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 rounded-2xl"
      style={{
        background: `radial-gradient(circle at center, ${skill.color}, transparent 70%)`
      }}
    />
  </motion.div>
  );
};

export default SkillCard; 