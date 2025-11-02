import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.full_name || user?.username || 'User';

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h1 className="welcome-title">Dashboard</h1>
        <p className="welcome-message">Welcome {displayName}</p>
      </div>
    </div>
  );
};

export default DashboardPage;



