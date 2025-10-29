export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  userId: string;
  id?: string;
  email: string;
  name: string;
  role: 'hr' | 'admin' | 'team_lead' | 'ceo' | 'investor' | 'employee';
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user: User;
  message?: string;
}
