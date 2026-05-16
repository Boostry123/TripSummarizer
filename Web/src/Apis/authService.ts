import apiClient from "@/Apis/apiClient";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "@/Types/auth";

/**
 * Auth Service
 * Provides methods for interacting with the authentication API
 */
export const authService = {
  /**
   * Register a new user
   */
  signup: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse & { message: string }>(
      "/auth/signup",
      credentials,
    );
    return response.data;
  },

  /**
   * Login an existing user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse & { message: string }>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  /**
   * Refresh the access token
   */
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse & { message: string }>(
      "/auth/refresh",
      { refreshToken },
    );
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await apiClient.get<AuthResponse>("/auth/profile");
    return response.data;
  },
};
