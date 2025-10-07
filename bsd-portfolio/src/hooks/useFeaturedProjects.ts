import { useMemo } from 'react';
import { UiProject } from '../utils/projects';

export function useFeaturedProjects(projects: UiProject[], maxProjects: number = 3) {
  return useMemo(() => {
    if (!projects || projects.length === 0) return [];

    // Group projects by category and sort by highlight (priority) and id
    const projectsByCategory = projects.reduce((acc, project) => {
      const category = project.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(project);
      return acc;
    }, {} as Record<string, UiProject[]>);

    // Sort projects within each category by highlight (priority) and id
    Object.keys(projectsByCategory).forEach(category => {
      projectsByCategory[category].sort((a, b) => {
        // First sort by highlight (projects with highlight come first)
        const aHasHighlight = a.highlight && a.highlight.trim() !== '';
        const bHasHighlight = b.highlight && b.highlight.trim() !== '';
        
        if (aHasHighlight && !bHasHighlight) return -1;
        if (!aHasHighlight && bHasHighlight) return 1;
        
        // If both have or don't have highlight, sort by id (lower id = higher priority)
        return a.id - b.id;
      });
    });

    const categories = Object.keys(projectsByCategory);
    const selectedProjects: UiProject[] = [];

    if (categories.length === 1) {
      // If only one category exists, select up to maxProjects from it
      const categoryProjects = projectsByCategory[categories[0]];
      selectedProjects.push(...categoryProjects.slice(0, maxProjects));
    } else {
      // If multiple categories exist, select up to 3 categories at random
      const shuffledCategories = [...categories].sort(() => Math.random() - 0.5);
      const selectedCategories = shuffledCategories.slice(0, 3);
      
      // Select 1 project from each selected category (priority 1 - first in sorted order)
      for (const category of selectedCategories) {
        const categoryProjects = projectsByCategory[category];
        if (categoryProjects.length > 0) {
          selectedProjects.push(categoryProjects[0]); // Take first project (highest priority)
        }
      }
    }

    return selectedProjects.slice(0, maxProjects);
  }, [projects, maxProjects]);
}
