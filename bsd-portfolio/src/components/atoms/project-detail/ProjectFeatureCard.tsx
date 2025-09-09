import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../ui/badge';

interface ProjectFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: string;
  impact: string;
}

interface ProjectFeatureCardProps {
  feature: ProjectFeature;
  index: number;
  isInView: boolean;
}

const ProjectFeatureCard: React.FC<ProjectFeatureCardProps> = ({ 
  feature, 
  index, 
  isInView 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'planned': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border rounded-2xl p-6 anime-shadow hover:anime-glow group"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
          <feature.icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold hierarchy-primary">{feature.title}</h4>
            <Badge className={`text-xs ${getStatusColor(feature.status)}`}>
              {feature.status}
            </Badge>
          </div>
          <p className="hierarchy-secondary text-sm leading-relaxed mb-3">
            {feature.description}
          </p>
          <div className="text-xs text-accent font-medium">
            Impact: {feature.impact}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectFeatureCard;