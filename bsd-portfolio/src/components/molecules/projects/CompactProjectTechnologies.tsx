import React from 'react';
import { motion } from 'framer-motion';

interface CompactProjectTechnologiesProps {
  technologies: string[];
}

const CompactProjectTechnologies: React.FC<CompactProjectTechnologiesProps> = ({ technologies }) => {
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {technologies.map((tech) => (
        <motion.span
          key={tech}
          whileHover={{ scale: 1.05 }}
          className="px-2 py-1 bg-muted/50 hierarchy-tertiary text-xs rounded border border-border hover:border-accent/50 transition-colors"
        >
          {tech}
        </motion.span>
      ))}
    </div>
  );
};

export default CompactProjectTechnologies;