import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Badge } from '../../ui/badge';

interface AgencyBadgeProps {
  isInView: boolean;
}

const AgencyBadge: React.FC<AgencyBadgeProps> = ({ isInView }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -12 }}
      animate={isInView ? { scale: 1, rotate: -12 } : {}}
      transition={{ delay: 0.2, type: 'spring' }}
      className="inline-block mb-6"
    >
      <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2 text-sm font-semibold">
        <Shield className="w-4 h-4 mr-2" />
        Armed Detective Agency
      </Badge>
    </motion.div>
  );
};

export default AgencyBadge;