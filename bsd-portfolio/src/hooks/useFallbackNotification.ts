import { useState, useEffect, useCallback } from 'react';
import React from 'react';

interface UseFallbackNotificationReturn {
  showNotification: boolean;
  showFallbackNotification: () => void;
  hideFallbackNotification: () => void;
  FallbackNotificationComponent: React.ComponentType<{
    isVisible: boolean;
    onDismiss: () => void;
    autoHide?: boolean;
    autoHideDelay?: number;
  }>;
}

export function useFallbackNotification(): UseFallbackNotificationReturn {
  const [showNotification, setShowNotification] = useState(false);

  const showFallbackNotification = useCallback(() => {
    setShowNotification(true);
  }, []);

  const hideFallbackNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  // Auto-hide notification after 8 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Dynamically import the component to avoid circular dependencies
  const FallbackNotificationComponent = React.lazy(() => 
    import('../components/atoms/FallbackNotification').then(module => ({
      default: module.default
    }))
  );

  return {
    showNotification,
    showFallbackNotification,
    hideFallbackNotification,
    FallbackNotificationComponent
  };
}

// Alternative simpler version without lazy loading
export function useFallbackNotificationSimple(): {
  showNotification: boolean;
  showFallbackNotification: () => void;
  hideFallbackNotification: () => void;
} {
  const [showNotification, setShowNotification] = useState(false);

  const showFallbackNotification = useCallback(() => {
    setShowNotification(true);
  }, []);

  const hideFallbackNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  // Auto-hide notification after 8 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return {
    showNotification,
    showFallbackNotification,
    hideFallbackNotification
  };
}
