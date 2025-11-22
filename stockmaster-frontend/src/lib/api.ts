const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_URL);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>('/auth/login', { email, password }),
  
  signup: (username: string, email: string, password: string, role?: string) =>
    api.post<{ token: string; user: any }>('/auth/signup', { username, email, password, role }),
  
  requestOtp: (email: string) =>
    api.post('/auth/request-otp', { email }),
  
  verifyOtp: (email: string, otp: string, newPassword: string) =>
    api.post('/auth/verify-otp', { email, otp, newPassword }),
};

// Warehouse API
export const warehouseApi = {
  getAll: () => api.get<any[]>('/warehouses'),
  
  getById: (id: string) => api.get<any>(`/warehouses/${id}`),
  
  create: (name: string, code: string, location: string) =>
    api.post('/warehouses', { name, code, location }),
  
  join: (codeOrName: string) =>
    api.post<{ message: string; warehouse: any }>('/warehouses/join', { 
      name: codeOrName 
    }),
};

// Product API
export const productApi = {
  getAll: () => api.get<any[]>('/products'),
  
  getById: (id: string) => api.get<any>(`/products/${id}`),
  
  create: (data: any) => api.post('/products', data),
  
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Operations API
export const operationsApi = {
  getAll: () => api.get<any[]>('/operations'),
  
  create: (data: any) => api.post('/operations', data),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get<any>('/dashboard/stats'),
};
