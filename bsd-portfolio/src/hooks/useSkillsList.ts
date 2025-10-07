import { useState, useEffect, useRef } from 'react';
import { useApiBaseUrl } from '../utils/projects';

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

export const SKILLS_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useSkillsList(skip: boolean = false) {
  const baseUrl = useApiBaseUrl();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchAtRef = useRef<number>(0);

  useEffect(() => {
    if (skip) return;

    let isMounted = true;
    const now = Date.now();
    
    // Check if we have recent data
    if (hasFetched && now - lastFetchAtRef.current < SKILLS_TTL_MS) {
      return () => { isMounted = false; };
    }

    const fetchSkills = async () => {
      try {
        setIsFetching(true);
        setError(null);
        
        const t0 = performance.now();
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
        }
        
        const duration = Math.max(0, performance.now() - t0);
        console.log(`✅ Skills fetched in ${duration.toFixed(2)}ms`);
        
      } catch (err) {
        console.error('❌ Error fetching skills:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch skills');
          setCategories([]);
          setSkills([]);
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
  }, [baseUrl, skip, hasFetched]);

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
  const [skillsWithProjects, setSkillsWithProjects] = useState<Skill[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchAtRef = useRef<number>(0);

  useEffect(() => {
    if (skip) return;

    let isMounted = true;
    const now = Date.now();
    
    // Check if we have recent data
    if (hasFetched && now - lastFetchAtRef.current < SKILLS_TTL_MS) {
      return () => { isMounted = false; };
    }

    const fetchSkillsWithProjects = async () => {
      try {
        setIsFetching(true);
        setError(null);
        
        const t0 = performance.now();
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
  }, [baseUrl, skip, hasFetched]);

  return { 
    skillsWithProjects, 
    isFetching, 
    hasFetched, 
    error 
  } as const;
}
