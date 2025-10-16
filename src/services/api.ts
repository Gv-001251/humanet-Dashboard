const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('humanet_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    },
    ...options
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
