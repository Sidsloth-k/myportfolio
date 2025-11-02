// Cache utility for storing auth state
const AUTH_CACHE_KEY = 'admin_auth_cache';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

export interface CachedUser {
  user: {
    id: number;
    username: string;
    full_name?: string;
    email?: string;
    role: string;
  };
  timestamp: number;
}

export const cacheService = {
  // Save user to cache
  setUser: (user: CachedUser['user']) => {
    try {
      const cacheData: CachedUser = {
        user,
        timestamp: Date.now(),
      };
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache user:', error);
    }
  },

  // Get user from cache
  getUser: (): CachedUser['user'] | null => {
    try {
      const cached = localStorage.getItem(AUTH_CACHE_KEY);
      if (!cached) return null;

      const cacheData: CachedUser = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is expired
      if (now - cacheData.timestamp > CACHE_EXPIRY_TIME) {
        localStorage.removeItem(AUTH_CACHE_KEY);
        return null;
      }

      return cacheData.user;
    } catch (error) {
      console.error('Failed to get cached user:', error);
      return null;
    }
  },

  // Clear cache
  clearUser: () => {
    try {
      localStorage.removeItem(AUTH_CACHE_KEY);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  },

  // Check if cache is valid
  isCacheValid: (): boolean => {
    try {
      const cached = localStorage.getItem(AUTH_CACHE_KEY);
      if (!cached) return false;

      const cacheData: CachedUser = JSON.parse(cached);
      const now = Date.now();

      return now - cacheData.timestamp <= CACHE_EXPIRY_TIME;
    } catch (error) {
      return false;
    }
  },
};



