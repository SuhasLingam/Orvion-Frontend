import { create } from "zustand";
import {
  apiGetRecommendations,
  apiRefreshRecommendations,
  type BackendRecommendation,
} from "~/utils/api";

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

/** Client-side tip-of-day fallback — backend does not return this field. */
const CLIENT_TIP =
  "Focus on understanding *why* a component re-renders before trying to optimize it with memoization.";

function minutesAgoFromISO(isoString: string): number {
  const diff = Date.now() - new Date(isoString).getTime();
  return Math.max(0, Math.floor(diff / 60000));
}

function mapRecommendation(r: BackendRecommendation): LLMInsight {
  return {
    weakAreas: r.weak_areas,
    strengths: r.strengths,
    nextActions: r.next_actions.map((a) => ({
      id: a.id,
      title: a.title,
      type: (["review", "practice", "project"].includes(a.type)
        ? a.type
        : "review") as ActionItem["type"],
      priority: (["high", "medium", "low"].includes(a.priority)
        ? a.priority
        : "medium") as ActionItem["priority"],
      reason: a.reason,
    })),
    // Backend does not return tip_of_day — use client-side fallback
    tipOfDay: CLIENT_TIP,
    lastFetchedMinutesAgo: minutesAgoFromISO(r.generated_at),
  };
}

interface InsightState {
  insight: LLMInsight | null;
  isLoading: boolean;
  lastFetchedMinutesAgo: number | null;
  weakAreas: string[];
  strengths: string[];
  nextActions: ActionItem[];
  tipOfDay: string;
  fetchInsights: () => Promise<void>;
  refreshInsights: () => Promise<void>;
}

export const useInsightStore = create<InsightState>((set) => ({
  insight: null,
  isLoading: false,
  lastFetchedMinutesAgo: null,
  weakAreas: [],
  strengths: [],
  nextActions: [],
  tipOfDay: CLIENT_TIP,

  fetchInsights: async () => {
    set({ isLoading: true });
    try {
      const raw = await apiGetRecommendations();
      const mapped = mapRecommendation(raw);
      set({
        insight: mapped,
        weakAreas: mapped.weakAreas,
        strengths: mapped.strengths,
        nextActions: mapped.nextActions,
        tipOfDay: mapped.tipOfDay,
        lastFetchedMinutesAgo: mapped.lastFetchedMinutesAgo,
      });
    } catch (err) {
      console.warn("[insightStore] /recommendations failed (non-fatal):", err);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Triggers backend LLM re-generation via POST /recommendations/refresh.
   * Rate-limited to once every 6 hours on the backend side.
   */
  refreshInsights: async () => {
    set({ isLoading: true });
    try {
      const raw = await apiRefreshRecommendations();
      const mapped = mapRecommendation(raw);
      set({
        insight: mapped,
        weakAreas: mapped.weakAreas,
        strengths: mapped.strengths,
        nextActions: mapped.nextActions,
        tipOfDay: mapped.tipOfDay,
        lastFetchedMinutesAgo: 0,
      });
    } catch (err) {
      console.warn("[insightStore] /recommendations/refresh failed:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
