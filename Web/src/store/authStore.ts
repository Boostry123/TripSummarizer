import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { User } from '@/Types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  signup: (user: User, token: string) => void;
  signout: () => void;
}

const customStorage: PersistStorage<AuthState> = {
  getItem: (name) => {
    const token = localStorage.getItem(name);
    if (!token) return null;
    return {
      state: { token } as AuthState,
      version: 0,
    };
  },
  setItem: (name, value) => {
    if (value.state.token) {
      localStorage.setItem(name, value.state.token);
    } else {
      localStorage.removeItem(name);
    }
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token: `Bearer ${token}` }),
      signup: (user, token) => set({ user, token: `Bearer ${token}` }),
      signout: () => {
        set({ user: null, token: null });
        localStorage.clear();
      },
    }),
    {
      name: 'Token',
      storage: customStorage,
      partialize: (state) => ({ token: state.token } as AuthState),
    }
  )
);
