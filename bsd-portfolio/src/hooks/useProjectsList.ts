import { useEffect, useMemo, useRef, useState } from 'react';
import { UiProject, mapBackendProjectToUi, useApiBaseUrl } from '../utils/projects';
import { useCacheManager } from '../utils/cache';
import { FALLBACK_PROJECTS } from '../utils/fallbackData';
import { RetryManager } from '../utils/retryManager';

export const PROJECTS_TTL_MS = 30 * 60 * 1000; // 30 minutes for Redis cache

export function useProjectsList(skip: boolean) {
  const baseUrl = useApiBaseUrl();
  const cache = useCacheManager();
  const [projects, setProjects] = useState<UiProject[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialFetchMs, setInitialFetchMs] = useState<number>(2500);
  const lastProjectsFetchAtRef = useRef<number>(0);

  useEffect(() => {
    if (skip) return;

    let isMounted = true;

    const fetchProjects = async () => {
      const API_KEY = 'projects';
      
      try {
        setIsFetching(true);
        const t0 = performance.now();
        
        // Check if we're in fallback mode - if so, don't try to fetch
        if (RetryManager.isInFallbackMode(API_KEY)) {
          console.log('🔄 Already in fallback mode for projects, skipping fetch');
          if (isMounted) {
            setProjects(FALLBACK_PROJECTS);
            setError('Database connection lost - using fallback data');
            setHasFetched(true);
            setIsFetching(false);
          }
          return;
        }
        
        // Check cache first (Redis + heap fallback)
        const cachedProjects = await cache.get<UiProject[]>('projects');
        if (cachedProjects && cachedProjects.length > 0) {
          if (isMounted) {
            setProjects(cachedProjects);
            setHasFetched(true);
            setInitialFetchMs(0); // No fetch time for cached data
            console.log('📦 Projects loaded from cache');
            // Don't reset retry count for cache hits - only for actual API calls
          }
          return;
        }

        // Check if we have recent data to avoid unnecessary fetches
        const now = Date.now();
        if (lastProjectsFetchAtRef.current > 0 && now - lastProjectsFetchAtRef.current < PROJECTS_TTL_MS) {
          return;
        }

        // Check if we should retry
        if (!RetryManager.shouldRetry(API_KEY)) {
          console.log('🚫 Max retries reached for projects, using fallback data');
          if (isMounted) {
            setProjects(FALLBACK_PROJECTS);
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

        // Fetch from backend
        console.log('🌐 Fetching projects from backend...');
        const res = await fetch(`${baseUrl}/api/projects`, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        const list: any[] = Array.isArray(json?.data) ? json.data : [];
        const mapped = list.map(mapBackendProjectToUi).filter(p => p && Number.isFinite(p.id));
        const uniqueById = Array.from(new Map(mapped.map(p => [p.id, p])).values());
        
        if (isMounted) {
          setProjects(uniqueById);
          lastProjectsFetchAtRef.current = Date.now();
          
          // Cache the results (Redis + heap)
          await cache.set('projects', uniqueById, PROJECTS_TTL_MS);
          console.log('💾 Projects cached successfully');
          
          // Record successful fetch
          RetryManager.recordSuccess(API_KEY);
        }
        
        const duration = Math.max(0, performance.now() - t0);
        if (isMounted) setInitialFetchMs(duration);
        console.log(`✅ Projects fetched in ${duration.toFixed(2)}ms`);
        
      } catch (err) {
        console.error('❌ Error fetching projects:', err);
        
        // Record the failure
        RetryManager.recordFailure(API_KEY);
        
        // Check if we should retry after a delay
        if (RetryManager.shouldRetry(API_KEY)) {
          const delay = RetryManager.getRetryDelay(API_KEY);
          console.log(`⏳ Retrying projects fetch in ${delay}ms...`);
          
          setTimeout(() => {
            if (isMounted) {
              fetchProjects();
            }
          }, delay);
          return;
        }
        
        console.log('🔄 Falling back to cached or default projects...');
        
        if (isMounted) {
          // Try to get cached data first
          try {
            const cachedProjects = await cache.get<UiProject[]>('projects');
            
            if (cachedProjects && cachedProjects.length > 0) {
              console.log('📦 Using cached projects as fallback');
              setProjects(cachedProjects);
              setError(null); // Clear error since we have fallback data
            } else {
              // Use fallback data as last resort
              console.log('🆘 Using fallback projects data');
              setProjects(FALLBACK_PROJECTS);
              setError('Database connection lost - showing cached data');
              // Trigger fallback notification
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('showFallbackNotification'));
              }
            }
          } catch (cacheError) {
            console.warn('⚠️ Cache fallback failed:', cacheError);
            // Use fallback data as last resort
            console.log('🆘 Using fallback projects data');
            setProjects(FALLBACK_PROJECTS);
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

    fetchProjects();
    return () => { isMounted = false; };
  }, [baseUrl, skip, cache]);

  return { projects, isFetching, hasFetched, error, initialFetchMs } as const;
}


