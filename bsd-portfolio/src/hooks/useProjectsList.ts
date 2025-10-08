import { useEffect, useMemo, useRef, useState } from 'react';
import { UiProject, mapBackendProjectToUi, useApiBaseUrl } from '../utils/projects';
import { useCacheManager } from '../utils/cache';

export const PROJECTS_TTL_MS = 30 * 60 * 1000; // 30 minutes for Redis cache

export function useProjectsList(skip: boolean) {
  const baseUrl = useApiBaseUrl();
  const cache = useCacheManager();
  const [projects, setProjects] = useState<UiProject[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [initialFetchMs, setInitialFetchMs] = useState<number>(2500);
  const lastProjectsFetchAtRef = useRef<number>(0);

  useEffect(() => {
    if (skip) return;

    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setIsFetching(true);
        const t0 = performance.now();
        
        // Check cache first (Redis + heap fallback)
        const cachedProjects = await cache.get<UiProject[]>('projects');
        if (cachedProjects && cachedProjects.length > 0) {
          if (isMounted) {
            setProjects(cachedProjects);
            setHasFetched(true);
            setInitialFetchMs(0); // No fetch time for cached data
            console.log('📦 Projects loaded from cache');
          }
          return;
        }

        // Check if we have recent data to avoid unnecessary fetches
        const now = Date.now();
        if (lastProjectsFetchAtRef.current > 0 && now - lastProjectsFetchAtRef.current < PROJECTS_TTL_MS) {
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
        }
        
        const duration = Math.max(0, performance.now() - t0);
        if (isMounted) setInitialFetchMs(duration);
        console.log(`✅ Projects fetched in ${duration.toFixed(2)}ms`);
        
      } catch (err) {
        console.error('❌ Error fetching projects:', err);
        if (isMounted) setProjects([]);
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

  return { projects, isFetching, hasFetched, initialFetchMs } as const;
}


