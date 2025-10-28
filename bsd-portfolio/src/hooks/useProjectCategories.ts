import { useState, useEffect, useRef } from 'react';
import { useApiBaseUrl } from '../utils/projects';
import { useCacheManager } from '../utils/cache';
import { projectCategoriesManager } from '../utils/projectCategoriesManager';
import { FALLBACK_PROJECT_CATEGORIES } from '../utils/fallbackData';
import { RetryManager } from '../utils/retryManager';

export interface ProjectCategory {
  id: string;
  name: string;
  count: number;
  label: string;
}

export const PROJECT_CATEGORIES_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useProjectCategories(skip: boolean = false) {
  const baseUrl = useApiBaseUrl();
  const cache = useCacheManager();
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (skip) return;

    let isMounted = true;

    const fetchCategories = async () => {
      const API_KEY = 'projectCategories';
      
      try {
        setIsFetching(true);
        setError(null);
        
        // Check if we're in fallback mode - if so, don't try to fetch
        if (RetryManager.isInFallbackMode(API_KEY)) {
          console.log('🔄 Already in fallback mode for project categories, skipping fetch');
          if (isMounted) {
            setCategories(FALLBACK_PROJECT_CATEGORIES);
            setError('Database connection lost - using fallback data');
            setHasFetched(true);
            setIsFetching(false);
          }
          return;
        }
        
        // Initialize the manager if not already done
        if (!isInitializedRef.current) {
          projectCategoriesManager.initialize(cache, baseUrl);
          isInitializedRef.current = true;
        }
        
        // Check if we should retry
        if (!RetryManager.shouldRetry(API_KEY)) {
          console.log('🚫 Max retries reached for project categories, using fallback data');
          if (isMounted) {
            setCategories(FALLBACK_PROJECT_CATEGORIES);
            setError('Database connection lost - using fallback data');
            setHasFetched(true);
            setIsFetching(false);
            // Trigger fallback notification
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('showFallbackNotification'));
            }
          }
          return;
        }
        
        // Use the singleton manager to get categories
        const result = await projectCategoriesManager.getCategories();
        
        if (isMounted) {
          setCategories(result.data);
          setHasFetched(true);
          
          // Only record successful API call if data came from API, not cache
          if (!result.fromCache) {
            RetryManager.recordSuccess(API_KEY);
          }
        }
        
      } catch (err) {
        console.error('❌ Error fetching project categories:', err);
        
        // Record the failure
        RetryManager.recordFailure(API_KEY);
        
        // Check if we should retry after a delay
        if (RetryManager.shouldRetry(API_KEY)) {
          const delay = RetryManager.getRetryDelay(API_KEY);
          console.log(`⏳ Retrying project categories fetch in ${delay}ms...`);
          
          setTimeout(() => {
            if (isMounted) {
              fetchCategories();
            }
          }, delay);
          return;
        }
        
        console.log('🔄 Falling back to cached or default project categories...');
        
        if (isMounted) {
          // Try to get cached data first
          try {
            const cachedCategories = await cache.get<ProjectCategory[]>('projectCategories');
            if (cachedCategories && Array.isArray(cachedCategories) && cachedCategories.length > 0) {
              console.log('📦 Using cached project categories as fallback');
              setCategories(cachedCategories);
              setError(null); // Clear error since we have fallback data
            } else {
              // Use fallback data as last resort
              console.log('🆘 Using fallback project categories');
              setCategories(FALLBACK_PROJECT_CATEGORIES);
              setError('Database connection lost - showing cached data');
              // Trigger fallback notification
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('showFallbackNotification'));
              }
            }
          } catch (cacheError) {
            console.warn('⚠️ Cache fallback failed:', cacheError);
            // Use fallback data as last resort
            console.log('🆘 Using fallback project categories');
            setCategories(FALLBACK_PROJECT_CATEGORIES);
            setError('Database connection lost - showing fallback data');
            // Trigger fallback notification
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('showFallbackNotification'));
            }
          }
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
          setHasFetched(true);
        }
      }
    };

    fetchCategories();
    return () => { isMounted = false; };
  }, [baseUrl, skip, cache]);

  return { 
    categories, 
    isFetching, 
    hasFetched, 
    error 
  } as const;
}