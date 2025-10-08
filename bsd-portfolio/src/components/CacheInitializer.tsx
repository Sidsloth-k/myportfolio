import React, { useEffect } from 'react';
import { useCacheManager } from '../utils/cache';
import { useApiBaseUrl } from '../utils/projects';
import { projectCategoriesManager } from '../utils/projectCategoriesManager';

interface CacheInitializerProps {
  children: React.ReactNode;
}

export default function CacheInitializer({ children }: CacheInitializerProps) {
  const cache = useCacheManager();
  const baseUrl = useApiBaseUrl();

  useEffect(() => {
    const initializeCache = async () => {
      try {
        // Initialize local cache (no backend calls needed)
        await cache.warmCache();
        
        // Initialize project categories manager
        projectCategoriesManager.initialize(cache, baseUrl);
        
        // Pre-fetch project categories in background
        projectCategoriesManager.preFetch();
        
        console.log('✅ Cache system initialized in background');
      } catch (error) {
        console.warn('⚠️ Cache initialization failed (non-blocking):', error);
        // Don't block the UI - cache initialization is optional
      }
    };

    // Run initialization in background without blocking UI
    initializeCache();
  }, [cache, baseUrl]);

  // Always render children immediately - cache initialization runs in background
  return <>{children}</>;
}