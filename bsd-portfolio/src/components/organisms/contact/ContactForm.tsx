import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { MessageSquare, User, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { ContactFormInput, ContactFormTextarea } from '../../atoms';
import { CaseTypeSelector, UrgencyLevelSelector } from '../../molecules';

interface FormData {
  name: string;
  email: string;
  caseType: string[];
  subject: string;
  message: string;
  urgency: string;
}

interface ContactFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  errors: Record<string, string>;
  formData: FormData;
  onFormDataChange: (formData: FormData) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  isSubmitting,
  submitStatus,
  errors,
  formData,
  onFormDataChange
}) => {
  const caseTypes = [
    { id: 'web-development', label: 'Web Development Mystery', icon: '💻' },
    { id: 'ui-ux-design', label: 'UI/UX Design Challenge', icon: '🎨' },
    { id: 'marketing-strategy', label: 'Marketing Strategy Case', icon: '📈' },
    { id: 'full-stack-project', label: 'Full-Stack Investigation', icon: '🔧' },
    { id: 'consultation', label: 'Detective Consultation', icon: '🕵️' },
    { id: 'other', label: 'Other Mystery', icon: '❓' }
  ];

  const urgencyLevels = [
    { id: 'low', label: 'Low Priority', color: 'text-green-600', description: 'Can wait a few days' },
    { id: 'normal', label: 'Normal', color: 'text-blue-600', description: 'Standard response time' },
    { id: 'high', label: 'High Priority', color: 'text-orange-600', description: 'Needs quick attention' },
    { id: 'urgent', label: 'Emergency', color: 'text-red-600', description: 'Critical investigation needed' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormDataChange({
      ...formData,
      [name]: value
    });
  };

  const handleCaseTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const newCaseType = checked
      ? [...formData.caseType, value]
      : formData.caseType.filter(id => id !== value);
    
    onFormDataChange({
      ...formData,
      caseType: newCaseType
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const isFormValid = () => {
    return (
      formData.name.trim().split(' ').length >= 2 &&
      formData.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.caseType.length > 0 &&
      formData.subject.trim() !== '' &&
      formData.subject.trim().length >= 10 &&
      formData.message.trim() !== '' &&
      formData.message.trim().length >= 20
    );
  };

  return (
    <Card className="p-8 anime-shadow hover:anime-glow transition-all duration-300">
      <h3 className="text-3xl font-extrabold hierarchy-primary mb-6 flex items-center">
        <MessageSquare className="w-7 h-7 mr-3 text-accent" />
        Case Details Form
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6" key="contact-form">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ContactFormInput
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name"
            autoComplete="name"
            required
            label="Detective Name"
            icon={User}
            error={errors.name}
            validationMessage={formData.name.trim().split(' ').length >= 2 ? '✓ Full name provided' : 'Please enter your full name'}
            isFieldValid={formData.name.trim().split(' ').length >= 2}
          />

          <ContactFormInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            autoComplete="email"
            required
            label="Contact Email"
            icon={Mail}
            error={errors.email}
            validationMessage={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? '✓ Valid email format' : 'Please enter a valid email address'}
            isFieldValid={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
          />
        </div>

        {/* Case Type */}
        <CaseTypeSelector
          caseTypes={caseTypes}
          selectedCaseTypes={formData.caseType}
          onCaseTypeChange={handleCaseTypeChange}
          error={errors.caseType}
          validationMessage={formData.caseType.length > 0 ? `✓ ${formData.caseType.length} case type${formData.caseType.length > 1 ? 's' : ''} selected` : 'Please select at least one case type'}
          isFieldValid={formData.caseType.length > 0}
        />

        {/* Subject */}
        <ContactFormInput
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="Brief description of your case"
          autoComplete="off"
          required
          label="Case Subject"
          icon={MessageSquare}
          error={errors.subject}
          validationMessage={formData.subject.length >= 10 ? '✓ Minimum characters met' : 'Minimum 10 characters required'}
          isFieldValid={formData.subject.length >= 10}
        />

        {/* Urgency Level */}
        <UrgencyLevelSelector
          urgencyLevels={urgencyLevels}
          selectedUrgency={formData.urgency}
          onUrgencyChange={handleInputChange}
        />

        {/* Message */}
        <ContactFormTextarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Provide detailed information about your case, including requirements, timeline, and any specific challenges you're facing..."
          rows={6}
          autoComplete="off"
          required
          label="Case Details"
          icon={MessageSquare}
          error={errors.message}
          validationMessage={formData.message.length >= 20 ? '✓ Minimum characters met' : 'Minimum 20 characters required'}
          isFieldValid={formData.message.length >= 20}
          characterCount={formData.message.length}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid()}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
          {isSubmitting ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Send className="w-5 h-5" />
              </motion.div>
              <span>Submitting Case...</span>
            </motion.div>
          ) : submitStatus === 'success' ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center space-x-2 text-green-600"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Case Submitted Successfully!</span>
            </motion.div>
          ) : submitStatus === 'error' ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center space-x-2 text-red-600"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Submission Failed - Try Again</span>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Send className="w-6 h-6" />
              <span className="font-bold text-lg">Submit Case to Detective Agency</span>
            </div>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default ContactForm; 