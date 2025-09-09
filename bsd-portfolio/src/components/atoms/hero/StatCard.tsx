import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="text-center p-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl">
      <div className="text-3xl font-bold hierarchy-primary mb-1">{value}</div>
      <div className="text-sm hierarchy-tertiary">{label}</div>
    </div>
  );
};

export default StatCard;