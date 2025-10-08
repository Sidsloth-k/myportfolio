import { useApiBaseUrl } from './projects';
import { useCacheManager } from './cache';

interface ProjectCategory {
  id: string;
  name: string;
  count: number;
  label: string;
}

class ProjectCategoriesManager {
  private static instance: ProjectCategoriesManager;
  private cache: any;
  private baseUrl: string = '';
  private isFetching: boolean = false;
  private fetchPromise: Promise<ProjectCategory[]> | null = null;
  private readonly TTL_MS = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    // This will be initialized when first used
  }

  public static getInstance(): ProjectCategoriesManager {
    if (!ProjectCategoriesManager.instance) {
      ProjectCategoriesManager.instance = new ProjectCategoriesManager();
    }
    return ProjectCategoriesManager.instance;
  }

  public initialize(cache: any, baseUrl: string) {
    this.cache = cache;
    this.baseUrl = baseUrl;
  }

  public async getCategories(): Promise<ProjectCategory[]> {
    // If already fetching, return the existing promise
    if (this.isFetching && this.fetchPromise) {
      return this.fetchPromise;
    }

    // Check cache first
    const cachedCategories = await this.cache.get('projectCategories') as ProjectCategory[];
    if (cachedCategories && cachedCategories.length > 0) {
      return cachedCategories;
    }

    // Start fetching if not already in progress
    if (!this.isFetching) {
      this.isFetching = true;
      this.fetchPromise = this.fetchCategoriesFromAPI();
    }

    return this.fetchPromise!;
  }

  private async fetchCategoriesFromAPI(): Promise<ProjectCategory[]> {
    try {
      console.log('🌐 Fetching project categories from API...');
      const t0 = performance.now();
      
      const res = await fetch(`${this.baseUrl}/api/projects/categories`, { 
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
        throw new Error(json.error || 'Failed to fetch project categories');
      }
      
      const categoriesData: ProjectCategory[] = Array.isArray(json.data) ? json.data : [];
      
      // Cache the results
      await this.cache.set('projectCategories', categoriesData, this.TTL_MS);
      
      const duration = Math.max(0, performance.now() - t0);
      console.log(`✅ Project categories fetched in ${duration.toFixed(2)}ms`);
      
      return categoriesData;
    } catch (error) {
      console.error('❌ Error fetching project categories:', error);
      throw error;
    } finally {
      this.isFetching = false;
      this.fetchPromise = null;
    }
  }

  public async preFetch(): Promise<void> {
    try {
      // Check if we already have cached categories
      const cachedCategories = await this.cache.get('projectCategories');
      if (cachedCategories && cachedCategories.length > 0) {
        console.log('📦 Project categories already cached');
        return;
      }

      // Start background fetch
      this.getCategories();
    } catch (error) {
      console.warn('⚠️ Failed to pre-fetch project categories:', error);
    }
  }
}

export const projectCategoriesManager = ProjectCategoriesManager.getInstance();
