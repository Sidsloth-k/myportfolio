import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ProjectTestimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

interface ProjectTestimonialCardProps {
  testimonial: ProjectTestimonial;
  index: number;
  isInView: boolean;
}

const ProjectTestimonialCard: React.FC<ProjectTestimonialCardProps> = ({ 
  testimonial, 
  index, 
  isInView 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
      className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border rounded-2xl p-6 anime-shadow"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h5 className="font-semibold hierarchy-primary">{testimonial.name}</h5>
            <div className="flex">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-sm hierarchy-tertiary mb-3">{testimonial.role}</p>
          <blockquote className="hierarchy-primary italic">
            "{testimonial.quote}"
          </blockquote>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectTestimonialCard;