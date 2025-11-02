import React from 'react';

interface ActiveStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export const ActiveStatusBadge: React.FC<ActiveStatusBadgeProps> = ({ isActive, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${className}`}
      style={{
        backgroundColor: isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(107, 114, 128, 0.15)',
        color: isActive ? '#22c55e' : '#6b7280',
        border: `1px solid ${isActive ? '#4ade80' : '#9ca3af'}`
      }}
    >
      <i className={`bx ${isActive ? 'bx-check-circle' : 'bx-x-circle'}`}></i>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

