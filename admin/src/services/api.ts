const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
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
    return this.request<{ 
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
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async verifyToken(): Promise<{ valid: boolean; user?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/verify`, {
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
}

export const apiService = new ApiService();
export default apiService;
