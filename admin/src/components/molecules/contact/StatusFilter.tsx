import React from 'react';
import { ContactStatus } from '../../atoms/contact/StatusBadge';
import './StatusFilter.css';

interface StatusFilterProps {
  activeStatus: ContactStatus | 'all';
  onStatusChange: (status: ContactStatus | 'all') => void;
  counts: {
    all: number;
    new: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
}

interface StatusConfigItem {
  label: string;
  icon: string;
  description: string;
  color?: string;
}

const statusConfig: Record<string, StatusConfigItem> = {
  all: {
    label: 'All Status',
    icon: 'bx-filter',
    description: 'Show all contacts'
  },
  new: {
    label: 'New',
    icon: 'bx-circle',
    description: 'New submissions',
    color: '#3b82f6'
  },
  in_progress: {
    label: 'In Progress',
    icon: 'bx-time-five',
    description: 'Being processed',
    color: '#f97316'
  },
  resolved: {
    label: 'Resolved',
    icon: 'bx-check-circle',
    description: 'Resolved contacts',
    color: '#22c55e'
  },
  closed: {
    label: 'Closed',
    icon: 'bx-x-circle',
    description: 'Closed contacts',
    color: '#6b7280'
  }
};

export const StatusFilter: React.FC<StatusFilterProps> = ({ activeStatus, onStatusChange, counts }) => {
  return (
    <div className="status-filter-container">
      <div className="status-filter-label">
        <i className="bx bx-filter-alt"></i>
        <span>Filter by Status</span>
      </div>
      <div className="status-filter-buttons">
        {(['all', 'new', 'in_progress', 'resolved', 'closed'] as const).map((status) => {
          const config = statusConfig[status];
          const isActive = activeStatus === status;
          
          return (
            <button
              key={status}
              className={`status-filter-btn ${isActive ? 'active' : ''}`}
              onClick={() => onStatusChange(status)}
              title={config.description}
              style={isActive && config.color ? { borderColor: config.color } : {}}
            >
              <i className={`bx ${config.icon}`} style={isActive && config.color ? { color: config.color } : {}}></i>
              <span className="status-filter-label-text">{config.label}</span>
              <span className="status-filter-count">{counts[status]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

