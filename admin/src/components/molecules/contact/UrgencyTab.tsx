import React from 'react';
import { UrgencyLevel } from '../../atoms/contact/UrgencyBadge';
import './UrgencyTab.css';

interface UrgencyTabProps {
  level: UrgencyLevel;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const urgencyConfig = {
  urgent: {
    label: 'Emergency',
    icon: '🚨',
    description: 'Critical investigation needed',
    color: '#ef4444'
  },
  high: {
    label: 'High Priority',
    icon: '⚡',
    description: 'Needs quick attention',
    color: '#f97316'
  },
  medium: {
    label: 'Normal',
    icon: '📋',
    description: 'Standard response time',
    color: '#3b82f6'
  },
  low: {
    label: 'Low Priority',
    icon: '📌',
    description: 'Can wait a few days',
    color: '#22c55e'
  }
};

export const UrgencyTab: React.FC<UrgencyTabProps> = ({ level, count, isActive, onClick }) => {
  const config = urgencyConfig[level];

  return (
    <button
      className={`urgency-tab ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        borderBottomColor: isActive ? config.color : 'transparent'
      }}
    >
      <span className="urgency-tab-icon">{config.icon}</span>
      <span className="urgency-tab-label">{config.label}</span>
      <span className="urgency-tab-count">{count}</span>
    </button>
  );
};

