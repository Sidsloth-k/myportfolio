import { useState, useEffect } from 'react';

const STORAGE_KEY = 'admin_project_categories';

export interface CategoryOption {
  id: string;
  name: string;
}

const DEFAULT_CATEGORIES: string[] = [];

export const useLocalCategories = () => {
  const [categories, setCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed]);
    }
  };

  const mergeServerCategories = (serverCategories: Array<{ id: string; name: string }>) => {
    const serverNames = (serverCategories || []).map(c => c.name).filter(Boolean);
    const merged = Array.from(new Set([...categories, ...serverNames])).sort((a, b) => a.localeCompare(b));
    setCategories(merged);
  };

  const asOptions = (): CategoryOption[] => categories.map(name => ({ id: name, name }));

  return {
    categories,
    addCategory,
    mergeServerCategories,
    asOptions,
    setCategories,
  };
};



