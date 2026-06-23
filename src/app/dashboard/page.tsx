"use client";

import { useEffect } from "react";
import {
  BookOpen,
  Calendar,
  MessageSquare,
  Download,
  FileText,
  Play,
  CheckCircle2,
  Eye,
  Clock,
  Trophy,
} from "lucide-react";
import { useUserStore } from "~/stores/userStore";
import { useInsightStore } from "~/stores/insightStore";
import { useProgressStore } from "~/stores/progressStore";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import StreakBanner from "~/components/dashboard/StreakBanner";
import LLMInsightCard from "~/components/dashboard/LLMInsightCard";
import Link from "next/link";

export default function DashboardPage() {
  const {
    xpHistory,
    readinessScore,
    readinessBadge,
    streak,
    lastActiveMinutesAgo,
    weeklyGoal,
    leaderboard,
    cohortRank,
  } = useUserStore();
  const {
    isLoading: insightLoading,
    lastFetchedMinutesAgo,
    tipOfDay,
    fetchInsights,
    refreshInsights,
  } = useInsightStore();
  const { learningPath, projects, interviews, fetchProgress, isLoading } =
    useProgressStore();

  useEffect(() => {
    if (learningPath.length === 0) {
      void fetchProgress();
    }
    void fetchInsights();
  }, [fetchProgress, fetchInsights, learningPath.length]);

  const totalLessons = learningPath.length;
  const completedLessons = learningPath.filter(
    (l) => l.status === "completed",
  ).length;
  const watchedLessons = learningPath.filter(
    (l) => l.type === "video" && l.status === "completed",
  ).length;
  const pct =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const learningPct = pct;
  const projectsPct =
    projects.length > 0
      ? Math.round(
          (projects.filter((p) => p.status === "completed").length /
            projects.length) *
            100,
        )
      : 0;
  const interviewsPct =
    Math.min(100, Math.round((interviews.length / 5) * 100)) || 0;

  const dynamicReadiness =
    readinessScore > 0
      ? readinessScore
      : Math.round(learningPct * 0.4 + projectsPct * 0.4 + interviewsPct * 0.2);

  const readinessStatus =
    readinessBadge ||
    (() => {
      if (dynamicReadiness >= 90) return "Elite Talent";
      if (dynamicReadiness >= 75) return "Placement Ready";
      if (dynamicReadiness >= 50) return "Rising Star";
      if (dynamicReadiness >= 20) return "Making Progress";
      return "Starting Out";
    })();

  const quickActions = [
    {
      label: "Continue Learning",
      sub: "Resume where you left off",
      icon: Play,
      href: "/dashboard/learn",
    },
    {
      label: "Schedule Session",
      sub: "Book 1-on-1 mentoring",
      icon: Calendar,
      href: "/dashboard/interviews",
    },
    {
      label: "Mock Interview",
      sub: "Practice with AI mentor",
      icon: MessageSquare,
      href: "/dashboard/interviews",
    },
    {
      label: "Get Certificate",
      sub: "Download progress report",
      icon: Download,
      href: "/dashboard/profile",
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* ── Streak Banner + Weekly Goal ─────────────────────── */}
      <StreakBanner
        streak={streak}
        lastActiveMinutesAgo={lastActiveMinutesAgo}
        weeklyGoal={weeklyGoal}
        streakBroke={streak === 0 && lastActiveMinutesAgo > 24 * 60}
      />

      {/* ── Quick Actions Row ───────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {quickActions.map((action, i) => (
          <Link href={action.href} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex h-full cursor-pointer flex-col items-start rounded-[24px] border border-[#E2E8F0] bg-white p-5 text-left shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-md md:p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E8F0] text-[#305EFF] transition-colors group-hover:bg-[#305EFF] group-hover:text-white">
                <action.icon className="ml-0.5 h-4 w-4" strokeWidth={2.5} />
              </div>
              <h4 className="mb-1 text-[15px] font-extrabold text-[#1A202C]">
                {action.label}
              </h4>
              <p className="text-[12px] leading-snug font-medium text-[#4A5568]">
                {action.sub}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* ── View Sample Test Result ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/dashboard/tests">
          <button className="flex items-center gap-2 rounded-full bg-[#305EFF] px-6 py-3.5 font-bold text-white shadow-md transition-colors hover:bg-[#254EDB]">
            <FileText className="h-4 w-4" /> View Sample Test Result
          </button>
        </Link>
      </motion.div>

      {/* ── Main Dashboard Columns ──────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (Span 2) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Learning Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-[28px] border border-[#E2E8F0] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[20px] font-extrabold text-[#1A202C]">
                Learning Progress
              </h3>
              <span className="flex items-center gap-2 text-[14px] font-bold text-[#4A5568]">
                <BookOpen className="h-4 w-4" />
                {isLoading ? (
                  <span className="inline-block h-4 w-12 animate-pulse rounded bg-[#E2E8F0]" />
                ) : (
                  `${completedLessons}/${totalLessons}`
                )}
              </span>
            </div>

            <div className="mb-8">
              <div className="mb-3 flex items-end justify-between">
                <span className="text-[13px] font-semibold text-[#4A5568]">
                  Overall Completion
                </span>
                <span className="text-[18px] font-extrabold text-[#1A202C]">
                  {pct}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-[#305EFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                    >
                      <div className="mb-3 h-5 w-5 rounded-full bg-[#E2E8F0]" />
                      <div className="mb-1 h-6 w-8 rounded bg-[#E2E8F0]" />
                      <div className="h-3 w-16 rounded bg-[#E2E8F0]" />
                    </div>
                  ))
                : [
                    {
                      val: completedLessons,
                      label: "Completed",
                      icon: CheckCircle2,
                    },
                    { val: watchedLessons, label: "Watched", icon: Eye },
                    {
                      val: totalLessons - completedLessons,
                      label: "Pending",
                      icon: Clock,
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-start rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                    >
                      <stat.icon className="mb-3 h-5 w-5 text-[#305EFF]" />
                      <span className="mb-1 text-[24px] leading-none font-extrabold text-[#2C2A29]">
                        {stat.val}
                      </span>
                      <span className="text-[12px] font-semibold text-[#7A7571]">
                        {stat.label}
                      </span>
                    </div>
                  ))}
            </div>
          </motion.div>

          {/* Performance Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-[28px] border border-[#E2E8F0] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:p-8"
          >
            <h3 className="mb-6 text-[20px] font-extrabold text-[#1A202C]">
              Performance Trend
            </h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={xpHistory}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      fontWeight: "bold",
                      color: "#1A202C",
                    }}
                    itemStyle={{ color: "#305EFF" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="xp"
                    stroke="#305EFF"
                    strokeWidth={3}
                    dot={{
                      r: 6,
                      fill: "#305EFF",
                      strokeWidth: 2,
                      stroke: "#FFFFFF",
                    }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Placement Readiness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="relative flex flex-col items-center overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <div className="mb-8 flex w-full items-center justify-between">
              <h3 className="text-[18px] font-extrabold text-[#1A202C]">
                Placement Readiness
              </h3>
            </div>

            <div className="relative mb-6 flex h-40 w-40 items-center justify-center">
              <svg
                className="h-full w-full -rotate-90 transform"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#305EFF"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{
                    strokeDashoffset: 251.2 - (251.2 * dynamicReadiness) / 100,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[42px] leading-none font-extrabold text-[#1A202C]">
                  {dynamicReadiness}
                </span>
                <span className="mt-1 text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
                  out of 100
                </span>
              </div>
            </div>

            <div className="mb-8 rounded-full bg-[#305EFF] px-5 py-1.5 text-[13px] font-bold text-white shadow-sm">
              {readinessStatus}
            </div>

            <div className="grid w-full grid-cols-3 gap-2">
              {[
                { val: `${learningPct}%`, label: "Learning" },
                { val: `${projectsPct}%`, label: "Projects" },
                { val: `${interviewsPct}%`, label: "Interviews" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-center"
                >
                  <span className="mb-1 text-[14px] font-black text-[#1A202C]">
                    {s.val}
                  </span>
                  <span className="text-[10px] leading-tight font-semibold text-[#4A5568]">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Insight Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <LLMInsightCard
              tip={tipOfDay}
              lastFetchedMinutesAgo={lastFetchedMinutesAgo}
              isLoading={insightLoading}
              onRefresh={refreshInsights}
            />
          </motion.div>

          {/* Cohort Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-[28px] border border-[#E2E8F0] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[18px] font-extrabold text-[#1A202C]">
                Cohort Ranking
              </h3>
              <Trophy className="h-5 w-5 text-[#305EFF]" />
            </div>
            {leaderboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                <Trophy className="h-8 w-8 text-[#E2E8F0]" />
                <p className="text-[13px] font-medium text-[#94A3B8]">
                  Leaderboard loading…
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {leaderboard.slice(0, 5).map((entry, i) => {
                    const rankColors = ["#F59E0B", "#94A3B8", "#CD7C3F"];
                    const isMe = entry.rank === cohortRank;
                    return (
                      <div
                        key={entry.user_id}
                        className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition-colors ${isMe ? "border border-[#305EFF33] bg-[#EFF6FF]" : "hover:bg-[#F8FAFC]"}`}
                      >
                        <span
                          className="w-5 text-center text-[13px] font-extrabold"
                          style={{ color: rankColors[i] ?? "#94A3B8" }}
                        >
                          {entry.rank}
                        </span>
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                          style={{
                            background: isMe ? "#305EFF22" : "#F1F5F9",
                            color: isMe ? "#305EFF" : "#4A5568",
                          }}
                        >
                          {entry.initials ??
                            entry.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span
                          className={`flex-1 text-[13px] font-bold ${isMe ? "text-[#305EFF]" : "text-[#1A202C]"}`}
                        >
                          {entry.name}
                          {isMe && (
                            <span className="ml-1 text-[10px] font-medium text-[#305EFF]">
                              (you)
                            </span>
                          )}
                        </span>
                        <span className="text-[13px] font-extrabold text-[#305EFF]">
                          {entry.xp.toLocaleString()} xp
                        </span>
                      </div>
                    );
                  })}
                </div>
                {cohortRank > 0 && (
                  <p className="mt-4 text-center text-[11px] font-medium text-[#94A3B8]">
                    You&apos;re ahead of {Math.max(0, 100 - cohortRank)}% of
                    your batch
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
