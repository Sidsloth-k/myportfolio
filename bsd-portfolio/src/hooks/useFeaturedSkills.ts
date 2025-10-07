import { useMemo } from 'react';
import { Skill as ApiSkill } from './useSkillsList';

export function useFeaturedSkills(skills: ApiSkill[], maxSkills: number = 6) {
  return useMemo(() => {
    if (!skills || skills.length === 0) return [];

    // Sort skills by display_order, then by proficiency_level, then by name
    const sortedSkills = [...skills].sort((a, b) => {
      // First sort by display_order (lower is higher priority)
      if (a.display_order !== b.display_order) {
        return a.display_order - b.display_order;
      }
      
      // Then by proficiency_level (higher is better)
      if (a.proficiency_level !== b.proficiency_level) {
        return b.proficiency_level - a.proficiency_level;
      }
      
      // Finally by name for consistency
      return a.name.localeCompare(b.name);
    });

    // Take the top skills up to maxSkills
    return sortedSkills.slice(0, maxSkills);
  }, [skills, maxSkills]);
}
