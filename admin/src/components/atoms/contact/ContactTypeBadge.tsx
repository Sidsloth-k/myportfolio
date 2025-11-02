import React from 'react';

export type ContactType = 'email' | 'phone' | 'whatsapp' | 'location';

interface ContactTypeBadgeProps {
  type: ContactType;
  className?: string;
}

const typeConfig = {
  email: {
    label: 'Email',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    textColor: '#3b82f6',
    borderColor: '#60a5fa',
    icon: 'bx-envelope'
  },
  phone: {
    label: 'Phone',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    textColor: '#22c55e',
    borderColor: '#4ade80',
    icon: 'bx-phone'
  },
  whatsapp: {
    label: 'WhatsApp',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    textColor: '#25d366',
    borderColor: '#25d366',
    icon: 'bx-message'
  },
  location: {
    label: 'Location',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    textColor: '#f97316',
    borderColor: '#fb923c',
    icon: 'bx-map'
  }
};

export const ContactTypeBadge: React.FC<ContactTypeBadgeProps> = ({ type, className = '' }) => {
  const config = typeConfig[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${className}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`
      }}
    >
      <i className={`bx ${config.icon}`}></i>
      {config.label}
    </span>
  );
};

