export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim().length === 0) return true; // Empty is valid (optional field)
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isValidRating = (rating: number | string): boolean => {
  const num = typeof rating === 'string' ? parseInt(rating) : rating;
  return !isNaN(num) && num >= 1 && num <= 5;
};

export const validateProjectForm = (formData: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Required fields
  if (!formData.title?.trim()) errors.title = 'Title is required';
  if (!formData.category?.trim()) errors.category = 'Category is required';
  if (!formData.type?.trim()) errors.type = 'Type is required';
  if (!formData.description?.trim()) errors.description = 'Description is required';

  // URL validations
  if (formData.cover_image_url && !isValidUrl(formData.cover_image_url)) {
    errors.cover_image_url = 'Invalid URL format';
  }

  if (formData.links) {
    if (formData.links.live && !isValidUrl(formData.links.live)) errors.links_live = 'Invalid URL format';
    if (formData.links.github && !isValidUrl(formData.links.github)) errors.links_github = 'Invalid URL format';
    if (formData.links.documentation && !isValidUrl(formData.links.documentation)) errors.links_documentation = 'Invalid URL format';
    if (formData.links.case_study && !isValidUrl(formData.links.case_study)) errors.links_case_study = 'Invalid URL format';
    if (formData.links.demo && !isValidUrl(formData.links.demo)) errors.links_demo = 'Invalid URL format';
  }

  // Validate images
  if (Array.isArray(formData.images)) {
    formData.images.forEach((img: any, index: number) => {
      if (img.url && !isValidUrl(img.url)) {
        errors[`images_${index}_url`] = 'Invalid URL format';
      }
    });
  }

  // Validate testimonials ratings
  if (Array.isArray(formData.testimonials)) {
    formData.testimonials.forEach((tm: any, index: number) => {
      if (tm.rating !== undefined && !isValidRating(tm.rating)) {
        errors[`testimonials_${index}_rating`] = 'Rating must be between 1 and 5';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};


