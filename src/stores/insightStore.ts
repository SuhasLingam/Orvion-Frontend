import { create } from "zustand";

export interface ActionItem {
  id: string;
  title: string;
  type: "review" | "practice" | "project";
  priority: "high" | "medium" | "low";
  reason: string;
}

export interface LLMInsight {
  weakAreas: string[];
  strengths: string[];
  nextActions: ActionItem[];
  tipOfDay: string;
  lastFetchedMinutesAgo: number;
}

const fallbackInsight: LLMInsight = {
  weakAreas: ["React Hooks", "Dynamic Programming"],
  strengths: ["SQL Joins", "REST APIs", "System Design"],
  nextActions: [
    { id: "1", title: "Review useCallback & useMemo", type: "review", priority: "high", reason: "Missed 3 questions in recent mock test." },
    { id: "2", title: "Practice Graph Traversal", type: "practice", priority: "medium", reason: "Struggled with pathfinding in interview." },
    { id: "3", title: "Build Auth Module", type: "project", priority: "low", reason: "Good next step for full-stack progression." },
  ],
  tipOfDay: "Focus on understanding *why* a component re-renders before trying to optimize it with memoization.",
  lastFetchedMinutesAgo: 45,
};

interface InsightState {
  insight: LLMInsight | null;
  isLoading: boolean;
  lastFetchedMinutesAgo: number | null;
  weakAreas: string[];
  strengths: string[];
  nextActions: ActionItem[];
  tipOfDay: string;
  fetchInsights: () => Promise<void>;
}

export const useInsightStore = create<InsightState>((set) => ({
  insight: fallbackInsight,
  isLoading: false,
  lastFetchedMinutesAgo: fallbackInsight.lastFetchedMinutesAgo,
  weakAreas: fallbackInsight.weakAreas,
  strengths: fallbackInsight.strengths,
  nextActions: fallbackInsight.nextActions,
  tipOfDay: fallbackInsight.tipOfDay,
  fetchInsights: async () => {
    // In a real Supabase setup, this would call an Edge Function or backend endpoint to run the LLM.
    // For now, we simulate the LLM generation time.
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 2200));
    set({
      isLoading: false,
      lastFetchedMinutesAgo: 0,
      insight: fallbackInsight,
    });
  },
}));
