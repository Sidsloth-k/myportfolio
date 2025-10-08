import { useState, useEffect, useRef } from 'react';
import { useApiBaseUrl } from '../utils/projects';
import { useCacheManager } from '../utils/cache';

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
  const lastFetchAtRef = useRef<number>(0);

  useEffect(() => {
    if (skip) return;

    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setIsFetching(true);
        setError(null);
        
        // Check cache first
        const cachedCategories = await cache.get<ProjectCategory[]>('projectCategories');
        if (cachedCategories && cachedCategories.length > 0) {
          if (isMounted) {
            setCategories(cachedCategories);
            setHasFetched(true);
          }
          return;
        }

        const now = Date.now();
        
        // Check if we have recent data using ref instead of state
        if (lastFetchAtRef.current > 0 && now - lastFetchAtRef.current < PROJECT_CATEGORIES_TTL_MS) {
          return;
        }
        
        const t0 = performance.now();
        const res = await fetch(`${baseUrl}/api/projects/categories`, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error || 'Failed to fetch project categories');
        }
        
        const categoriesData: ProjectCategory[] = Array.isArray(json.data) ? json.data : [];
        
        if (isMounted) {
          setCategories(categoriesData);
          lastFetchAtRef.current = Date.now();
          // Cache the results
          await cache.set('projectCategories', categoriesData, PROJECT_CATEGORIES_TTL_MS);
        }
        
        const duration = Math.max(0, performance.now() - t0);
        console.log(`✅ Project categories fetched in ${duration.toFixed(2)}ms`);
        
      } catch (err) {
        console.error('❌ Error fetching project categories:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch project categories');
          setCategories([]);
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