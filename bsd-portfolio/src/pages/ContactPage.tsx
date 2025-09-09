import React, { useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { ContactBackground } from '../components/atoms';
import { ContactSectionHeader } from '../components/molecules';
import { ContactForm, ContactSidebar } from '../components/organisms/contact';

interface FormData {
  name: string;
  email: string;
  caseType: string[];
  subject: string;
  message: string;
  urgency: string;
}

const ContactPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    caseType: [],
    subject: '',
    message: '',
    urgency: 'normal'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactInfo = [
    {
      icon: Mail,
      label: 'Detective Email',
      value: 'sidney@detective-agency.dev',
      description: 'Primary communication channel'
    },
    {
      icon: MapPin,
      label: 'Agency Location',
      value: 'Yokohama, Japan',
      description: 'Armed Detective Agency HQ'
    },
    {
      icon: Phone,
      label: 'Emergency Line',
      value: '+81-XX-XXXX-XXXX',
      description: 'For urgent investigations only'
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: '24-48 hours',
      description: 'Standard case response time'
    }
  ];

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
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send the data to your backend here
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          caseType: [],
          subject: '',
          message: '',
          urgency: 'normal'
        });

        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={containerRef} className="py-20 px-6 relative overflow-hidden">
      <ContactBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <ContactSectionHeader isInView={isInView} />

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
            contactInfo={contactInfo}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactPage; 