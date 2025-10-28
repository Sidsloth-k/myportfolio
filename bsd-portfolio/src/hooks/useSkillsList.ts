import { useState, useEffect, useRef } from 'react';
import { useApiBaseUrl } from '../utils/projects';
import { useCacheManager } from '../utils/cache';
import { FALLBACK_SKILLS, FALLBACK_SKILL_CATEGORIES } from '../utils/fallbackData';
import { RetryManager } from '../utils/retryManager';

export interface Skill {
  id: number;
  name: string;
  category: string;
  category_name: string;
  category_color: string;
  category_description: string;
  proficiency_level: number;
  years_experience: string;
  description: string;
  overview: string;
  technologies: string[];
  key_achievements: string[];
  color: string;
  icon_key: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  project_count: number;
  projects?: Array<{
    id: number;
    title: string;
    description: string;
    cover_image_url: string;
    contribution: string;
    complexity: string;
  }>;
}

export interface SkillCategory {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  skills: Skill[];
  skill_count: number;
}

export const SKILLS_TTL_MS = 60 * 60 * 1000; // 1 hour for Redis cache

export function useSkillsList(skip: boolean = false) {
  const baseUrl = useApiBaseUrl();
  const cache = useCacheManager();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchAtRef = useRef<number>(0);

  useEffect(() => {
    if (skip) return;

    let isMounted = true;

    const fetchSkills = async () => {
      const API_KEY = 'skills';
      
      try {
        setIsFetching(true);
        setError(null);
        
        const t0 = performance.now();
        
        // Check if we're in fallback mode - if so, don't try to fetch
        if (RetryManager.isInFallbackMode(API_KEY)) {
          console.log('🔄 Already in fallback mode for skills, skipping fetch');
          if (isMounted) {
            setSkills(FALLBACK_SKILLS);
            setCategories(FALLBACK_SKILL_CATEGORIES);
            setError('Database connection lost - using fallback data');
            setHasFetched(true);
            setIsFetching(false);
          }
          return;
        }
        
        // Check cache first (Redis + heap fallback)
        const cachedSkills = await cache.get<Skill[]>('skills');
        const cachedCategories = await cache.get<SkillCategory[]>('skillCategories');
        
        if (cachedSkills && cachedCategories && cachedSkills.length > 0) {
          if (isMounted) {
            setSkills(cachedSkills);
            setCategories(cachedCategories);
            setHasFetched(true);
            console.log('📦 Skills loaded from cache');
            // Don't reset retry count for cache hits - only for actual API calls
          }
          return;
        }

        // Check if we have recent data to avoid unnecessary fetches
        const now = Date.now();
        if (lastFetchAtRef.current > 0 && now - lastFetchAtRef.current < SKILLS_TTL_MS) {
          return;
        }

        // Check if we should retry
        if (!RetryManager.shouldRetry(API_KEY)) {
          console.log('🚫 Max retries reached for skills, using fallback data');
          if (isMounted) {
            setSkills(FALLBACK_SKILLS);
            setCategories(FALLBACK_SKILL_CATEGORIES);
            setError('Database connection lost - using fallback data');
            setHasFetched(true);
            setIsFetching(false);
            // Trigger fallback notification
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('showFallbackNotification'));
            }
          }
          return;
        }

        // Fetch from backend
        console.log('🌐 Fetching skills from backend...');
        const res = await fetch(`${baseUrl}/api/skills`, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error || 'Failed to fetch skills');
        }
        
        const categoriesData: SkillCategory[] = Array.isArray(json.data) ? json.data : [];
        const allSkills: Skill[] = categoriesData.flatMap(category => category.skills || []);
        
        if (isMounted) {
          setCategories(categoriesData);
          setSkills(allSkills);
          lastFetchAtRef.current = Date.now();
          
          // Cache the results (Redis + heap)
          await cache.set('skills', allSkills, SKILLS_TTL_MS);
          await cache.set('skillCategories', categoriesData, SKILLS_TTL_MS);
          console.log('💾 Skills cached successfully');
          
          // Record successful fetch
          RetryManager.recordSuccess(API_KEY);
        }
        
        const duration = Math.max(0, performance.now() - t0);
        console.log(`✅ Skills fetched in ${duration.toFixed(2)}ms`);
        
      } catch (err) {
        console.error('❌ Error fetching skills:', err);
        
        // Record the failure
        RetryManager.recordFailure(API_KEY);
        
        // Check if we should retry after a delay
        if (RetryManager.shouldRetry(API_KEY)) {
          const delay = RetryManager.getRetryDelay(API_KEY);
          console.log(`⏳ Retrying skills fetch in ${delay}ms...`);
          
          setTimeout(() => {
            if (isMounted) {
              fetchSkills();
            }
          }, delay);
          return;
        }
        
        console.log('🔄 Falling back to cached or default skills...');
        
        if (isMounted) {
          // Try to get cached data first
          try {
            const cachedSkills = await cache.get<Skill[]>('skills');
            const cachedCategories = await cache.get<SkillCategory[]>('skillCategories');
            
            if (cachedSkills && cachedCategories && cachedSkills.length > 0) {
              console.log('📦 Using cached skills as fallback');
              setSkills(cachedSkills);
              setCategories(cachedCategories);
              setError(null); // Clear error since we have fallback data
            } else {
              // Use fallback data as last resort
              console.log('🆘 Using fallback skills data');
              setSkills(FALLBACK_SKILLS);
              setCategories(FALLBACK_SKILL_CATEGORIES);
              setError('Database connection lost - showing cached data');
              // Trigger fallback notification
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('showFallbackNotification'));
              }
            }
          } catch (cacheError) {
            console.warn('⚠️ Cache fallback failed:', cacheError);
            // Use fallback data as last resort
            console.log('🆘 Using fallback skills data');
            setSkills(FALLBACK_SKILLS);
            setCategories(FALLBACK_SKILL_CATEGORIES);
            setError('Database connection lost - showing fallback data');
            // Trigger fallback notification
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('showFallbackNotification'));
            }
          }
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
          setHasFetched(true);
        }
      }
    };

    fetchSkills();
    return () => { isMounted = false; };
  }, [baseUrl, skip, cache]);

  return { 
    skills, 
    categories, 
    isFetching, 
    hasFetched, 
    error 
  } as const;
}

