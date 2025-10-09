import React, { useEffect, useRef } from 'react';
import { useCacheManager } from '../utils/cache';
import { useApiBaseUrl } from '../utils/projects';
import { projectCategoriesManager } from '../utils/projectCategoriesManager';
import { useContactInfo } from '../hooks/useContactInfo';

// Global flag to prevent multiple cache initializations
let globalCacheInitialized = false;

interface CacheInitializerProps {
  children: React.ReactNode;
}

export default function CacheInitializer({ children }: CacheInitializerProps) {
  const cache = useCacheManager();
  const baseUrl = useApiBaseUrl();
  const { refetch: refetchContactInfo } = useContactInfo();
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations (both local and global)
    if (initialized.current || globalCacheInitialized) {
      return;
    }

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
        initialized.current = true;
        globalCacheInitialized = true;
      } catch (error) {
        console.error('❌ Cache initialization failed:', error);
        // Don't block the UI - cache initialization is optional
      }
    };

    // Run initialization in background without blocking UI
    initializeCache();
  }, [cache, baseUrl]); // Removed refetchContactInfo from dependencies

  // Always render children immediately - cache initialization runs in background
  return <>{children}</>;
}