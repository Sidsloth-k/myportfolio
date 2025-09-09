import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SkillCard from '../../molecules/skills/SkillCard';
import SkillDetailModal from './SkillDetailModal';
import { skillsData, skillCategories } from './skillsData';

interface EnhancedSkillsSectionProps {
  onProjectClick: (projectId: number) => void;
}

const EnhancedSkillsSection: React.FC<EnhancedSkillsSectionProps> = ({ onProjectClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleSkillClick = (skillName: string) => {
    setSelectedSkill(skillName);
  };

  const handleCloseModal = () => {
    setSelectedSkill(null);
  };

  const selectedSkillData = selectedSkill ? skillsData[selectedSkill as keyof typeof skillsData] : null;
  const selectedCategory = selectedSkill ? skillCategories.find(cat => cat.skills.includes(selectedSkill)) : null;

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
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
            className="mb-20"
          >
            <div className="flex items-center space-x-4 mb-10">
              <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center anime-shadow`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-foreground">{category.id}</h3>
                <p className="text-muted-foreground">
                  {category.skills.length} skill{category.skills.length !== 1 ? 's' : ''} • Click to explore
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.skills.map((skillName, skillIndex) => (
                <motion.div
                  key={skillName}
                  initial={{ opacity: 0, y: 30, rotateX: -10 }}
                  animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: categoryIndex * 0.2 + skillIndex * 0.1,
                    type: 'spring'
                  }}
                >
                  <SkillCard
                    skillName={skillName}
                    skillData={skillsData[skillName as keyof typeof skillsData]}
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
        skillData={selectedSkillData}
        category={selectedCategory}
        onClose={handleCloseModal}
        onProjectClick={onProjectClick}
      />
    </section>
  );
};

export default EnhancedSkillsSection; 