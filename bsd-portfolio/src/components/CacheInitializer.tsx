import React, { useEffect } from 'react';
import { useCacheManager } from '../utils/cache';
import { useApiBaseUrl } from '../utils/projects';
import { projectCategoriesManager } from '../utils/projectCategoriesManager';
import { useContactInfo } from '../hooks/useContactInfo';

interface CacheInitializerProps {
  children: React.ReactNode;
}

export default function CacheInitializer({ children }: CacheInitializerProps) {
  const cache = useCacheManager();
  const baseUrl = useApiBaseUrl();
  const { refetch: refetchContactInfo } = useContactInfo();

  useEffect(() => {
    const initializeCache = async () => {
      try {
        // Initialize local cache (no backend calls needed)
        await cache.warmCache();
        
        // Initialize project categories manager
        projectCategoriesManager.initialize(cache, baseUrl);
        
        // Pre-fetch project categories in background
        projectCategoriesManager.preFetch();
        
        // Pre-fetch contact information in background
        refetchContactInfo();
        
        console.log('✅ Cache system initialized in background');
      } catch (error) {
        console.error('❌ Cache initialization failed:', error);
        // Don't block the UI - cache initialization is optional
      }
    };

    // Run initialization in background without blocking UI
    initializeCache();
  }, [cache, baseUrl, refetchContactInfo]);

  // Always render children immediately - cache initialization runs in background
  return <>{children}</>;
}