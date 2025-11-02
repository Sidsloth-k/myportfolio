import React from 'react';

export type UrgencyLevel = 'urgent' | 'high' | 'medium' | 'low';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  className?: string;
}

const urgencyConfig = {
  urgent: {
    label: 'Emergency',
    bgColor: 'rgba(220, 38, 38, 0.15)',
    textColor: '#ef4444',
    borderColor: '#dc2626',
    description: 'Critical investigation needed'
  },
  high: {
    label: 'High Priority',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    textColor: '#f97316',
    borderColor: '#fb923c',
    description: 'Needs quick attention'
  },
  medium: {
    label: 'Normal',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    textColor: '#3b82f6',
    borderColor: '#60a5fa',
    description: 'Standard response time'
  },
  low: {
    label: 'Low Priority',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    textColor: '#22c55e',
    borderColor: '#4ade80',
    description: 'Can wait a few days'
  }
};

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level, className = '' }) => {
  const config = urgencyConfig[level];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${className}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`
      }}
      title={config.description}
    >
      {config.label}
    </span>
  );
};

