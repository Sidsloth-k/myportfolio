export const PROJECT_CATEGORIES = [
    { id: 'all', label: 'All Categories' },
    { id: 'it', label: 'IT Development' },
    { id: 'ux', label: 'UI/UX Design' },
    { id: 'marketing', label: 'Marketing' }
  ];
  
  export const PROJECT_STATUSES = [
    { id: 'all', label: 'All Status' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Draft' },
    { id: 'archived', label: 'Archived' }
  ];
  
  export const CONTENT_SECTIONS = [
    { id: 'hero', label: 'Hero Section', count: 4 },
    { id: 'about', label: 'About Page', count: 6 },
    { id: 'skills', label: 'Skills', count: 8 },
    { id: 'testimonials', label: 'Testimonials', count: 5 },
    { id: 'navigation', label: 'Navigation', count: 5 }
  ];
  
  export const MEDIA_CATEGORIES = [
    { id: 'all', label: 'All Media', count: 24 },
    { id: 'images', label: 'Images', count: 18 },
    { id: 'videos', label: 'Videos', count: 3 },
    { id: 'documents', label: 'Documents', count: 3 }
  ];
  
  export const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100 border-green-300 dark:bg-green-950/20';
      case 'draft': return 'text-yellow-600 bg-yellow-100 border-yellow-300 dark:bg-yellow-950/20';
      case 'archived': return 'text-gray-600 bg-gray-100 border-gray-300 dark:bg-gray-950/20';
      default: return 'text-gray-600 bg-gray-100 border-gray-300 dark:bg-gray-950/20';
    }
  };
  
  export const getCategoryColor = (category: string) => {
    switch (category) {
      case 'it': return 'text-blue-600 bg-blue-100 border-blue-300 dark:bg-blue-950/20';
      case 'ux': return 'text-pink-600 bg-pink-100 border-pink-300 dark:bg-pink-950/20';
      case 'marketing': return 'text-green-600 bg-green-100 border-green-300 dark:bg-green-950/20';
      default: return 'text-gray-600 bg-gray-100 border-gray-300 dark:bg-gray-950/20';
    }
  };
  
  export const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'text-blue-600 bg-blue-100 border-blue-300 dark:bg-blue-950/20';
      case 'video': return 'text-purple-600 bg-purple-100 border-purple-300 dark:bg-purple-950/20';
      case 'document': return 'text-green-600 bg-green-100 border-green-300 dark:bg-green-950/20';
      default: return 'text-gray-600 bg-gray-100 border-gray-300 dark:bg-gray-950/20';
    }
  };
  
  export interface Project {
    id: number;
    title: string;
    category: string;
    type: string;
    status: string;
    description: string;
    technologies: string[];
    stats: Record<string, string>;
    links: { live: string; github: string };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MediaFile {
    id: string;
    name: string;
    type: string;
    size: string;
    category: string;
    uploadDate: string;
    alt: string;
    dimensions?: string;
    duration?: string;
    pages?: number;
  }