import { useState, useCallback } from 'react';

export interface ProjectFormData {
  title: string;
  category: string;
  type: string;
  description: string;
  subtitle?: string;
  long_description?: string;
  timeline?: string;
  team?: string;
  role?: string;
  budget?: string;
  client?: string;
  cover_image_url?: string;
  highlight?: string;
  highlight_background_color?: string;
  links: {
    live?: string;
    github?: string;
    documentation?: string;
    case_study?: string;
    demo?: string;
  };
  technologies: Array<{ skill_id: number; level?: string }>;
  images: Array<{ url: string; alt_text?: string; caption: string; type: string; order: number }>;
  features: Array<{ title: string; description: string; icon_key?: string; status: string; impact?: string; order: number }>;
  roadmap: Array<{
    phase: string;
    description: string;
    duration: string;
    status: string;
    deliverables: string[];
    challenges: string[];
    solutions: string[];
    order: number;
  }>;
  stats: Array<{ key: string; value: string; is_list_stat: boolean; order: number }>;
  metrics: Array<{ key: string; value: string; order: number }>;
  testimonials: Array<{ name: string; role: string; company: string; quote: string; rating: number; order: number }>;
  skills: Array<{ skill_id: number; contribution?: string; complexity?: string }>;
}

const initialFormData: ProjectFormData = {
  title: '',
  category: '',
  type: '',
  description: '',
  links: {},
  technologies: [],
  images: [],
  features: [],
  roadmap: [],
  stats: [],
  metrics: [],
  testimonials: [],
  skills: []
};

export const useProjectForm = () => {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleLinksChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [field]: value
      }
    }));
  }, []);

  const addArrayItem = useCallback((arrayName: keyof ProjectFormData, item: any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] as any[]), item]
    }));
  }, []);

  const removeArrayItem = useCallback((arrayName: keyof ProjectFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] as any[]).filter((_, i) => i !== index)
    }));
  }, []);

  const updateArrayItem = useCallback((arrayName: keyof ProjectFormData, index: number, field: string, value: any) => {
    setFormData(prev => {
      const array = [...(prev[arrayName] as any[])];
      array[index] = { ...array[index], [field]: value };
      return {
        ...prev,
        [arrayName]: array
      };
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const loadFormData = useCallback((data: Partial<ProjectFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  return {
    formData,
    handleInputChange,
    handleLinksChange,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    resetForm,
    loadFormData,
    setFormData
  };
};



