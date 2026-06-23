import { create } from "zustand";
import {
  apiGetRecommendations,
  apiGenerateRecommendations,
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

/** Fallback tip used only when the backend doesn't supply tip_of_day. */
const CLIENT_TIP =
  "Focus on understanding *why* a component re-renders before trying to optimize it with memoization.";

function minutesAgoFromISO(isoString: string | null | undefined): number {
  if (!isoString) return 0;
  const diff = Date.now() - new Date(isoString).getTime();
  return Math.max(0, Math.floor(diff / 60000));
}

/**
 * Infer action priority based on content. Actions mentioning a known weak area
 * or containing urgency words are "high"; project/interview actions are "low".
 */
function inferPriority(
  title: string,
  weakAreas: string[],
  index: number,
): ActionItem["priority"] {
  const t = title.toLowerCase();
  const isWeakArea = weakAreas.some((w) => t.includes(w.toLowerCase()));
  if (isWeakArea) return "high";
  if (/revise|review|revisit|weak|fail|below|improve/i.test(t)) return "high";
  if (/project|build|complete/i.test(t)) return "low";
  // First two actions are higher priority by default
  if (index < 2) return "high";
  return "medium";
}

/**
 * The backend returns next_actions as an OBJECT:
 *   { actions: string[], analytics_context: {...} }
 * and weak_areas / strengths as flat string[]. The backend does NOT provide a
 * per-action type / priority / reason, so we synthesize sensible defaults.
 * This function is fully defensive — an unexpected shape produces empty lists
 * rather than throwing (which previously left the AI page blank).
 */
function mapRecommendation(r: BackendRecommendation): LLMInsight {
  const rawWeak = Array.isArray(r?.weak_areas) ? r.weak_areas : [];
  const weakAreas: string[] = rawWeak.map((w) =>
    typeof w === "string" ? w : ((w as { topic: string }).topic ?? String(w)),
  );

  const rawStrengths = Array.isArray(r?.strengths) ? r.strengths : [];
  const strengths: string[] = rawStrengths.map((s) =>
    typeof s === "string" ? s : ((s as { topic: string }).topic ?? String(s)),
  );

  const actionList: string[] = Array.isArray(r?.next_actions?.actions)
    ? (r.next_actions?.actions ?? [])
    : [];

  return {
    weakAreas,
    strengths,
    nextActions: actionList.map((title, i) => ({
      id: `action-${i}`,
      title,
      type: "review" as const,
      priority: inferPriority(title, weakAreas, i),
      reason: "",
    })),
    tipOfDay: r?.tip_of_day ?? CLIENT_TIP,
    lastFetchedMinutesAgo: minutesAgoFromISO(r?.generated_at),
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
      console.warn("[insightStore] /recommendations failed:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Triggers a synchronous regeneration (POST /recommendations/generate) and
   * then re-reads the result (GET /recommendations). The plain /refresh
   * endpoint only queues an async worker and returns 202 with no payload, so
   * it can't update the UI on its own.
   */
  refreshInsights: async () => {
    set({ isLoading: true });
    try {
      await apiGenerateRecommendations();
      const raw = await apiGetRecommendations();
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
      console.warn("[insightStore] regenerate failed:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
