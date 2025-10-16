import { LoginCredentials, AuthResponse } from '../../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.email === 'hr@humanet.com' && credentials.password === 'hr123') {
      return {
        user: {
          id: '1',
          email: 'hr@humanet.com',
          name: 'Carter Bergson',
          role: 'hr',
        },
        token: 'mock-hr-token-12345'
      };
    }

    if (credentials.email === 'employee@humanet.com' && credentials.password === 'emp123') {
      return {
        user: {
          id: '2',
          email: 'employee@humanet.com',
          name: 'Khubaib Ahmed',
          role: 'employee',
        },
        token: 'mock-employee-token-67890'
      };
    }

    throw new Error('Invalid email or password');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): AuthResponse | null => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      return {
        user: JSON.parse(user),
        token
      };
    }
    return null;
  }
};
