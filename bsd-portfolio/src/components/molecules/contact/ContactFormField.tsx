import React from 'react';
import { Label } from '../../ui/label';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ContactFormFieldProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
  error?: string;
  validationMessage?: string;
  isFieldValid?: boolean;
  children: React.ReactNode;
  additionalInfo?: string;
}

const ContactFormField: React.FC<ContactFormFieldProps> = ({
  label,
  icon: Icon,
  required = false,
  error,
  validationMessage,
  isFieldValid,
  children,
  additionalInfo
}) => {
  return (
    <div>
      <Label className="flex items-center space-x-2 mb-3">
        <Icon className="w-5 h-5 text-accent" />
        <span className="font-bold text-lg">{label} {required && '*'}</span>
        {additionalInfo && (
          <span className="text-sm hierarchy-tertiary ml-2">
            {additionalInfo}
          </span>
        )}
      </Label>
      {children}
      <div className="flex justify-between items-center mt-2">
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-sm flex items-center"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </motion.p>
        ) : (
          <span className={`text-sm ${isFieldValid ? 'text-green-600 font-medium' : 'hierarchy-tertiary'}`}>
            {validationMessage}
          </span>
        )}
      </div>
    </div>
  );
};

export default ContactFormField; 