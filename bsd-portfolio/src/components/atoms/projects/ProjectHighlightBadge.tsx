import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../ui/badge';
import { Star } from 'lucide-react';

interface ProjectHighlightBadgeProps {
  highlight: string;
  index: number;
}

const ProjectHighlightBadge: React.FC<ProjectHighlightBadgeProps> = ({ highlight, index }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -12 }}
      animate={{ scale: 1, rotate: -12 }}
      transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
      className="absolute top-4 left-4"
    >
      <Badge className="bg-accent text-accent-foreground px-3 py-1 font-semibold anime-shadow">
        <Star className="w-3 h-3 mr-1" />
        {highlight}
      </Badge>
    </motion.div>
  );
};

export default ProjectHighlightBadge; 