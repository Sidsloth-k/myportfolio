import React from 'react';

interface TestimonialsSectionProps {
  testimonials: Array<{
    name: string;
    role: string;
    company: string;
    quote: string;
    rating: number;
    order: number;
  }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  errors?: Record<string, string>;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  onAdd,
  onRemove,
  onUpdate,
  errors
}) => {
  return (
    <section className="form-section">
      <h2>Testimonials</h2>
      <button type="button" onClick={onAdd} className="btn-add">
        + Add Testimonial
      </button>
      {testimonials.map((testimonial, index) => (
        <div key={index} className="array-item">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={testimonial.name}
              onChange={(e) => onUpdate(index, 'name', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Role *</label>
            <input
              type="text"
              value={testimonial.role}
              onChange={(e) => onUpdate(index, 'role', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              value={testimonial.company}
              onChange={(e) => onUpdate(index, 'company', e.target.value)}
              required
            />
          </div>
          <div className="form-group full-width">
            <label>Quote *</label>
            <textarea
              value={testimonial.quote}
              onChange={(e) => onUpdate(index, 'quote', e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="form-group">
            <label>Rating * (1-5)</label>
            <input
              type="number"
              value={testimonial.rating}
              onChange={(e) => onUpdate(index, 'rating', Math.max(1, Math.min(5, parseInt(e.target.value) || 5)))}
              min="1"
              max="5"
              className={errors?.[`testimonials_${index}_rating`] ? 'error' : ''}
              required
            />
            {errors?.[`testimonials_${index}_rating`] && (
              <span className="error-text">{errors[`testimonials_${index}_rating`]}</span>
            )}
          </div>
          <div className="form-group">
            <label>Order</label>
            <input
              type="number"
              value={testimonial.order}
              onChange={(e) => onUpdate(index, 'order', parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="btn-remove"
          >
            Remove
          </button>
        </div>
      ))}
    </section>
  );
};

export default TestimonialsSection;




