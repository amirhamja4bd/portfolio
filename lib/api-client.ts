/**
 * API Client Utilities
 * Centralized API communication for the frontend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ApiError extends Error {
  status: number;
  errors?: any;

  constructor(message: string, status: number, errors?: any) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = "ApiError";
  }
}

/**
 * Make an API request
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies
  };

  try {
    const response = await fetch(url, config);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || "An error occurred",
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error - please check your connection", 500);
  }
}

/**
 * API Client
 */
export const api = {
  // GET request
  get: <T = any>(endpoint: string, params?: Record<string, any>) => {
    const url = new URL(endpoint, API_BASE_URL);
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }
    return apiRequest<T>(url.toString(), { method: "GET" });
  },

  // POST request
  post: <T = any>(endpoint: string, body?: any) => {
    return apiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // PUT request
  put: <T = any>(endpoint: string, body?: any) => {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  // DELETE request
  delete: <T = any>(endpoint: string) => {
    return apiRequest<T>(endpoint, { method: "DELETE" });
  },

  // Upload file
  upload: async <T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    return apiRequest<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it with boundary
    });
  },
};

/**
 * Auth API
 */
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),

  register: (
    email: string,
    password: string,
    name: string,
    secretKey?: string
  ) => api.post("/api/auth/register", { email, password, name, secretKey }),

  logout: () => api.post("/api/auth/logout"),

  me: () => api.get("/api/auth/me"),
};

/**
 * Blog API
 */
export const blogApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tag?: string;
    sort?: string;
    featured?: boolean;
    all?: boolean;
  }) => api.get("/api/blogs", params),

  // Get all distinct tags
  getTags: (params?: { all?: boolean; category?: string }) =>
    api.get<string[]>("/api/blogs/tags", params),

  // Get all distinct categories
  getCategories: (params?: { all?: boolean }) =>
    api.get<string[]>("/api/blogs/categories", params),

  getBySlug: (slug: string) => api.get(`/api/blogs/${slug}`),

  create: (data: any) => api.post("/api/blogs", data),

  update: (slug: string, data: any) => api.put(`/api/blogs/${slug}`, data),

  delete: (slug: string) => api.delete(`/api/blogs/${slug}`),
};

/**
 * Project API
 */
export const projectApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    featured?: boolean;
    all?: boolean;
    sort?: string;
  }) => api.get("/api/projects", params),

  getBySlug: (slug: string) => api.get(`/api/projects/${slug}`),

  create: (data: any) => api.post("/api/projects", data),

  update: (slug: string, data: any) => api.put(`/api/projects/${slug}`, data),

  delete: (slug: string) => api.delete(`/api/projects/${slug}`),
};

/**
 * Skill API
 */
export const skillApi = {
  getAll: (params?: { category?: string; all?: boolean }) =>
    api.get("/api/skills", params),

  getById: (id: string) => api.get(`/api/skills/${id}`),

  create: (data: any) => api.post("/api/skills", data),

  update: (id: string, data: any) => api.put(`/api/skills/${id}`, data),

  delete: (id: string) => api.delete(`/api/skills/${id}`),
};

/**
 * Experience API
 */
export const experienceApi = {
  getAll: (params?: { all?: boolean }) => api.get("/api/experience", params),

  getById: (id: string) => api.get(`/api/experience/${id}`),

  create: (data: any) => api.post("/api/experience", data),

  update: (id: string, data: any) => api.put(`/api/experience/${id}`, data),

  delete: (id: string) => api.delete(`/api/experience/${id}`),
};

/**
 * Contact API
 */
export const contactApi = {
  submit: (name: string, email: string, message: string) =>
    api.post("/api/contact", { name, email, message }),

  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get("/api/contact", params),

  getById: (id: string) => api.get(`/api/contact/${id}`),

  update: (id: string, data: any) => api.put(`/api/contact/${id}`, data),

  delete: (id: string) => api.delete(`/api/contact/${id}`),
};

/**
 * Upload API
 */
export const uploadApi = {
  upload: (file: File, type?: string) =>
    api.upload("/api/upload", file, type ? { type } : undefined),

  uploadForEditorJS: (file: File) => api.upload("/api/upload/editorjs", file),
};

export { ApiError };
export type { ApiResponse };
