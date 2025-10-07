import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import { SkillsBackground } from './atoms/skills';
import { SkillsSectionHeader, SkillsViewMoreButton, SkillsStatsGrid } from './molecules/skills';
import { CompactSkillsGrid } from './organisms/skills';
import { useSkillsList } from '../hooks/useSkillsList';

interface CompactSkillsSectionProps {
  onViewMore: () => void;
}

const CompactSkillsSection: React.FC<CompactSkillsSectionProps> = ({ onViewMore }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  // Fetch skills data
  const { skills, isFetching, hasFetched } = useSkillsList(false);

  return (
    <section ref={containerRef} className="py-16 px-6 relative overflow-hidden">
      <SkillsBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <SkillsSectionHeader isInView={isInView} />
        <CompactSkillsGrid 
          isInView={isInView} 
          skills={skills}
          loading={isFetching && !hasFetched}
        />
        <SkillsViewMoreButton isInView={isInView} onViewMore={onViewMore} />
        <SkillsStatsGrid isInView={isInView} />
      </div>
    </section>
  );
};

export default CompactSkillsSection;