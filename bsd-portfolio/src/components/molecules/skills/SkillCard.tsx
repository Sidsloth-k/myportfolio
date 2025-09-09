import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { SkillProgressCircle } from '../../atoms/skills';

interface Project {
  id: number;
  title: string;
  contribution: string;
  complexity: string;
}

interface SkillData {
  category: string;
  proficiency: number;
  experience: string;
  description: string;
  projects: Project[];
  technologies: string[];
  achievements: string[];
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

interface SkillCardProps {
  skillName: string;
  skillData: SkillData;
  category: any;
  onSkillClick: (skillName: string) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skillName, skillData, category, onSkillClick }) => (
  <motion.div
    whileHover={{ 
      scale: 1.02, 
      y: -8,
      boxShadow: `0 20px 40px ${skillData.color}20`
    }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onSkillClick(skillName)}
    className="cursor-pointer bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border/50 rounded-2xl p-6 anime-shadow hover:border-accent/50 transition-all duration-500 group relative overflow-hidden"
  >
    {/* Background Gradient Effect */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
      style={{
        background: `linear-gradient(135deg, ${skillData.color}20, transparent)`
      }}
    />

    {/* Skill Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h4 className="text-xl font-bold text-foreground mb-2">{skillName}</h4>
        <Badge 
          variant="outline" 
          className="text-xs border-current"
          style={{ color: skillData.color, borderColor: `${skillData.color}40` }}
        >
          {skillData.experience}
        </Badge>
      </div>
      <ChevronRight 
        className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" 
      />
    </div>

    {/* Circular Progress */}
    <div className="flex justify-center mb-6">
      <SkillProgressCircle 
        progress={skillData.proficiency} 
        color={skillData.color}
        skill={skillData}
      />
    </div>

    {/* Description */}
    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
      {skillData.description}
    </p>

    {/* Technologies Preview */}
    <div className="flex flex-wrap gap-2 mb-4">
      {skillData.technologies.slice(0, 3).map((tech: string) => (
        <motion.span
          key={tech}
          whileHover={{ scale: 1.05 }}
          className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-md border border-border/50"
        >
          {tech}
        </motion.span>
      ))}
      {skillData.technologies.length > 3 && (
        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md border border-accent/20">
          +{skillData.technologies.length - 3}
        </span>
      )}
    </div>

    {/* Project Count */}
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        {skillData.projects.length} project{skillData.projects.length !== 1 ? 's' : ''}
      </span>
      <span 
        className="font-semibold"
        style={{ color: skillData.color }}
      >
        Click to explore
      </span>
    </div>

    {/* Hover Glow Effect */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileHover={{ opacity: 0.1, scale: 1.2 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 rounded-2xl"
      style={{
        background: `radial-gradient(circle at center, ${skillData.color}, transparent 70%)`
      }}
    />
  </motion.div>
);

export default SkillCard; 