import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import AppContent from './AppContent';
import NotFoundPage from './NotFoundPage';

// ScrollToTop component to ensure pages load from the top
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Router: React.FC = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ScrollToTop />
      <Routes>
          {/* Main portfolio routes */}
          <Route path="/" element={<AppContent />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AppContent />} />
          <Route path="/skills" element={<AppContent />} />
          <Route path="/projects" element={<AppContent />} />
          <Route path="/projects/:encryptedId" element={<AppContent />} />
          <Route path="/contact" element={<AppContent />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
  );
};

export default Router;