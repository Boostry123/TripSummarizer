import { create } from "zustand";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RecommendationState {
  id: string | null;
  recommendation: string | null;
  history: Message[];
  setRecommendationId: (id: string) => void;
  setRecommendation: (rec: string | null) => void;
  addToHistory: (message: Message) => void;
  clearHistory: () => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  id: null,
  recommendation: null,
  history: [],
  setRecommendationId: (id) => set({ id }),

  setRecommendation: (recommendation) => set({ recommendation }),
  addToHistory: (message) =>
    set((state) => ({ history: [...state.history, message] })),
  clearHistory: () => {
    set({ history: [], recommendation: null, id: null });
  },
}));
