const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.redis = null;
    this.isConnected = false;
    this.memoryCache = new Map(); // In-memory cache fallback
    this.initializeRedis();
  }

  async initializeRedis() {
    // Only try to connect to Redis if explicitly configured
    if (!process.env.REDIS_HOST && !process.env.REDIS_URL) {
      console.log('ℹ️  Redis not configured, using in-memory cache');
      this.isConnected = false;
      this.redis = null;
      return;
    }

    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
        retryDelayOnFailover: 5000,
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        connectTimeout: 5000,
        commandTimeout: 3000,
        enableOfflineQueue: false,
        retryDelayOnClusterDown: 10000,
        retryDelayOnFailover: 10000,
      };

      this.redis = new Redis(redisConfig);
      
      this.redis.on('connect', () => {
        console.log('✅ Backend Redis connected');
        this.isConnected = true;
      });

      this.redis.on('error', (error) => {
        // Only log the first error, then silence subsequent ones
        if (!this.errorLogged) {
          console.log('ℹ️  Redis connection failed, using in-memory cache');
          this.errorLogged = true;
        }
        this.isConnected = false;
      });

      this.redis.on('close', () => {
        this.isConnected = false;
      });

      // Test the connection with a timeout
      const pingPromise = this.redis.ping();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis connection timeout')), 3000)
      );
      
      await Promise.race([pingPromise, timeoutPromise]);
      console.log('✅ Backend Redis ping successful');
    } catch (error) {
      console.log('ℹ️  Redis not available, using in-memory cache');
      this.isConnected = false;
      this.redis = null;
    }
  }

  async invalidateCache(pattern = '*') {
    if (!this.isConnected || !this.redis) {
      // Silently return false when Redis is not available
      return false;
    }

    try {
      const keys = await this.redis.keys(`portfolio:${pattern}`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        console.log(`🗑️ Invalidated ${keys.length} cache keys matching pattern: ${pattern}`);
      }
      return true;
    } catch (error) {
      // Silently handle cache errors
      return false;
    }
  }

  async invalidateProjectsCache() {
    return await this.invalidateCache('projects*');
  }

  async invalidateSkillsCache() {
    return await this.invalidateCache('skills*');
  }

  async invalidateProjectDetailCache(projectId) {
    return await this.invalidateCache(`project:${projectId}`);
  }

  async invalidateAllCache() {
    if (this.isConnected && this.redis) {
      return await this.invalidateCache('*');
    } else {
      // Clear in-memory cache when Redis is not available
      this.memoryCache.clear();
      console.log('🗑️ Cleared in-memory cache');
      return true;
    }
  }

  // In-memory cache methods
  setMemoryCache(key, value, ttl = 300000) { // 5 minutes default TTL
    const item = {
      value,
      expires: Date.now() + ttl
    };
    this.memoryCache.set(key, item);
  }

  getMemoryCache(key) {
    const item = this.memoryCache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clearMemoryCache() {
    this.memoryCache.clear();
    console.log('🗑️ Cleared in-memory cache');
  }

  async setCacheVersion(version) {
    if (!this.isConnected || !this.redis) {
      return false;
    }

    try {
      await this.redis.set('portfolio:cache_version', version, 'EX', 7 * 24 * 60 * 60); // 7 days
      return true;
    } catch (error) {
      console.error('❌ Set cache version error:', error);
      return false;
    }
  }

  async getCacheVersion() {
    if (!this.isConnected || !this.redis) {
      return null;
    }

    try {
      return await this.redis.get('portfolio:cache_version');
    } catch (error) {
      console.error('❌ Get cache version error:', error);
      return null;
    }
  }

  isHealthy() {
    return this.isConnected && this.redis !== null;
  }

  get redisClient() {
    return this.redis;
  }

  async disconnect() {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
      this.isConnected = false;
    }
  }
}

module.exports = new CacheService();
