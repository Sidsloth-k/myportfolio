import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../ui/badge';

interface Ability {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  specialty: string;
}

interface AbilityCardProps {
  ability: Ability;
  index: number;
  isInView: boolean;
}

const AbilityCard: React.FC<AbilityCardProps> = ({ ability, index, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
      whileHover={{ scale: 1.02, x: 8 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 anime-shadow hover:border-accent/50 transition-all duration-300 group"
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center ${ability.color} group-hover:scale-110 transition-transform duration-300`}>
          <ability.icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold hierarchy-primary mb-2">
            {ability.name}
          </h3>
          <p className="hierarchy-secondary mb-2 leading-relaxed">
            {ability.description}
          </p>
          <Badge variant="outline" className="text-xs">
            {ability.specialty}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

export default AbilityCard;