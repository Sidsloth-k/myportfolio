import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ContactFormInputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  validationMessage?: string;
  isFieldValid?: boolean;
}

const ContactFormInput: React.FC<ContactFormInputProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  label,
  icon: Icon,
  error,
  validationMessage,
  isFieldValid
}) => {
  return (
    <div>
      <Label htmlFor={id} className="flex items-center space-x-2 mb-2">
        <Icon className="w-5 h-5 text-accent" />
        <span className="font-bold text-lg">{label} {required && '*'}</span>
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`transition-colors ${error ? 'border-destructive' : 'border-border focus:border-accent'}`}
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
      </div>
    </div>
  );
};

export default ContactFormInput; 