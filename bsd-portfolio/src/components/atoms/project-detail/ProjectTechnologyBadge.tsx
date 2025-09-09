import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../ui/badge';

interface Technology {
  name: string;
  category: string;
  level: string;
  icon: string;
}

interface ProjectTechnologyBadgeProps {
  technology: Technology;
  index: number;
  isInView: boolean;
}

const ProjectTechnologyBadge: React.FC<ProjectTechnologyBadgeProps> = ({ 
  technology, 
  index, 
  isInView 
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'Advanced': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="group"
    >
      <div className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border rounded-xl p-4 text-center anime-shadow hover:anime-glow">
        <div className="text-2xl mb-2">{technology.icon}</div>
        <h4 className="font-semibold hierarchy-primary mb-1 text-sm">{technology.name}</h4>
        <p className="text-xs hierarchy-tertiary mb-2">{technology.category}</p>
        <Badge className={`text-xs ${getLevelColor(technology.level)}`}>
          {technology.level}
        </Badge>
      </div>
    </motion.div>
  );
};

export default ProjectTechnologyBadge;