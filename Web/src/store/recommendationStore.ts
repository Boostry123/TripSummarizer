import { create } from "zustand";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RecommendationState {
  recommendation: string | null;
  history: Message[];
  setRecommendation: (rec: string | null) => void;
  addToHistory: (message: Message) => void;
  clearHistory: () => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendation: null,
  history: [],
  setRecommendation: (recommendation) => set({ recommendation }),
  addToHistory: (message) =>
    set((state) => ({ history: [...state.history, message] })),
  clearHistory: () => set({ history: [], recommendation: null }),
}));
