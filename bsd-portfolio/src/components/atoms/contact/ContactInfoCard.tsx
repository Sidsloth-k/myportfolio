import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../ui/card';

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  values?: string[]; // Support multiple values
  description: string;
  contact_type?: string; // email, phone, whatsapp, location
}

interface ContactInfoCardProps {
  info: ContactInfo;
  index: number;
  isInView: boolean;
}

const renderContactValue = (value: string, contactType?: string) => {
  // Check if the value already contains specifications in parentheses
  const hasSpecification = value.includes('(') && value.includes(')');
  
  if (hasSpecification) {
    // Extract the phone number and specification
    const match = value.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      const [, phoneNumber, specification] = match;
      const cleanPhoneNumber = phoneNumber.trim();
      
      // Determine the contact type based on specification
      let url = null;
      if (specification.toLowerCase().includes('call')) {
        url = `tel:${cleanPhoneNumber}`;
      } else if (specification.toLowerCase().includes('whatsapp')) {
        url = `https://wa.me/${cleanPhoneNumber.replace(/[^\d]/g, '')}`;
      }
      
      if (url) {
        return (
          <a
            href={url}
            target={specification.toLowerCase().includes('call') ? '_self' : '_blank'}
            rel={specification.toLowerCase().includes('call') ? '' : 'noopener noreferrer'}
            className="hierarchy-primary font-medium hover:text-accent transition-colors duration-200 inline-block"
          >
            {cleanPhoneNumber} <span className="text-xs text-accent/70">({specification})</span>
          </a>
        );
      }
    }
  }

  // Fallback to original logic for values without specifications
  const getContactTag = (type?: string) => {
    switch (type) {
      case 'email':
        return '(Email)';
      case 'phone':
        return '(Call)';
      case 'whatsapp':
        return '(WhatsApp)';
      case 'location':
        return '(Location)';
      default:
        return '';
    }
  };

  const getContactUrl = (value: string, type?: string) => {
    switch (type) {
      case 'email':
        return `mailto:${value}`;
      case 'phone':
        return `tel:${value}`;
      case 'whatsapp':
        return `https://wa.me/${value.replace(/[^\d]/g, '')}`;
      case 'location':
        return `https://maps.google.com/?q=${encodeURIComponent(value)}`;
      default:
        return null;
    }
  };

  const url = getContactUrl(value, contactType);
  const tag = getContactTag(contactType);

  if (url) {
    return (
      <a
        href={url}
        target={contactType === 'email' || contactType === 'phone' ? '_self' : '_blank'}
        rel={contactType === 'email' || contactType === 'phone' ? '' : 'noopener noreferrer'}
        className="hierarchy-primary font-medium hover:text-accent transition-colors duration-200 inline-block"
      >
        {value} <span className="text-xs text-accent/70">{tag}</span>
      </a>
    );
  }

  return (
    <p className="hierarchy-primary font-medium">
      {value} <span className="text-xs text-accent/70">{tag}</span>
    </p>
  );
};

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
            {info.values && info.values.length > 1 ? (
              <div className="mb-1 space-y-1">
                {info.values.map((value, idx) => (
                  <div key={idx}>
                    {renderContactValue(value, info.contact_type)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-1">
                {renderContactValue(info.value, info.contact_type)}
              </div>
            )}
            <p className="text-sm hierarchy-tertiary">{info.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContactInfoCard; 