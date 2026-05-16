export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

export interface AuthServiceResponse {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  refreshToken?: string;
  error?: {
    status: number;
    message: string;
  };
}
