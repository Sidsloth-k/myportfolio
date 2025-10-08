import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { UiProject, mapBackendProjectToUi, useApiBaseUrl } from '../utils/projects';
import { useCacheManager } from '../utils/cache';

export const DETAIL_TTL_MS = 10 * 60 * 1000;

export function useProjectDetailCache() {
  const baseUrl = useApiBaseUrl();
  const cache = useCacheManager();
  const [projectDetailCache, setProjectDetailCache] = useState<Record<number, UiProject | any>>({});
  const inFlightDetailPromisesRef = useRef<Partial<Record<number, Promise<UiProject | null>>>>({});
  const lastDetailFetchMsRef = useRef<number>(0);
  const projectDetailCacheRef = useRef<Record<number, UiProject | any>>({});

  // Keep ref in sync with state (only needed for initial state)
  useEffect(() => {
    projectDetailCacheRef.current = projectDetailCache;
  }, [projectDetailCache]);

  const fetchProjectDetail = useCallback(async (idNum: number) => {
    // Check cache first
    const cached = await cache.getProjectDetail(idNum);
    if (cached) {
      // Update ref for consistency, but don't update state to avoid re-renders
      projectDetailCacheRef.current = { ...projectDetailCacheRef.current, [idNum]: cached };
      return cached as UiProject;
    }

    // Check local cache as fallback
    const localCached = projectDetailCacheRef.current[idNum];
    const cachedAtKey = `__at_${idNum}`;
    const cachedAt = (projectDetailCacheRef.current as any)[cachedAtKey] as number | undefined;
    if (localCached && cachedAt && Date.now() - cachedAt < DETAIL_TTL_MS) {
      return localCached as UiProject;
    }

    const inflight = inFlightDetailPromisesRef.current[idNum];
    if (inflight) return inflight;

    const promise = (async () => {
      try {
        const t0 = performance.now();
        const res = await fetch(`${baseUrl}/api/projects/${idNum}`, { credentials: 'include' });
        const json = await res.json();
        const data = json?.data ? mapBackendProjectToUi(json.data) : null;
        if (data) {
          // Cache in both systems
          cache.setProjectDetail(idNum, data, DETAIL_TTL_MS);
          const newCache = { ...projectDetailCacheRef.current, [idNum]: data, [`__at_${idNum}`]: Date.now() } as any;
          // Update ref only, don't update state to avoid re-renders
          projectDetailCacheRef.current = newCache;
        }
        lastDetailFetchMsRef.current = Math.max(0, performance.now() - t0);
        return data;
      } catch (error) {
        console.error('Error fetching project detail:', error);
        lastDetailFetchMsRef.current = 0;
        return null;
      } finally {
        delete inFlightDetailPromisesRef.current[idNum];
      }
    })();
    inFlightDetailPromisesRef.current[idNum] = promise;
    return promise;
  }, [baseUrl, cache]);

  return { projectDetailCache, setProjectDetailCache, fetchProjectDetail, lastDetailFetchMsRef, projectDetailCacheRef } as const;
}


