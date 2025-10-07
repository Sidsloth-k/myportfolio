import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Star, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Badge } from '../../ui/badge';
import { SkillProgressCircle } from '../../atoms/skills';
import { Skill } from '../../../hooks/useSkillsList';
import { useSkillDetail } from '../../../hooks/useSkillDetail';

interface SkillDetailModalProps {
  selectedSkill: Skill | null;
  onClose: () => void;
  onProjectClick: (projectId: number) => void;
}

const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  selectedSkill,
  onClose,
  onProjectClick,
}) => {
  const { skillDetail, isLoading, error } = useSkillDetail(selectedSkill?.id || null);
  
  if (!selectedSkill) return null;

  // Use the detailed skill data if available, otherwise fall back to the basic skill data
  const displaySkill = skillDetail || selectedSkill;

  // Get the icon component for the skill
  const getSkillIcon = (skill: Skill) => {
    const iconKey = skill.icon_key || 'Code';
    const IconComponent = (LucideIcons as any)[iconKey];
    return IconComponent || LucideIcons.Code;
  };

  const SkillIcon = getSkillIcon(displaySkill);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateY: 20 }}
        transition={{ type: 'spring', duration: 0.6 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card/95 backdrop-blur-xl border-2 border-border/60 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden anime-shadow shadow-2xl relative"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Sticky Header */}
        <div
          className="sticky top-0 z-20 p-4 sm:p-6 rounded-t-2xl text-white relative overflow-hidden border-b border-white/20"
          style={{
            background: `linear-gradient(135deg, ${displaySkill.color}, ${displaySkill.color}DD)`,
          }}
        >
          {/* Header Background Effect */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3), transparent 50%)`,
              }}
            />
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 flex-shrink-0">
                <SkillIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg truncate">
                  {displaySkill.name}
                </h3>
                <p className="text-white/95 text-sm sm:text-lg font-medium truncate">
                  {displaySkill.category_name} • {displaySkill.years_experience}
                </p>
              </div>
            </div>
            
            {/* Enhanced Close Button */}
            <button
              onClick={onClose}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 hover:scale-110 shadow-lg hover:shadow-xl flex-shrink-0"
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7 text-white font-bold" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <span className="text-muted-foreground">Loading skill details...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️ Error loading skill details</div>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        {!isLoading && !error && (
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-dazai-cream dark:bg-card backdrop-blur-sm">
            {/* Overview and Proficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h4 className="text-lg sm:text-xl font-semibold text-dazai-dark dark:text-foreground mb-3 sm:mb-4 hierarchy-primary">
                  Overview
                </h4>
                <p className="text-dazai-muted dark:text-muted-foreground leading-relaxed text-base sm:text-lg hierarchy-tertiary">
                  {displaySkill.description}
                </p>
              </div>
              <div className="flex justify-center">
                <SkillProgressCircle
                  progress={displaySkill.proficiency_level}
                  color={displaySkill.color}
                  skill={displaySkill}
                  size={120}
                  strokeWidth={10}
                />
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-lg sm:text-xl font-semibold text-dazai-dark dark:text-foreground mb-4 sm:mb-6 hierarchy-primary">
                Technologies & Tools
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {displaySkill.technologies.map((tech: string, index: number) => (
                  <motion.div
                    key={tech}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="p-3 sm:p-4 text-center rounded-xl border-2 border-dazai-brown/30 dark:border-border/50 hover:border-accent/60 transition-all duration-300 bg-white/60 dark:bg-card/80 backdrop-blur-sm hover:shadow-lg"
                  >
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: `${displaySkill.color}30` }}
                    >
                      <div
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                        style={{ backgroundColor: displaySkill.color }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-dazai-dark dark:text-foreground hierarchy-secondary">
                      {tech}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="text-lg sm:text-xl font-semibold text-dazai-dark dark:text-foreground mb-4 sm:mb-6 hierarchy-primary">
                Key Achievements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {displaySkill.key_achievements.map(
                  (achievement: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 sm:p-4 rounded-xl border-2 border-dazai-brown/30 dark:border-border/50 hover:anime-shadow transition-all duration-300 bg-white/60 dark:bg-card/80 backdrop-blur-sm"
                    >
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mb-2 sm:mb-3 flex items-center justify-center"
                        style={{ backgroundColor: `${displaySkill.color}30` }}
                      >
                        <Star
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: displaySkill.color }}
                        />
                      </div>
                      <p className="text-dazai-dark dark:text-foreground font-medium text-sm sm:text-base hierarchy-secondary">
                        {achievement}
                      </p>
                    </motion.div>
                  )
                )}
              </div>
            </div>

            {/* Related Cases */}
            <div>
              <h4 className="text-lg sm:text-xl font-semibold text-dazai-dark dark:text-foreground mb-4 sm:mb-6 hierarchy-primary">
                Related Cases
              </h4>
              {displaySkill.projects && displaySkill.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {displaySkill.projects.map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ scale: 1.02, y: -4 }}
                      onClick={() => {
                        onClose();
                        onProjectClick(project.id);
                      }}
                      className="cursor-pointer border-2 border-dazai-brown/30 dark:border-border/50 rounded-xl p-4 sm:p-5 hover:border-accent/60 hover:anime-shadow transition-all duration-300 group bg-white/60 dark:bg-card/80 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <h5 className="font-semibold text-dazai-dark dark:text-foreground text-sm group-hover:text-accent transition-colors hierarchy-secondary">
                          {project.title}
                        </h5>
                        <ExternalLink className="w-4 h-4 text-dazai-muted dark:text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                      </div>
                      <p className="text-dazai-muted dark:text-muted-foreground text-xs mb-2 sm:mb-3 hierarchy-tertiary">
                        {project.contribution}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${
                          project.complexity === 'Complex'
                            ? 'text-red-600 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-400 dark:bg-red-950/20'
                            : project.complexity === 'Medium'
                            ? 'text-yellow-600 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-400 dark:bg-yellow-950/20'
                            : 'text-green-600 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-400 dark:bg-green-950/20'
                        }`}
                      >
                        {project.complexity} Case
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 text-muted-foreground">🔍</div>
                  </div>
                  <h5 className="text-lg font-semibold text-dazai-dark dark:text-foreground mb-2">
                    No cases linked yet
                  </h5>
                  <p className="text-dazai-muted dark:text-muted-foreground text-sm">
                    This skill hasn't been used in any investigations yet. The case files are still being compiled.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SkillDetailModal;