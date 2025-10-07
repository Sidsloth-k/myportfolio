import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { CompactSkillCard } from '../../molecules/skills';
import { useFeaturedSkills } from '../../../hooks/useFeaturedSkills';
import { Skill as ApiSkill } from '../../../hooks/useSkillsList';

interface CompactSkillsGridProps {
  isInView: boolean;
  skills: ApiSkill[];
  loading?: boolean;
}

const CompactSkillsGrid: React.FC<CompactSkillsGridProps> = ({ isInView, skills, loading = false }) => {
  // Get featured skills (max 6)
  const featuredSkills = useFeaturedSkills(skills, 6);

  // Dynamic icon resolver - gets any icon from lucide-react by name
  const getIconForSkill = (skill: ApiSkill) => {
    const iconKey = skill.icon_key || 'Code';
    
    // Get the icon component from lucide-react dynamically
    const IconComponent = (LucideIcons as any)[iconKey];
    
    // Return the icon component or fallback to Code
    return IconComponent || LucideIcons.Code;
  };

  // Convert API skill to display format
  const displaySkills = featuredSkills.map(skill => ({
    name: skill.name,
    level: skill.proficiency_level,
    icon: getIconForSkill(skill),
    category: skill.category,
    color: `text-[${skill.color}]` // Use the actual skill color
  }));

  // Show loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-muted/30 rounded-lg p-4 animate-pulse"
          >
            <div className="w-8 h-8 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-1"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8"
    >
      {displaySkills.map((skill, index) => (
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