export function useSkillsWithProjects(skip: boolean = false) {
  const baseUrl = useApiBaseUrl();
  const cache = useCacheManager();
  const [skillsWithProjects, setSkillsWithProjects] = useState<Skill[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchAtRef = useRef<number>(0);

  useEffect(() => {
    if (skip) return;

    let isMounted = true;

    const fetchSkillsWithProjects = async () => {
      try {
        setIsFetching(true);
        setError(null);
        
        const t0 = performance.now();
        
        // Check cache first (Redis + heap fallback)
        const cachedSkills = await cache.get<Skill[]>('skillsWithProjects');
        if (cachedSkills && cachedSkills.length > 0) {
          if (isMounted) {
            setSkillsWithProjects(cachedSkills);
            setHasFetched(true);
            console.log('📦 Skills with projects loaded from cache');
          }
          return;
        }

        // Check if we have recent data to avoid unnecessary fetches
        const now = Date.now();
        if (lastFetchAtRef.current > 0 && now - lastFetchAtRef.current < SKILLS_TTL_MS) {
          return;
        }

        // Fetch from backend
        console.log('🌐 Fetching skills with projects from backend...');
        const res = await fetch(`${baseUrl}/api/skills/with-projects`, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error || 'Failed to fetch skills with projects');
        }
        
        const skillsData: Skill[] = Array.isArray(json.data) ? json.data : [];
        
        if (isMounted) {
          setSkillsWithProjects(skillsData);
          lastFetchAtRef.current = Date.now();
          
          // Cache the results (Redis + heap)
          await cache.set('skillsWithProjects', skillsData, SKILLS_TTL_MS);
          console.log('💾 Skills with projects cached successfully');
        }
        
        const duration = Math.max(0, performance.now() - t0);
        console.log(`✅ Skills with projects fetched in ${duration.toFixed(2)}ms`);
        
      } catch (err) {
        console.error('❌ Error fetching skills with projects:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch skills with projects');
          setSkillsWithProjects([]);
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
          setHasFetched(true);
        }
      }
    };

    fetchSkillsWithProjects();
    return () => { isMounted = false; };
  }, [baseUrl, skip, cache]);

  return { 
    skillsWithProjects, 
    isFetching, 
    hasFetched, 
    error 
  } as const;
}
