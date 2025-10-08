interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

interface SessionCache {
  projects?: CacheItem<any[]>;
  projectDetails: Map<number, CacheItem<any>>;
  skills?: CacheItem<any[]>;
  skillCategories?: CacheItem<any[]>;
  projectCategories?: CacheItem<any[]>;
  skillsWithProjects?: CacheItem<any[]>;
  sessionId?: string;
  lastCacheVersion?: string;
}

class LocalCacheManager {
  private heapCache: SessionCache = {
    projectDetails: new Map()
  };
  
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly SESSION_TTL = 60 * 60 * 1000; // 1 hour
  private readonly CACHE_VERSION = '1.0.0';
  private sessionId: string | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
    this.initializeSession();
    this.loadFromLocalStorage();
  }

  private initializeSession(): void {
    // Get or create session ID from localStorage
    this.sessionId = localStorage.getItem('portfolio_session_id') || this.generateSessionId();
    localStorage.setItem('portfolio_session_id', this.sessionId);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  private isValidSession(): boolean {
    const currentSessionId = localStorage.getItem('portfolio_session_id');
    if (currentSessionId !== this.sessionId) {
      this.sessionId = currentSessionId;
      this.clearHeapCache();
      return false;
    }
    return true;
  }

  private clearHeapCache(): void {
    this.heapCache = {
      projectDetails: new Map()
    };
  }

  private loadFromLocalStorage(): void {
    try {
      const cached = localStorage.getItem('portfolio_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.sessionId === this.sessionId && parsed.version === this.CACHE_VERSION) {
          // Only load non-expired items
          if (parsed.projects && !this.isExpired(parsed.projects)) {
            this.heapCache.projects = parsed.projects;
          }
          if (parsed.skills && !this.isExpired(parsed.skills)) {
            this.heapCache.skills = parsed.skills;
          }
          if (parsed.skillCategories && !this.isExpired(parsed.skillCategories)) {
            this.heapCache.skillCategories = parsed.skillCategories;
          }
          if (parsed.projectCategories && !this.isExpired(parsed.projectCategories)) {
            this.heapCache.projectCategories = parsed.projectCategories;
          }
          if (parsed.skillsWithProjects && !this.isExpired(parsed.skillsWithProjects)) {
            this.heapCache.skillsWithProjects = parsed.skillsWithProjects;
          }
          // Cache loaded from localStorage silently
        }
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      const cacheData = {
        ...this.heapCache,
        sessionId: this.sessionId,
        version: this.CACHE_VERSION,
        timestamp: Date.now()
      };
      localStorage.setItem('portfolio_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  }

  // Public methods
  async warmCache(): Promise<void> {
    // For browser cache, we don't need to warm from backend
    // The cache will be populated as data is fetched
    // Removed console.log to prevent spam
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    if (!this.isValidSession()) {
      this.clearHeapCache();
      return;
    }

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
      version: this.CACHE_VERSION
    };

    // Set in heap cache
    (this.heapCache as any)[key] = cacheItem;

    // Save to localStorage
    this.saveToLocalStorage();
  }

  async setProjectDetail(projectId: number, data: any, ttl?: number): Promise<void> {
    if (!this.isValidSession()) {
      this.clearHeapCache();
      return;
    }

    const cacheItem: CacheItem<any> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.SESSION_TTL,
      version: this.CACHE_VERSION
    };

    // Set in heap cache
    this.heapCache.projectDetails.set(projectId, cacheItem);

    // Save to localStorage
    this.saveToLocalStorage();
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isValidSession()) {
      this.clearHeapCache();
      return null;
    }

    // Try heap cache first
    const item = (this.heapCache as any)[key];
    if (item && !this.isExpired(item)) {
      return item.data as T;
    }

    return null;
  }

  async getProjectDetail(projectId: number): Promise<any | null> {
    if (!this.isValidSession()) {
      this.clearHeapCache();
      return null;
    }

    // Try heap cache first
    const item = this.heapCache.projectDetails.get(projectId);
    if (item && !this.isExpired(item)) {
      return item.data;
    }

    return null;
  }

  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  async hasProjectDetail(projectId: number): Promise<boolean> {
    const data = await this.getProjectDetail(projectId);
    return data !== null;
  }

  async clear(): Promise<void> {
    this.clearHeapCache();
    localStorage.removeItem('portfolio_cache');
  }

  async clearProjectDetail(projectId: number): Promise<void> {
    this.heapCache.projectDetails.delete(projectId);
    this.saveToLocalStorage();
  }

  async getStats() {
    const heapStats = {
      projects: this.heapCache.projects ? !this.isExpired(this.heapCache.projects) : false,
      skills: this.heapCache.skills ? !this.isExpired(this.heapCache.skills) : false,
      skillCategories: this.heapCache.skillCategories ? !this.isExpired(this.heapCache.skillCategories) : false,
      projectCategories: this.heapCache.projectCategories ? !this.isExpired(this.heapCache.projectCategories) : false,
      projectDetailsCount: this.heapCache.projectDetails.size,
      validProjectDetails: Array.from(this.heapCache.projectDetails.entries())
        .filter(([_, item]) => !this.isExpired(item))
        .length
    };

    return {
      ...heapStats,
      sessionId: this.sessionId
    };
  }

  async invalidateCache(): Promise<void> {
    // Clear all caches
    await this.clear();
  }
}

// Export singleton instance
export const localCacheManager = new LocalCacheManager();
