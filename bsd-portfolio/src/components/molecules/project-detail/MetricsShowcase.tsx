import React from 'react';
import { motion } from 'framer-motion';
import { ProjectMetricCard, ProjectTestimonialCard } from '../../atoms/project-detail';

interface ProjectTestimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

interface MetricsShowcaseProps {
  metrics: Array<{
    metric: string;
    value: string | number;
  }>;
  testimonials: ProjectTestimonial[];
  isInView: boolean;
}

const MetricsShowcase: React.FC<MetricsShowcaseProps> = ({ metrics, testimonials, isInView }) => {
  return (
    <div className="mb-20">
      <motion.h3 
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-3xl font-bold hierarchy-primary mb-12 text-center"
      >
        Impact & Results Dashboard
        <div className="text-lg hierarchy-secondary mt-2 font-normal">
          Measurable success metrics and key performance indicators
        </div>
      </motion.h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {metrics.map((item, index) => (
          <ProjectMetricCard
            key={item.metric}
            metric={item.metric}
            value={item.value}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <ProjectTestimonialCard
            key={index}
            testimonial={testimonial}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsShowcase;