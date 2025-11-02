import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  projectTypes: 'admin_project_types',
  imageTypes: 'admin_image_types'
};

const DEFAULT_PROJECT_TYPES = [
  'SaaS Platform',
  'Web Application',
  'Mobile Application',
  'Desktop Application',
  'Data Science Project',
  'AI/ML Project',
  'Design System',
  'Full-Stack Application',
  'Backend System',
  'Frontend Application'
];

const DEFAULT_IMAGE_TYPES = ['screenshot', 'mobile', 'design', 'other'];

export const useLocalTypes = () => {
  const [projectTypes, setProjectTypes] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.projectTypes);
    return stored ? JSON.parse(stored) : DEFAULT_PROJECT_TYPES;
  });

  const [imageTypes, setImageTypes] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.imageTypes);
    return stored ? JSON.parse(stored) : DEFAULT_IMAGE_TYPES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.projectTypes, JSON.stringify(projectTypes));
  }, [projectTypes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.imageTypes, JSON.stringify(imageTypes));
  }, [imageTypes]);

  const addProjectType = (type: string) => {
    const trimmed = type.trim();
    if (trimmed && !projectTypes.includes(trimmed)) {
      setProjectTypes(prev => [...prev, trimmed]);
    }
  };

  const addImageType = (type: string) => {
    const trimmed = type.trim();
    if (trimmed && !imageTypes.includes(trimmed)) {
      setImageTypes(prev => [...prev, trimmed]);
    }
  };

  return {
    projectTypes,
    imageTypes,
    addProjectType,
    addImageType
  };
};

