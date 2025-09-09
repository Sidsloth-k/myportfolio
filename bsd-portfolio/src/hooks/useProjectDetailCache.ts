import { useMemo, useRef, useState } from 'react';
import { UiProject, mapBackendProjectToUi, useApiBaseUrl } from '../utils/projects';

export const DETAIL_TTL_MS = 10 * 60 * 1000;

export function useProjectDetailCache() {
  const baseUrl = useApiBaseUrl();
  const [projectDetailCache, setProjectDetailCache] = useState<Record<number, UiProject | any>>({});
  const inFlightDetailPromisesRef = useRef<Partial<Record<number, Promise<UiProject | null>>>>({});
  const lastDetailFetchMsRef = useRef<number>(0);

  const fetchProjectDetail = async (idNum: number) => {
    const cached = projectDetailCache[idNum];
    const cachedAtKey = `__at_${idNum}`;
    const cachedAt = (projectDetailCache as any)[cachedAtKey] as number | undefined;
    if (cached && cachedAt && Date.now() - cachedAt < DETAIL_TTL_MS) return cached as UiProject;

    const inflight = inFlightDetailPromisesRef.current[idNum];
    if (inflight) return inflight;

    const promise = (async () => {
      try {
        const t0 = performance.now();
        const res = await fetch(`${baseUrl}/api/projects/${idNum}`, { credentials: 'include' });
        const json = await res.json();
        const data = json?.data ? mapBackendProjectToUi(json.data) : null;
        if (data) {
          setProjectDetailCache(prev => ({ ...prev, [idNum]: data, [`__at_${idNum}`]: Date.now() } as any));
        }
        lastDetailFetchMsRef.current = Math.max(0, performance.now() - t0);
        return data;
      } catch {
        lastDetailFetchMsRef.current = 0;
        return null;
      } finally {
        delete inFlightDetailPromisesRef.current[idNum];
      }
    })();
    inFlightDetailPromisesRef.current[idNum] = promise;
    return promise;
  };

  return { projectDetailCache, setProjectDetailCache, fetchProjectDetail, lastDetailFetchMsRef } as const;
}


