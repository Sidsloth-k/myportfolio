import React, { useEffect, useState } from 'react';
import { useCacheManager } from '../utils/cache';

interface CacheInitializerProps {
  children: React.ReactNode;
}

export default function CacheInitializer({ children }: CacheInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const cache = useCacheManager();

  useEffect(() => {
    const initializeCache = async () => {
      try {
        // Initialize local cache (no backend calls needed)
        await cache.warmCache();
        setIsInitialized(true);
      } catch (error) {
        console.error('❌ Cache initialization failed:', error);
        setInitializationError(error instanceof Error ? error.message : 'Unknown error');
        // Still allow the app to work
        setIsInitialized(true);
      }
    };

    initializeCache();
  }, [cache]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing cache system...</p>
          {initializationError && (
            <p className="text-yellow-400 text-sm mt-2">
              Warning: {initializationError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}