import React from 'react';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ContactFormTextareaProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  autoComplete?: string;
  required?: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  validationMessage?: string;
  isFieldValid?: boolean;
  characterCount?: number;
  minCharacters?: number;
}

const ContactFormTextarea: React.FC<ContactFormTextareaProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 6,
  autoComplete,
  required = false,
  label,
  icon: Icon,
  error,
  validationMessage,
  isFieldValid,
  characterCount,
  minCharacters
}) => {
  return (
    <div>
      <Label htmlFor={id} className="flex items-center space-x-2 mb-2">
        <Icon className="w-5 h-5 text-accent" />
        <span className="font-bold text-lg">{label} {required && '*'}</span>
      </Label>
      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        autoComplete={autoComplete}
        className={`transition-colors resize-none ${error ? 'border-destructive' : 'border-border focus:border-accent'}`}
        required={required}
      />
      <div className="flex justify-between items-center mt-1">
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
        {characterCount !== undefined && (
          <span className={`text-sm ${isFieldValid ? 'text-green-600 font-medium' : 'hierarchy-tertiary'}`}>
            {characterCount} characters
          </span>
        )}
      </div>
    </div>
  );
};

export default ContactFormTextarea; 