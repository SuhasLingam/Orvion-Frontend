import { create } from "zustand";
import {
  apiGetMe,
  apiGetReadiness,
  apiGetBadges,
  apiGetDashboard,
  apiLogActivity,
  apiGetLeaderboard,
  type MeResponse,
  type BadgeItem,
  type LeaderboardEntry,
} from "~/utils/api";

export interface Badge {
  id: string;
  title: string;
  /** TODO(backend): icon not yet in backend schema — uses placeholder until added. */
  icon: string;
  earnedAt?: string;
  isEarned: boolean;
  /** TODO(backend): rarity not yet in backend schema — defaults to "common" until added. */
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface UserState {
  id: string | null;
  name: string;
  initials: string;
  email: string;
  /** TODO(backend): program is not returned by /auth/me yet — falls back to default until backend adds it. */
  program: string;
  /** TODO(backend): program_id is not returned by /auth/me yet — falls back to "fsd" until backend adds it. */
  programId: string;
  level: number;
  levelLabel: string;
  readinessScore: number;
  readinessBadge: string;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastActive: string | null;
  lastActiveMinutesAgo: number;
  cohortRank: number;
  /** TODO(backend): joined_at is not returned by /auth/me yet — shows "Just now" until backend adds it. */
  joinedAt: string;
  badges: Badge[];
  // Dashboard summary stats from GET /dashboard
  completedLessons: number;
  totalLessons: number;
  completedProjects: number;
  totalProjects: number;
  totalTestsTaken: number;
  weeklyGoal: { target: number; completed: number; label: string; resetsIn: string };
  xpHistory: { week: string; xp: number }[];
  activityHeatmap: { date: string; count: number }[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  fetchError: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  logActivity: () => Promise<void>;
  addXP: (amount: number) => void;
}

function getLevelLabel(level: number): string {
  if (level >= 20) return "Expert";
  if (level >= 10) return "Advanced";
  if (level >= 5) return "Intermediate";
  return "Novice";
}

function getReadinessBadge(score: number): string {
  if (score >= 90) return "Top Talent";
  if (score >= 70) return "Ready";
  if (score >= 40) return "Rising Star";
  return "Beginner";
}

function formatLastActive(isoString: string | null): number {
  if (!isoString) return 0;
  const diff = Date.now() - new Date(isoString).getTime();
  return Math.max(0, Math.floor(diff / 60000));
}

/** Derive a placeholder icon name from the badge title for display. */
function deriveBadgeIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("streak")) return "🔥";
  if (n.includes("test") || n.includes("quiz")) return "📝";
  if (n.includes("project")) return "🚀";
  if (n.includes("interview")) return "🎤";
  if (n.includes("level") || n.includes("rank")) return "⭐";
  return "🏅";
}

