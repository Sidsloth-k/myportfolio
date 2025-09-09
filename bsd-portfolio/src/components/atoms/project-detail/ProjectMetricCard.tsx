import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Star, Zap, CheckCircle, Award, Eye } from 'lucide-react';

interface ProjectMetricCardProps {
  metric: string;
  value: string | number;
  index: number;
  isInView: boolean;
}

const ProjectMetricCard: React.FC<ProjectMetricCardProps> = ({ 
  metric, 
  value, 
  index, 
  isInView 
}) => {
  const getIcon = (index: number) => {
    const icons = [TrendingUp, Users, Target, Star, Zap, CheckCircle, Award, Eye];
    const colors = ['text-accent', 'text-primary', 'text-secondary', 'text-accent', 'text-primary', 'text-green-600', 'text-accent', 'text-primary'];
    const IconComponent = icons[index] || TrendingUp;
    const colorClass = colors[index] || 'text-accent';
    
    return <IconComponent className={`w-6 h-6 ${colorClass}`} />;
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border rounded-2xl p-6 text-center anime-shadow hover:anime-glow overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Metric Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          {getIcon(index)}
        </div>

        {/* Metric Value */}
        <div className="text-3xl font-bold hierarchy-primary mb-2">
          {String(value)}
        </div>

        {/* Metric Label */}
        <div className="hierarchy-secondary font-medium text-sm leading-tight">
          {metric}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectMetricCard;