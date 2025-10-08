const express = require('express');
const router = express.Router();
const cacheService = require('../services/CacheService');
const { auth } = require('../auth/middleware');

// Public cache clear endpoint (no auth required)
router.post('/clear', async (req, res) => {
  try {
    const success = await cacheService.invalidateAllCache();
    
    if (success) {
      res.json({
        success: true,
        message: 'All cache cleared successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to clear cache'
      });
    }
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Invalidate all cache (requires auth)
router.post('/invalidate', auth, async (req, res) => {
  try {
    const success = await cacheService.invalidateAllCache();
    
    if (success) {
      res.json({
        success: true,
        message: 'All cache invalidated successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to invalidate cache'
      });
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Invalidate projects cache
router.post('/invalidate/projects', auth, async (req, res) => {
  try {
    const success = await cacheService.invalidateProjectsCache();
    
    if (success) {
      res.json({
        success: true,
        message: 'Projects cache invalidated successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to invalidate projects cache'
      });
    }
  } catch (error) {
    console.error('Projects cache invalidation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Invalidate skills cache
router.post('/invalidate/skills', auth, async (req, res) => {
  try {
    const success = await cacheService.invalidateSkillsCache();
    
    if (success) {
      res.json({
        success: true,
        message: 'Skills cache invalidated successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to invalidate skills cache'
      });
    }
  } catch (error) {
    console.error('Skills cache invalidation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Invalidate specific project cache
router.post('/invalidate/project/:id', auth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const success = await cacheService.invalidateProjectDetailCache(projectId);
    
    if (success) {
      res.json({
        success: true,
        message: `Project ${projectId} cache invalidated successfully`,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to invalidate project cache'
      });
    }
  } catch (error) {
    console.error('Project cache invalidation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get cache status
router.get('/status', auth, async (req, res) => {
  try {
    const isHealthy = cacheService.isHealthy();
    const version = await cacheService.getCacheVersion();
    
    res.json({
      success: true,
      data: {
        redisConnected: isHealthy,
        cacheVersion: version,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Cache status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get cache value
router.post('/get', async (req, res) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({
        success: false,
        error: 'Key is required'
      });
    }

    const redisKey = `portfolio:${key}`;
    const data = await cacheService.redisClient.get(redisKey);
    
    if (!data) {
      return res.json({
        success: true,
        data: null
      });
    }

    const parsed = JSON.parse(data);
    res.json({
      success: true,
      data: parsed.data
    });
  } catch (error) {
    console.error('Cache GET error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Set cache value
router.post('/set', async (req, res) => {
  try {
    const { key, data, ttl } = req.body;
    
    if (!key || data === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Key and data are required'
      });
    }

    const redisKey = `portfolio:${key}`;
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl: ttl || 5 * 60 * 1000, // 5 minutes default
      version: '1.0.0'
    };

    const success = await cacheService.redisClient.set(redisKey, JSON.stringify(cacheItem), Math.ceil(ttl / 1000));
    
    res.json({
      success: success,
      message: success ? 'Cache set successfully' : 'Failed to set cache'
    });
  } catch (error) {
    console.error('Cache SET error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update cache version
router.post('/version', auth, async (req, res) => {
  try {
    const { version } = req.body;
    const success = await cacheService.setCacheVersion(version || Date.now().toString());
    
    if (success) {
      res.json({
        success: true,
        message: 'Cache version updated successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to update cache version'
      });
    }
  } catch (error) {
    console.error('Cache version update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
