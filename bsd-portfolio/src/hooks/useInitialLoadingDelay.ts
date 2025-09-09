import { useEffect, useState } from 'react';

export function useInitialLoadingDelay(hasFetched: boolean, initialFetchMs: number) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minimumDurationMs = 1200;
    const extraAnimationBufferMs = 400;
    const targetDuration = Math.max(minimumDurationMs, Math.min(6000, initialFetchMs + extraAnimationBufferMs));

    let timeoutId: any;
    if (hasFetched) {
      timeoutId = setTimeout(() => setIsLoading(false), targetDuration);
    }
    return () => clearTimeout(timeoutId);
  }, [hasFetched, initialFetchMs]);

  return { isLoading, setIsLoading } as const;
}


