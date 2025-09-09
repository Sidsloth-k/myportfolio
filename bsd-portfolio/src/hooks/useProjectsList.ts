import { useEffect, useMemo, useRef, useState } from 'react';
import { UiProject, mapBackendProjectToUi, useApiBaseUrl } from '../utils/projects';

export const PROJECTS_TTL_MS = 5 * 60 * 1000;

export function useProjectsList(skip: boolean) {
  const baseUrl = useApiBaseUrl();
  const [projects, setProjects] = useState<UiProject[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [initialFetchMs, setInitialFetchMs] = useState<number>(2500);
  const lastProjectsFetchAtRef = useRef<number>(0);

  useEffect(() => {
    if (skip) return;

    let isMounted = true;
    const now = Date.now();
    if (hasFetched && now - lastProjectsFetchAtRef.current < PROJECTS_TTL_MS) {
      return () => { isMounted = false; };
    }

    const fetchProjects = async () => {
      try {
        setIsFetching(true);
        const t0 = performance.now();
        const res = await fetch(`${baseUrl}/api/projects`, { credentials: 'include' });
        const json = await res.json();
        const list: any[] = Array.isArray(json?.data) ? json.data : [];
        const mapped = list.map(mapBackendProjectToUi).filter(p => p && Number.isFinite(p.id));
        const uniqueById = Array.from(new Map(mapped.map(p => [p.id, p])).values());
        if (isMounted) {
          setProjects(uniqueById);
          lastProjectsFetchAtRef.current = Date.now();
        }
        const duration = Math.max(0, performance.now() - t0);
        if (isMounted) setInitialFetchMs(duration);
      } catch (err) {
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
  }, [baseUrl, skip, hasFetched]);

  return { projects, isFetching, hasFetched, initialFetchMs } as const;
}


