import React from 'react';
import { ProjectTestimonialCard } from '../../atoms/project-detail';

interface ProjectTestimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

interface ProjectTestimonialsSectionProps {
  testimonials: ProjectTestimonial[];
  isInView: boolean;
}

const ProjectTestimonialsSection: React.FC<ProjectTestimonialsSectionProps> = ({ 
  testimonials, 
  isInView 
}) => {
  return (
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
  );
};

export default ProjectTestimonialsSection;