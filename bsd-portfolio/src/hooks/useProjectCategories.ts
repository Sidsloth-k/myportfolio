import { useState, useEffect, useRef } from 'react';
import { useApiBaseUrl } from '../utils/projects';
import { useCacheManager } from '../utils/cache';
import { projectCategoriesManager } from '../utils/projectCategoriesManager';

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
      try {
        setIsFetching(true);
        setError(null);
        
        // Initialize the manager if not already done
        if (!isInitializedRef.current) {
          projectCategoriesManager.initialize(cache, baseUrl);
          isInitializedRef.current = true;
        }
        
        // Use the singleton manager to get categories
        const categoriesData = await projectCategoriesManager.getCategories();
        
        if (isMounted) {
          setCategories(categoriesData);
          setHasFetched(true);
        }
        
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