import React from 'react';
import { motion } from 'framer-motion';

interface CompactProjectTechnologiesProps {
  technologies: string[];
}

const CompactProjectTechnologies: React.FC<CompactProjectTechnologiesProps> = ({ technologies }) => {
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {technologies.slice(0, 3).map((tech) => (
        <motion.span
          key={tech}
          whileHover={{ scale: 1.05 }}
          className="px-2 py-1 bg-muted/50 hierarchy-tertiary text-xs rounded border border-border hover:border-accent/50 transition-colors"
        >
          {tech}
        </motion.span>
      ))}
      {technologies.length > 3 && (
        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded border border-accent/20">
          +{technologies.length - 3}
        </span>
      )}
    </div>
  );
};

export default CompactProjectTechnologies;