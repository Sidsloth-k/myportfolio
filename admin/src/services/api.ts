const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const resolveUploadsUrl = (fileOrPath: string): string => {
  try {
    const base = new URL(API_BASE_URL);
    // Ensure we end up at /uploads on the same host as API
    const uploadsBase = new URL('../uploads/', base);
    const raw = (fileOrPath || '').replace(/^\/*/, '');
    if (raw.startsWith('uploads/')) {
      return new URL(raw, uploadsBase).toString();
    }
    return new URL(raw, uploadsBase).toString();
  } catch {
    return `/uploads/${fileOrPath}`;
  }
};

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('admin_token', token);
      } else {
        localStorage.removeItem('admin_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Add Authorization header if token is available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const defaultOptions: RequestInit = {
      headers,
      credentials: 'include', // Important for cookies
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  async login(username: string, password: string) {
    const response = await this.request<{ 
      token: string; 
      user: { 
        id: number;
        username: string; 
        full_name?: string;
        email?: string;
        role: string;
      } 
    }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
    
    // Store token for Authorization header
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    
    // Clear token on logout
    this.setToken(null);
    
    return response;
  }

  async verifyToken(): Promise<{ valid: boolean; user?: any; error?: string }> {
    try {
      const headers: Record<string, string> = {};
      // Add Authorization header if token is available
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      const response = await fetch(`${this.baseURL}/auth/verify`, {
        headers,
        credentials: 'include',
      });
      const data = await response.json();
      
      if (!response.ok) {
        return { valid: false, error: data.error || 'Verification failed' };
      }
      
      return data;
    } catch (error: any) {
      return { valid: false, error: error.message || 'Network error' };
    }
  }

  // Projects API
  async getProjects() {
    return this.request<any[]>('/projects');
  }

  async getProject(id: number) {
    return this.request<any>(`/projects/${id}`);
  }

  async createProject(projectData: any) {
    return this.request<{ id: number }>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: number, projectData: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async patchProject(id: number, projectData: any) {
    // Try PATCH first; if not supported (404), fallback to PUT
    const url = `${this.baseURL}/projects/${id}`;
    try {
      const patchRes = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(projectData),
      });
      if (patchRes.ok) {
        return await patchRes.json();
      }
      // If the endpoint exists but rejects, surface its message
      if (patchRes.status !== 404) {
        const errJson = await patchRes.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || `Request failed (${patchRes.status})`);
      }
      // Fallback to PUT when PATCH is not found
      const putRes = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(projectData),
      });
      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || `Request failed (${putRes.status})`);
      }
      return await putRes.json();
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  async deleteProject(id: number) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjectCategories() {
    return this.request<any[]>('/projects/categories');
  }

  async createProjectCategory(name: string) {
    return this.request<{ name: string }>('/projects/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getProjectTypes() {
    return this.request<any[]>('/projects/types');
  }

  async createProjectType(name: string) {
    return this.request<{ name: string }>('/projects/types', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  }

  // Skills API
  async getSkills() {
    return this.request<any[]>('/skills');
  }

  async createSkill(payload: {
    name: string;
    category?: string;
    proficiency_level?: number | string;
    description?: string;
    icon_key?: string;
    years_experience?: string;
    overview?: string;
    technologies?: any[];
    key_achievements?: any[];
    color?: string;
  }) {
    // Backend expects all 10 columns explicitly. Coerce undefined -> null and arrays -> []
    const body = {
      name: payload.name,
      description: payload.description ?? null,
      proficiency_level: payload.proficiency_level ?? null,
      category: payload.category ?? null,
      icon_key: payload.icon_key ?? null,
      years_experience: payload.years_experience ?? null,
      overview: payload.overview ?? null,
      technologies: Array.isArray(payload.technologies) ? payload.technologies : [],
      key_achievements: Array.isArray(payload.key_achievements) ? payload.key_achievements : [],
      color: payload.color ?? null,
    };
    return this.request<any>('/skills', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Media API
  async uploadImage(file: File, altText?: string, caption?: string, tags?: string[]) {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('alt_text', altText);
    if (caption) formData.append('caption', caption);
    if (tags) formData.append('tags', JSON.stringify(tags));

    const url = `${this.baseURL}/media`;
    
    const headers: Record<string, string> = {};
    // Add Authorization header if token is available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    // Don't set Content-Type header - browser will set it automatically with boundary for FormData
    
    // Use the same fetch configuration as the request method to ensure cookies are sent
    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include', // Important for cookies
      mode: 'cors', // Ensure CORS is handled
      body: formData,
    });

    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Upload failed (${response.status}): ${text || 'Unknown error'}`);
      }
    }

    if (!response.ok) {
      const errorMsg = data.error || data.message || `Upload failed (${response.status})`;
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (response.status === 500 && data.details) {
        throw new Error(`${errorMsg}: ${data.details}`);
      }
      throw new Error(errorMsg);
    }

    // Backend already returns { success: true, data: {...} } format
    return data;
  }

  // Contact Submissions API
  async getContactSubmissions(page: number = 1, limit: number = 50, urgencyLevel?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (urgencyLevel) {
      params.append('urgency', urgencyLevel);
    }
    return this.request<any[]>(`/contact/submissions?${params.toString()}`);
  }

  async updateContactSubmission(id: string, data: { status?: string; is_read?: boolean }) {
    return this.request(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Contact Info API
  async getContactInfo() {
    return this.request<any[]>('/contact/info');
  }

  async getAllContactInfo() {
    return this.request<any[]>('/contact/info/all');
  }

  async createContactInfo(data: {
    key: string;
    label: string;
    value: string;
    contact_values?: string[];
    description?: string;
    icon_key?: string;
    display_order?: number;
    contact_type?: string;
  }) {
    return this.request<any>('/contact/info', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContactInfo(key: string, data: {
    label?: string;
    value?: string;
    contact_values?: string[];
    description?: string;
    icon_key?: string;
    display_order?: number;
    contact_type?: string;
  }) {
    return this.request<any>(`/contact/info/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContactInfo(key: string, hardDelete: boolean = false) {
    const url = hardDelete ? `/contact/info/${key}?hardDelete=true` : `/contact/info/${key}`;
    return this.request<any>(url, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
