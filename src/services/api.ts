const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? {
        Accept: 'application/json',
        ...(options.headers || {})
      }
    : {
        ...defaultHeaders,
        ...options.headers
      };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMessage = 'Something went wrong';

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (error) {
      console.error('Unable to parse error response', error);
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined)
    });
  },
  put: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined
  }),
  delete: <T>(endpoint: string) => request<T>(endpoint, {
    method: 'DELETE'
  })
};

export const employeeAPI = {
  getAll: () => api.get<ApiResponse<unknown[]>>('/employees'),
  getById: (id: string) => api.get<ApiResponse<unknown>>(`/employees/${id}`),
  create: (data: unknown) => api.post<ApiResponse<unknown>>('/employees', data),
  update: (id: string, data: unknown) => api.put<ApiResponse<unknown>>(`/employees/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/employees/${id}`)
};
