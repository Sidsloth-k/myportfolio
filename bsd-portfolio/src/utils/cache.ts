// Import the local cache manager
import { localCacheManager } from './localCache';

// Re-export as the main cache manager
export { localCacheManager as cacheManager };

// Helper hooks for React components
export const useCacheManager = () => {
  return {
    set: localCacheManager.set.bind(localCacheManager),
    get: localCacheManager.get.bind(localCacheManager),
    setProjectDetail: localCacheManager.setProjectDetail.bind(localCacheManager),
    getProjectDetail: localCacheManager.getProjectDetail.bind(localCacheManager),
    has: localCacheManager.has.bind(localCacheManager),
    hasProjectDetail: localCacheManager.hasProjectDetail.bind(localCacheManager),
    clear: localCacheManager.clear.bind(localCacheManager),
    getStats: localCacheManager.getStats.bind(localCacheManager),
    warmCache: localCacheManager.warmCache.bind(localCacheManager),
    invalidateCache: localCacheManager.invalidateCache.bind(localCacheManager)
  };
};
