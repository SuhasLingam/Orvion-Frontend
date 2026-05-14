import { create } from "zustand";
import { createClient } from "~/utils/supabase/client";

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
  lastActiveMinutesAgo: number;
  cohortRank: number;
  joinedAt: string;
  badges: Badge[];
  weeklyGoal: { target: number; completed: number; label: string; resetsIn: string };
  xpHistory: { week: string; xp: number }[];
  activityHeatmap: { date: string; count: number }[];
  
  // Actions
  fetchProfile: () => Promise<void>;
  addXP: (amount: number) => void;
}

interface Profile {
  id: string;
  name: string | null;
  email: string;
  program: string;
  program_id: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  streak: number;
  readiness_score: number;
  joined_at: string;
}

interface UserActivity {
  date: string;
  activity_count: number;
}

interface BadgeRow {
  id: string;
  title: string;
  icon: string;
  rarity: string;
}

interface UserBadgeRow {
  badge_id: string;
  earned_at: string;
}

export const useUserStore = create<UserState>((set) => ({
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
  lastActiveMinutesAgo: 0,
  cohortRank: 0,
  joinedAt: "Just now",
  badges: [],
  weeklyGoal: { target: 1000, completed: 0, label: "Earn 1000 XP", resetsIn: "7d" },
  xpHistory: [],
  activityHeatmap: [],

  fetchProfile: async () => {
    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) return;

    const user = session.user;
    
    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single() as { data: Profile | null };

    const userName = (profile?.name ?? (user.user_metadata?.name as string | undefined)) ?? "Student";
    
    if (profile) {
      set({
        id: profile.id,
        name: userName,
        initials: userName.substring(0, 2).toUpperCase(),
        email: profile.email,
        program: profile.program,
        programId: profile.program_id,
        level: profile.level,
        xp: profile.xp,
        xpToNextLevel: profile.xp_to_next_level,
        streak: profile.streak,
        readinessScore: profile.readiness_score,
      });
    } else {
      // Fallback if trigger hasn't fired or user is completely new
      set({
        id: user.id,
        name: userName,
        initials: userName.substring(0, 2).toUpperCase(),
        email: user.email ?? "",
      });
    }

    // Fetch all badges and cross-reference with user_badges
    const { data: allBadges } = await supabase.from('badges').select('*') as { data: BadgeRow[] | null };
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .eq('user_id', user.id) as { data: UserBadgeRow[] | null };

    if (allBadges && allBadges.length > 0) {
      const earnedMap = new Map(userBadges?.map(ub => [ub.badge_id, ub.earned_at]) ?? []);
      const mappedBadges: Badge[] = allBadges.map(b => ({
        id: b.id,
        title: b.title,
        icon: b.icon,
        rarity: b.rarity as "common" | "rare" | "epic" | "legendary",
        isEarned: earnedMap.has(b.id),
        earnedAt: earnedMap.get(b.id) ?? undefined
      }));
      
      set({ badges: mappedBadges });
    } else {
      // Fallback mock badges if DB is empty
      set({
        badges: [
          { id: "1", title: "First Step", icon: "🚀", isEarned: true, rarity: "common", earnedAt: "Oct 12" },
          { id: "2", title: "Fast Learner", icon: "🧠", isEarned: true, rarity: "rare", earnedAt: "Nov 03" },
          { id: "3", title: "Bug Hunter", icon: "🐛", isEarned: false, rarity: "epic" },
          { id: "4", title: "Design Guru", icon: "🎨", isEarned: false, rarity: "rare" },
          { id: "5", title: "Code Ninja", icon: "⚔️", isEarned: false, rarity: "legendary" },
          { id: "6", title: "Team Player", icon: "🤝", isEarned: true, rarity: "common", earnedAt: "Dec 01" },
          { id: "7", title: "7-Day Streak", icon: "🔥", isEarned: true, rarity: "epic", earnedAt: "Dec 15" },
          { id: "8", title: "Top 10%", icon: "👑", isEarned: false, rarity: "legendary" },
        ]
      });
    }

    // Dynamic labels based on profile
    let label = "Novice";
    const level = profile?.level ?? 1;
    if (level >= 5) label = "Intermediate";
    if (level >= 10) label = "Advanced";
    if (level >= 20) label = "Expert";
    
    let badgeLabel = "Beginner";
    const rScore = profile?.readiness_score ?? 0;
    if (rScore >= 40) badgeLabel = "Rising Star";
    if (rScore >= 70) badgeLabel = "Ready";
    if (rScore >= 90) badgeLabel = "Top Talent";
    
    set({ 
      levelLabel: label,
      readinessBadge: badgeLabel,
      cohortRank: Math.min(99, Math.max(1, Math.floor(rScore * 0.8 + 10)))
    });

    // Calculate approximate lifetime XP for the graph (approximation logic removed as unused)

    // Generate XP History based on enrollment date
    const enrollmentDate = profile?.joined_at ? new Date(profile.joined_at) : new Date();
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - enrollmentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.max(1, Math.ceil(diffDays / 7));

    // Fetch actual activity for heatmap AND graph
    const { data: activityData } = await supabase
      .from('user_activity')
      .select('date, activity_count')
      .eq('user_id', user.id)
      .order('date', { ascending: true }) as { data: UserActivity[] | null };

    // Supplement with lesson completion dates to ensure heatmap is never empty for active users
    const { data: lessonProgress } = await supabase
      .from('user_learning_progress')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed') as { data: { completed_at: string | null }[] | null };

    const combinedActivity: UserActivity[] = [...(activityData ?? [])];
    lessonProgress?.forEach(lp => {
      if (lp.completed_at) {
        const dateStr = lp.completed_at.split('T')[0]!;
        const existing = combinedActivity.find(a => a.date === dateStr);
        if (existing) {
          existing.activity_count = (existing.activity_count ?? 0) + 1;
        } else {
          combinedActivity.push({ date: dateStr, activity_count: 1 });
        }
      }
    });

    // Generate a continuous heatmap for the last 6 months (approx 24 weeks)
    const heatmapData: { date: string, count: number }[] = [];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(today.getDate() - (24 * 7));
    
    // Start from the earlier of enrollment or 6 months ago
    const startDate = enrollmentDate < sixMonthsAgo ? enrollmentDate : sixMonthsAgo;
    const tempDate = new Date(startDate);
    
    // Normalize to the start of that week (Sunday)
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() - tempDate.getDay());

    // Normalize today to midnight for comparison
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    set({ joinedAt: enrollmentDate.toLocaleDateString() }); // Use enrollmentDate to avoid unused warning

    while (tempDate <= endOfDay) {
      const dateStr = tempDate.toISOString().split('T')[0];
      if (dateStr) {
        // Robust matching: compare raw strings from DB if possible
        const actual = combinedActivity.find(a => {
          if (!a.date) return false;
          // DB dates are YYYY-MM-DD
          const dbDateStr = typeof a.date === 'string' ? a.date.split('T')[0] : new Date(a.date).toISOString().split('T')[0];
          return dbDateStr === dateStr;
        });
        
        heatmapData.push({
          date: dateStr,
          count: actual?.activity_count ?? 0
        });
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    set({ activityHeatmap: heatmapData });

    if (combinedActivity.length > 0) {
      // Reconstruct XP History from activity
      let currentCumulativeXp = 0;
      const history: { week: string; xp: number }[] = [];
      
      // Group activity by week starting from enrollment
      for (let w = 0; w < totalWeeks; w++) {
        const weekStart = new Date(enrollmentDate);
        weekStart.setDate(weekStart.getDate() + (w * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const weekActivity = combinedActivity.filter(a => {
          if (!a.date) return false;
          const d = new Date(a.date);
          return d >= weekStart && d < weekEnd;
        });

        // Simple estimation: 50 XP per activity count
        const weekGain = weekActivity.reduce((acc, curr) => acc + ((curr.activity_count ?? 0) * 50), 0);
        currentCumulativeXp += weekGain;

        history.push({
          week: `W${w + 1}`,
          xp: Math.min(profile?.xp ?? 0, currentCumulativeXp)
        });
      }
      
      // Ensure the last point matches current XP exactly
      const lastPoint = history[history.length - 1];
      if (lastPoint) {
        lastPoint.xp = profile?.xp ?? 0;
      }

      set({ xpHistory: history });
    } else {
      // Fallback: If no activity records, just show a single point or enrollment-to-now
      set({ 
        xpHistory: [
          { week: 'W1', xp: profile?.xp ?? 0 }
        ],
        activityHeatmap: [] 
      });
    }
  },

  addXP: (amount) =>
    set((state) => {
      const newXP = state.xp + amount;
      const leveledUp = newXP >= state.xpToNextLevel;
      // In a real app, you would also push this change back to Supabase here.
      return {
        xp: leveledUp ? newXP - state.xpToNextLevel : newXP,
        level: leveledUp ? state.level + 1 : state.level,
        xpToNextLevel: leveledUp ? Math.floor(state.xpToNextLevel * 1.5) : state.xpToNextLevel,
      };
    }),
}));
