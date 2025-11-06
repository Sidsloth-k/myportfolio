import { useState, useEffect } from 'react';
import apiService from '../../../services/api';

const STORAGE_KEYS = {
  imageTypes: 'admin_image_types'
};

const DEFAULT_IMAGE_TYPES = ['screenshot', 'mobile', 'design', 'other'];

export const useLocalTypes = () => {
  // Project types are ONLY fetched from database, no local storage
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [isRefetchingTypes, setIsRefetchingTypes] = useState(false);

  const [imageTypes, setImageTypes] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.imageTypes);
    return stored ? JSON.parse(stored) : DEFAULT_IMAGE_TYPES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.imageTypes, JSON.stringify(imageTypes));
  }, [imageTypes]);

  // Refetch project types from database
  const refetchProjectTypes = async () => {
    setIsRefetchingTypes(true);
    try {
      const response = await apiService.getProjectTypes();
      if (response.success && response.data) {
        // Backend returns array of objects with { id, name, count }
        // Extract just the name strings
        const typeNames: string[] = Array.isArray(response.data)
          ? response.data.map((t: any) => {
              if (typeof t === 'string') return t;
              if (t && typeof t === 'object') return t.name || t.type || null;
              return null;
            }).filter((name: any): name is string => typeof name === 'string')
          : [];
        const sortedTypes = Array.from(new Set(typeNames)).sort((a: string, b: string) => a.localeCompare(b));
        setProjectTypes(sortedTypes);
      }
    } catch (error) {
      console.error('Failed to refetch project types:', error);
    } finally {
      setIsRefetchingTypes(false);
    }
  };

  // Create a new project type in database and refetch
  const addProjectType = async (name: string): Promise<void> => {
    if (!name || !name.trim()) {
      return;
    }

    try {
      const response = await apiService.createProjectType(name.trim());
      if (response.success) {
        // Refetch types from database to get the updated list
        await refetchProjectTypes();
      } else {
        throw new Error(response.error || 'Failed to create project type');
      }
    } catch (error: any) {
      console.error('Failed to create project type:', error);
      throw error;
    }
  };

  const addImageType = (type: string) => {
    const trimmed = type.trim();
    if (trimmed && !imageTypes.includes(trimmed)) {
      setImageTypes(prev => [...prev, trimmed]);
    }
  };

  // Set project types directly from database (replaces any existing types)
  // Accepts either array of strings or array of objects with name property
  const mergeServerProjectTypes = (serverTypes: any[]) => {
    if (!Array.isArray(serverTypes)) return;
    
    // Extract type names - handle both string arrays and object arrays
    const typeNames = serverTypes
      .map((t: any) => {
        if (typeof t === 'string') return t;
        if (t && typeof t === 'object') return t.name || t.type || null;
        return null;
      })
      .filter(Boolean);
    
    // Sort and deduplicate
    const sortedTypes = Array.from(new Set(typeNames)).sort((a, b) => a.localeCompare(b));
    setProjectTypes(sortedTypes);
  };

  return {
    projectTypes,
    imageTypes,
    addProjectType,
    addImageType,
    mergeServerProjectTypes,
    refetchProjectTypes,
    isRefetchingTypes,
    setProjectTypes
  };
};

