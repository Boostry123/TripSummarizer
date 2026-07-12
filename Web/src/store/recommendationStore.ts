import { create } from "zustand";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RecommendationState {
  recommendation: string | null;
  history: Message[];
  lastInitialMessage: string | null;
  setRecommendation: (rec: string | null) => void;
  addToHistory: (message: Message) => void;
  clearHistory: () => void;
  setLastInitialMessage: (msg: string | null) => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendation: null,
  history: [],
  lastInitialMessage: null,

  setRecommendation: (recommendation) => set({ recommendation }),
  addToHistory: (message) =>
    set((state) => ({ history: [...state.history, message] })),
  clearHistory: () => set({ history: [], recommendation: null }),
  setLastInitialMessage: (lastInitialMessage) => set({ lastInitialMessage }),
}));
