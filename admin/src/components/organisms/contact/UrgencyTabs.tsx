import React from 'react';
import { UrgencyTab } from '../../molecules/contact/UrgencyTab';
import { UrgencyLevel } from '../../atoms/contact/UrgencyBadge';
import './UrgencyTabs.css';

interface UrgencyTabsProps {
  activeTab: UrgencyLevel | 'all';
  onTabChange: (tab: UrgencyLevel | 'all') => void;
  counts: {
    all: number;
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
}

export const UrgencyTabs: React.FC<UrgencyTabsProps> = ({ activeTab, onTabChange, counts }) => {
  return (
    <div className="urgency-tabs-container">
      <button
        className={`urgency-tab all-tab ${activeTab === 'all' ? 'active' : ''}`}
        onClick={() => onTabChange('all')}
      >
        <span className="urgency-tab-label">All</span>
        <span className="urgency-tab-count">{counts.all}</span>
      </button>
      <UrgencyTab
        level="urgent"
        count={counts.urgent}
        isActive={activeTab === 'urgent'}
        onClick={() => onTabChange('urgent')}
      />
      <UrgencyTab
        level="high"
        count={counts.high}
        isActive={activeTab === 'high'}
        onClick={() => onTabChange('high')}
      />
      <UrgencyTab
        level="medium"
        count={counts.medium}
        isActive={activeTab === 'medium'}
        onClick={() => onTabChange('medium')}
      />
      <UrgencyTab
        level="low"
        count={counts.low}
        isActive={activeTab === 'low'}
        onClick={() => onTabChange('low')}
      />
    </div>
  );
};

