import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SkillCard from '../../molecules/skills/SkillCard';
import SkillDetailModal from './SkillDetailModal';
import { useSkillsList, Skill, SkillCategory } from '../../../hooks/useSkillsList';

interface EnhancedSkillsSectionProps {
  onProjectClick: (projectId: number) => void;
}

const EnhancedSkillsSection: React.FC<EnhancedSkillsSectionProps> = ({ onProjectClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  
  // Fetch skills data from API
  const { categories, isFetching, hasFetched, error } = useSkillsList();

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleCloseModal = () => {
    setSelectedSkill(null);
  };

  // Show loading state
  if (isFetching && !hasFetched) {
    return (
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Compiling case files...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️ Case files corrupted</div>
            <p className="text-muted-foreground">Unable to access the skills database. The investigation is compromised.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="py-20 px-6 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-dazai-gold/10 to-dazai-brown/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-dazai-brown/10 to-dazai-dark/10 rounded-full blur-3xl"
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
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Detective Arsenal
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Like the diverse abilities of the Armed Detective Agency members, 
            each skill has been honed through real-world cases and challenges. 
            Click on any skill to explore its applications and linked projects.
          </p>
          
          {/* Dazai Quote */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="italic text-accent text-lg max-w-2xl mx-auto bg-muted/20 p-6 rounded-2xl border border-border/50"
          >
            "Every skill is a story. Every story is a solution waiting to be discovered."
            <div className="text-sm font-semibold mt-2 text-foreground">— Dazai Osamu</div>
          </motion.div>
        </motion.div>

        {/* Skills by category */}
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
            className="mb-20"
          >
            <div className="flex items-center space-x-4 mb-10">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center anime-shadow"
                style={{ 
                  background: `linear-gradient(135deg, ${category.color}, ${category.color}DD)`
                }}
              >
                <div className="w-8 h-8 text-white font-bold text-lg">
                  {category.name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-foreground">{category.name}</h3>
                <p className="text-muted-foreground">
                  {category.skill_count} ability{category.skill_count !== 1 ? 'ies' : ''} • Click to investigate
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 30, rotateX: -10 }}
                  animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: categoryIndex * 0.2 + skillIndex * 0.1,
                    type: 'spring'
                  }}
                >
                  <SkillCard
                    skill={skill}
                    category={category}
                    onSkillClick={handleSkillClick}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skill detail modal */}
      <SkillDetailModal
        selectedSkill={selectedSkill}
        onClose={handleCloseModal}
        onProjectClick={onProjectClick}
      />
    </section>
  );
};

export default EnhancedSkillsSection; 