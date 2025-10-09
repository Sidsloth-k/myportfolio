import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { ContactForm, ContactSidebar } from './organisms/contact';
import { useContactContext } from '../contexts/ContactContext';
import { useContactSubmission, ContactSubmission } from '../hooks/useContactInfo';

interface FormData {
  name: string;
  email: string;
  caseType: string[];
  subject: string;
  message: string;
  urgency: string;
}

const ContactSectionRefactored: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    caseType: [],
    subject: '',
    message: '',
    urgency: 'medium'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get contact info from context
  const { contactInfo, loading: contactLoading } = useContactContext();
  
  // Use contact submission hook
  const { isSubmitting, submitStatus, error: submitError, submitContactForm, resetStatus } = useContactSubmission();

  // Map contact info to the format expected by ContactSidebar
  const mappedContactInfo = contactInfo.map(item => {
    const iconMap: Record<string, any> = {
      'mail': Mail,
      'map-pin': MapPin,
      'phone': Phone,
      'clock': Clock,
      'message-circle': Phone // For WhatsApp
    };
    
    return {
      icon: iconMap[item.icon_key] || Mail,
      label: item.label,
      value: item.value,
      values: item.contact_values || [item.value], // Support multiple values
      description: item.description,
      contact_type: item.contact_type
    };
  });

  // Add static Response Time as a selling point
  const staticContactInfo = [
    {
      icon: Clock,
      label: 'Response Time',
      value: '24-48 hours',
      values: ['24-48 hours'],
      description: 'Standard case response time'
    }
  ];

  // Combine dynamic and static contact info
  const allContactInfo = [...mappedContactInfo, ...staticContactInfo];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation - must be full name (at least 2 words)
    if (!formData.name.trim()) {
      newErrors.name = 'Detective name is required';
    } else if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = 'Please enter your full name (first and last name)';
    }
    
    // Email validation - must be valid email format
    if (!formData.email.trim()) {
      newErrors.email = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., your.name@example.com)';
    }
    
    // Case type validation
    if (formData.caseType.length === 0) {
      newErrors.caseType = 'Please select at least one case type';
    } else if (formData.caseType.length > 3) {
      newErrors.caseType = 'You can select up to 3 case types maximum';
    }
    
    // Subject validation - minimum 10 characters
    if (!formData.subject.trim()) {
      newErrors.subject = 'Case subject is required';
    } else if (formData.subject.trim().length < 10) {
      newErrors.subject = 'Case subject must be at least 10 characters long';
    }
    
    // Message validation - minimum 20 characters
    if (!formData.message.trim()) {
      newErrors.message = 'Case details are required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Please provide more details about your case (minimum 20 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm()) {
      return;
    }
    
    try {
      await submitContactForm(formData as ContactSubmission);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          caseType: [],
          subject: '',
          message: '',
          urgency: 'medium'
        });
        setErrors({});
        resetStatus();
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <section ref={containerRef} className="py-20 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold hierarchy-primary mb-6">
            Submit Your Case
          </h2>
          <p className="text-xl hierarchy-secondary max-w-3xl mx-auto mb-8">
            Have a digital mystery that needs solving? The Armed Detective Agency 
            is ready to take on your most challenging IT, design, and marketing investigations.
          </p>
          
          {/* Dazai Quote */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="italic text-accent text-lg max-w-2xl mx-auto bg-accent/10 p-6 rounded-2xl border border-accent/20"
          >
            "Every case tells a story, and every solution writes a new chapter in the art of problem-solving."
            <div className="text-sm font-semibold mt-2 hierarchy-primary">- Detective Sidney</div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
              errors={errors}
              formData={formData}
              onFormDataChange={setFormData}
            />
          </div>

          {/* Contact Information */}
          <ContactSidebar
            contactInfo={allContactInfo}
            isInView={isInView}
            loading={contactLoading}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSectionRefactored; 