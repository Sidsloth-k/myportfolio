import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import ContentManager from './ContentManager';
import MediaManager from './MediaManager';
import ProjectManager from './ProjectManager';
import AnalyticsManager from './AnalyticsManager';
import SettingsManager from './SettingsManager';
import ThemeCustomizer from './ThemeCustomizer';
import AdminSidebar from './AdminSidebar';

const AdminRouter: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('admin_authenticated');
      const authTime = localStorage.getItem('admin_auth_time');
      
      if (authToken && authTime) {
        const authDate = new Date(authTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - authDate.getTime()) / (1000 * 60 * 60);
        
        // Auto-logout after 24 hours
        if (hoursDiff < 24) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_auth_time');
          setIsAuthenticated(false);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_auth_time', new Date().toISOString());
      setIsAuthenticated(true);
      navigate('/admin/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_auth_time');
    setIsAuthenticated(false);
    navigate('/admin');
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return (
      <motion.div
        key="login"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AdminLogin onLogin={handleLogin} />
      </motion.div>
    );
  }

  // Authenticated admin area
  return (
    <motion.div
      key="admin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
        <div className="flex">
          {/* Admin Sidebar */}
          <AdminSidebar onLogout={handleLogout} onClose={() => {}} />
          
          {/* Main Content */}
          <div className="flex-1 ml-64">
            <main className="min-h-screen">
              <Routes>
                {/* Default redirect to dashboard */}
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                
                {/* Admin pages */}
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/content" element={<ContentManager />} />
                <Route path="/media" element={<MediaManager />} />
                <Route path="/projects" element={<ProjectManager />} />
                <Route path="/analytics" element={<AnalyticsManager />} />
                <Route path="/settings" element={<SettingsManager />} />
                <Route path="/theme" element={<ThemeCustomizer />} />
                
                {/* Catch all - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </motion.div>
    );
  };

export default AdminRouter;