export const useUserStore = create<UserState>((set, _get) => ({
  id: null,
  name: "Student",
  initials: "ST",
  email: "",
  program: "Full-Stack Developer",  // TODO(backend): waiting on /auth/me to return program
  programId: "fsd",                  // TODO(backend): waiting on /auth/me to return program_id
  level: 1,
  levelLabel: "Novice",
  readinessScore: 0,
  readinessBadge: "Beginner",
  xp: 0,
  xpToNextLevel: 500,
  streak: 0,
  lastActive: null,
  lastActiveMinutesAgo: 0,
  cohortRank: 0,
  joinedAt: "Just now",              // TODO(backend): waiting on /auth/me to return joined_at
  badges: [],
  completedLessons: 0,
  totalLessons: 0,
  completedProjects: 0,
  totalProjects: 0,
  totalTestsTaken: 0,
  weeklyGoal: { target: 1000, completed: 0, label: "Earn 1000 XP", resetsIn: "7d" },
  xpHistory: [],
  activityHeatmap: [],
  leaderboard: [],
  isLoading: false,
  fetchError: null,

  fetchProfile: async () => {
    set({ isLoading: true, fetchError: null });

    try {
      // ── 1. GET /auth/me ──────────────────────────────────────────────────
      let me: MeResponse;
      try {
        me = await apiGetMe();
      } catch (err) {
        console.error("[userStore] /auth/me failed:", err);
        set({ isLoading: false, fetchError: "Could not load profile from backend." });
        return;
      }

      const userName =
        (me.name?.trim() || (me.email ? me.email.split("@")[0] : undefined)) ??
        "Student";

      const xpToNext = 500 * me.level;
      const minutesAgo = formatLastActive(me.last_active ?? null);
      const levelLabel = getLevelLabel(me.level);

      // XP history: single point until backend returns joined_at
      // TODO(backend): replace with real week-by-week data once joined_at is available
      const xpHistory: { week: string; xp: number }[] = [{ week: "W1", xp: me.xp }];

      set({
        id: me.id,
        name: userName,
        initials: userName.substring(0, 2).toUpperCase(),
        email: me.email,
        // program / programId / joinedAt: backend doesn't return these yet
        program: me.program ?? "Full-Stack Developer",
        programId: me.program_id ?? "fsd",
        joinedAt: me.joined_at ? new Date(me.joined_at).toLocaleDateString() : "Just now",
        level: me.level,
        levelLabel,
        xp: me.xp,
        xpToNextLevel: xpToNext,
        streak: me.streak_days,
        lastActive: me.last_active ?? null,
        lastActiveMinutesAgo: minutesAgo,
        weeklyGoal: {
          target: 1000,
          completed: Math.min(me.xp, 1000),
          label: "Earn 1000 XP",
          resetsIn: "7d",
        },
        xpHistory,
      });

      // ── 2. GET /dashboard ────────────────────────────────────────────────
      try {
        const dash = await apiGetDashboard();
        const dashReadiness = dash.readiness_score ?? 0;
        set({
          completedLessons: dash.completed_lessons,
          totalLessons: dash.total_lessons,
          completedProjects: dash.completed_projects,
          totalProjects: dash.total_projects,
          totalTestsTaken: dash.total_tests_taken,
          readinessScore: dashReadiness,
          readinessBadge: getReadinessBadge(dashReadiness),
          cohortRank: Math.min(99, Math.max(1, Math.floor(dashReadiness * 0.8 + 10))),
        });
      } catch (err) {
        console.warn("[userStore] /dashboard failed (non-fatal):", err);
      }

      // ── 3. GET /readiness-score ──────────────────────────────────────────
      try {
        const readiness = await apiGetReadiness();
        const rScore = readiness.score ?? 0;
        set({
          readinessScore: rScore,
          readinessBadge: getReadinessBadge(rScore),
          cohortRank: Math.min(99, Math.max(1, Math.floor(rScore * 0.8 + 10))),
        });
      } catch (err) {
        console.warn("[userStore] /readiness-score failed (non-fatal):", err);
      }

      // ── 4. GET /badges ───────────────────────────────────────────────────
      try {
        const badgeData: BadgeItem[] = await apiGetBadges();
        const allowedRarity = ["common", "rare", "epic", "legendary"] as const;
        const mappedBadges: Badge[] = badgeData.map((b) => {
          const rarity = (
            allowedRarity.includes(b.rarity as (typeof allowedRarity)[number])
              ? b.rarity
              : "common"
          ) as Badge["rarity"];
          return {
            id: b.id,
            title: b.name,
            // Prefer the backend-provided icon; fall back to a derived emoji.
            icon: b.icon ?? deriveBadgeIcon(b.name),
            isEarned: b.is_earned ?? b.awarded_at !== null,
            earnedAt: b.awarded_at ?? undefined,
            rarity,
          };
        });
        set({ badges: mappedBadges });
      } catch (err) {
        console.warn("[userStore] /badges failed (non-fatal):", err);
      }

      // ── 5. GET /leaderboard ──────────────────────────────────────────────
      try {
        const leaderboardData = await apiGetLeaderboard();
        set({
          leaderboard: leaderboardData.map((entry) => ({
            ...entry,
            initials: entry.name
              ? entry.name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()
              : "??",
          })),
        });
      } catch (err) {
        console.warn("[userStore] /leaderboard failed (non-fatal):", err);
      }

      set({ isLoading: false });
    } catch (err) {
      console.error("[userStore] fetchProfile unexpected error:", err);
      set({ isLoading: false, fetchError: "Unexpected error loading profile." });
    }
  },

  addXP: (amount) =>
    set((state) => {
      const newXP = state.xp + amount;
      const leveledUp = newXP >= state.xpToNextLevel;
      return {
        xp: leveledUp ? newXP - state.xpToNextLevel : newXP,
        level: leveledUp ? state.level + 1 : state.level,
        xpToNextLevel: leveledUp
          ? Math.floor(state.xpToNextLevel * 1.5)
          : state.xpToNextLevel,
      };
    }),

  /**
   * POST /activity — logs a daily active session to keep the streak alive.
   * Called once on dashboard mount; subsequent calls within the same session
   * are no-ops (the backend is idempotent per-day).
   */
  logActivity: async () => {
    try {
      const result = await apiLogActivity({ active_time_mins: 1 });
      if (typeof result.streak_days === "number") {
        set({ streak: result.streak_days });
      }
    } catch (err) {
      console.warn("[userStore] /activity failed (non-fatal):", err);
    }
  },
}));
