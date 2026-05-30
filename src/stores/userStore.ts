import { create } from "zustand";
import {
  apiGetMe,
  apiGetReadiness,
  apiGetBadges,
  type MeResponse,
  type BadgeItem,
} from "~/utils/api";

export interface Badge {
  id: string;
  title: string;
  icon: string;
  earnedAt?: string;
  isEarned: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface UserState {
  id: string | null;
  name: string;
  initials: string;
  email: string;
  program: string;
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
  joinedAt: string;
  badges: Badge[];
  weeklyGoal: { target: number; completed: number; label: string; resetsIn: string };
  xpHistory: { week: string; xp: number }[];
  activityHeatmap: { date: string; count: number }[];
  isLoading: boolean;
  fetchError: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
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

export const useUserStore = create<UserState>((set, _get) => ({
  id: null,
  name: "Student",
  initials: "ST",
  email: "",
  program: "Full-Stack Developer",
  programId: "fsd",
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
  joinedAt: "Just now",
  badges: [],
  weeklyGoal: { target: 1000, completed: 0, label: "Earn 1000 XP", resetsIn: "7d" },
  xpHistory: [],
  activityHeatmap: [],
  isLoading: false,
  fetchError: null,

  fetchProfile: async () => {
    set({ isLoading: true, fetchError: null });

    try {
      // ── 1. /auth/me ────────────────────────────────────────────────────
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

      const xpToNext = 500 * me.level; // simple progression
      const minutesAgo = formatLastActive(me.last_active ?? null);

      const levelLabel = getLevelLabel(me.level);

      // Generate XP history based on joined_at and current xp
      const enrollmentDate = me.joined_at ? new Date(me.joined_at) : new Date();
      const today = new Date();
      const diffDays = Math.max(
        1,
        Math.ceil(
          Math.abs(today.getTime() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      const totalWeeks = Math.max(1, Math.ceil(diffDays / 7));

      const xpHistory: { week: string; xp: number }[] = [];
      for (let w = 0; w < totalWeeks; w++) {
        xpHistory.push({
          week: `W${w + 1}`,
          xp: w === totalWeeks - 1 ? me.xp : Math.round((me.xp / totalWeeks) * (w + 1)),
        });
      }

      set({
        id: me.id,
        name: userName,
        initials: userName.substring(0, 2).toUpperCase(),
        email: me.email,
        program: me.program ?? "Full-Stack Developer",
        programId: me.program_id ?? "fsd",
        level: me.level,
        levelLabel,
        xp: me.xp,
        xpToNextLevel: xpToNext,
        streak: me.streak_days,
        lastActive: me.last_active ?? null,
        lastActiveMinutesAgo: minutesAgo,
        joinedAt: me.joined_at
          ? new Date(me.joined_at).toLocaleDateString()
          : "Just now",
        weeklyGoal: {
          target: 1000,
          completed: Math.min(me.xp, 1000),
          label: "Earn 1000 XP",
          resetsIn: "7d",
        },
        xpHistory,
      });

      // ── 2. /readiness-score ────────────────────────────────────────────
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

      // ── 3. /badges ─────────────────────────────────────────────────────
      try {
        const badgeData: BadgeItem[] = await apiGetBadges();
        const mappedBadges: Badge[] = badgeData.map((b) => ({
          id: b.id,
          title: b.title,
          icon: b.icon,
          rarity: b.rarity,
          isEarned: b.is_earned,
          earnedAt: b.earned_at,
        }));
        set({ badges: mappedBadges });
      } catch (err) {
        console.warn("[userStore] /badges failed (non-fatal):", err);
        // keep empty badges — no fake mock data
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
}));
