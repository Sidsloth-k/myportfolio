import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { ContactProvider } from './contexts/ContactContext';
import Router from './components/Router';
import FallbackNotification from './components/atoms/FallbackNotification';

export default function App() {
  const [showFallbackNotification, setShowFallbackNotification] = useState(false);

  useEffect(() => {
    const handleFallbackNotification = () => {
      setShowFallbackNotification(true);
    };

    // Listen for fallback notification events
    window.addEventListener('showFallbackNotification', handleFallbackNotification);

    return () => {
      window.removeEventListener('showFallbackNotification', handleFallbackNotification);
    };
  }, []);

  return (
    <ThemeProvider>
      <ContactProvider>
        <Router />
        <FallbackNotification
          isVisible={showFallbackNotification}
          onDismiss={() => setShowFallbackNotification(false)}
          autoHide={true}
          autoHideDelay={8000}
        />
      </ContactProvider>
    </ThemeProvider>
  );
}