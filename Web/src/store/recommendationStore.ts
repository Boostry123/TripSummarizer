import { create } from "zustand";

interface RecommendationState {
  recommendation: string | null;
  lastInitialMessage: string | null;
  setRecommendation: (rec: string | null) => void;
  setLastInitialMessage: (msg: string | null) => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendation: null,
  lastInitialMessage: null,

  setRecommendation: (recommendation) => set({ recommendation }),
  setLastInitialMessage: (lastInitialMessage) => set({ lastInitialMessage }),
}));
