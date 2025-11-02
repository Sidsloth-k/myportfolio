import React from 'react';

export type ContactStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

interface StatusBadgeProps {
  status: ContactStatus;
  className?: string;
}

const statusConfig = {
  new: {
    label: 'New',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    textColor: '#3b82f6',
    borderColor: '#60a5fa'
  },
  in_progress: {
    label: 'In Progress',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    textColor: '#f97316',
    borderColor: '#fb923c'
  },
  resolved: {
    label: 'Resolved',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    textColor: '#22c55e',
    borderColor: '#4ade80'
  },
  closed: {
    label: 'Closed',
    bgColor: 'rgba(107, 114, 128, 0.15)',
    textColor: '#6b7280',
    borderColor: '#9ca3af'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${className}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`
      }}
    >
      {config.label}
    </span>
  );
};

