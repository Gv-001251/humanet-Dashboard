const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
};

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const makeRequest = async (): Promise<Response> => {
    return fetch(`${API_BASE}${endpoint}`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      },
      ...options
    });
  };

  let response = await makeRequest();

  if (response.status === 401) {
    try {
      const errorData = await response.clone().json();
      if (errorData.code === 'TOKEN_EXPIRED') {
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          response = await makeRequest();
        }
      }
    } catch (e) {
      console.error('Error handling 401:', e);
    }
  }

  if (!response.ok) {
    let errorMessage = 'Something went wrong';

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      
      if (errorData.code === 'TOKEN_EXPIRED' || errorData.code === 'TOKEN_REVOKED' || errorData.code === 'NO_TOKEN') {
        localStorage.removeItem('humanet_user');
        window.location.href = '/login';
      }
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
  post: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined
  }),
  put: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined
  }),
  delete: <T>(endpoint: string) => request<T>(endpoint, {
    method: 'DELETE'
  })
};

export const employeeAPI = {
  getAll: () => api.get<{ success: boolean; data: any[] }>('/employees'),
  getById: (id: string) => api.get<{ success: boolean; data: any }>(`/employees/${id}`),
  create: (data: any) => api.post<{ success: boolean; data: any }>('/employees', data),
  update: (id: string, data: any) => api.put<{ success: boolean; data: any }>(`/employees/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/employees/${id}`)
};
