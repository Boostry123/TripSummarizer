import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/Types/auth";
import { authService } from "@/Apis/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  login: (user: User, token: string, refreshToken: string) => void;
  signup: (user: User, token: string, refreshToken: string) => void;
  signout: () => void;
  setUser: (user: User) => void;
  refreshAccessToken: () => Promise<void>;
}

const REFRESH_TIMEOUT = 45 * 60 * 1000; // 45 minutes

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,

      login: (user, token, refreshToken) => {
        set({
          user,
          token: `Bearer ${token}`,
          refreshToken,
          expiresAt: Date.now() + REFRESH_TIMEOUT,
        });
      },

      signup: (user, token, refreshToken) => {
        set({
          user,
          token: `Bearer ${token}`,
          refreshToken,
          expiresAt: Date.now() + REFRESH_TIMEOUT,
        });
      },

      signout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
        });
        localStorage.clear();
      },

      setUser: (user) => set({ user }),

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const response = await authService.refresh(refreshToken);
          set({
            token: `Bearer ${response.token}`,
            refreshToken: response.refreshToken,
            expiresAt: Date.now() + REFRESH_TIMEOUT,
          });
        } catch (error) {
          console.error("Failed to refresh token:", error);
          get().signout();
        }
      },
    }),
    {
      name: "Token",
      partialize: (state) =>
        ({
          token: state.token,
          refreshToken: state.refreshToken,
          expiresAt: state.expiresAt,
        }) as AuthState,
    },
  ),
);
