import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../ui/card';

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  description: string;
}

interface ContactInfoCardProps {
  info: ContactInfo;
  index: number;
  isInView: boolean;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  info,
  index,
  isInView
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6 + index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Card className="p-6 hover:border-accent/50 transition-all duration-300 anime-shadow">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
            <info.icon className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold hierarchy-primary mb-1">{info.label}</h4>
            <p className="hierarchy-primary font-medium mb-1">{info.value}</p>
            <p className="text-sm hierarchy-tertiary">{info.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContactInfoCard; 