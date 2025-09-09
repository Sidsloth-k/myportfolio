import React from 'react';
import { motion, MotionValue } from 'framer-motion';

interface ProjectDetailBackgroundProps {
  y1: MotionValue<number>;
  y2: MotionValue<number>;
  opacity: MotionValue<number>;
}

const ProjectDetailBackground: React.FC<ProjectDetailBackgroundProps> = ({ y1, y2, opacity }) => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"
      />
    </div>
  );
};

export default ProjectDetailBackground;