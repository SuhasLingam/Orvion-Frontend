"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "~/stores/userStore";
import MilestoneToast from "~/components/dashboard/MilestoneToast";
import {
  Star, Flame, Trophy, LayoutDashboard, Map, FolderKanban, MessageSquare, Sparkles, User, LogOut, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "~/utils/supabase/client";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learn", label: "Journey", icon: Map },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/interviews", label: "Interviews", icon: MessageSquare },
  { href: "/dashboard/ai", label: "AI Insights", icon: Sparkles },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { name, program, level, xp, streak, badges } = useUserStore();
  const earnedBadges = badges.filter(b => b.isEarned).length;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['SF_Pro_Display'] flex text-[#1A202C]">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-[260px] shrink-0 bg-white border-r border-[#E5E7EB] sticky top-0 h-screen p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="relative w-8 h-8">
            <Image src="/logo.svg" alt="Orvion Logo" fill className="object-contain" />
          </div>
          <span className="text-[20px] font-heading font-medium tracking-widest text-black uppercase">
            Orvion
          </span>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3.5 rounded-[16px] text-[15px] font-bold transition-all flex items-center gap-3 ${active
                  ? "bg-[#305EFF] text-white shadow-[0_4px_12px_rgba(48,94,255,0.2)]"
                  : "text-[#7A7571] hover:bg-[#EEF2F8] hover:text-[#305EFF]"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto px-4 py-3.5 rounded-[16px] text-[15px] font-bold transition-colors flex items-center gap-3 text-[#FF6B6B] hover:bg-[#FFF0F0]"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-grow flex flex-col min-w-0">

        {/* Mobile Header & Nav (Hidden on Desktop) */}
        <div className="md:hidden flex flex-col bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
          <div className="flex items-center justify-between p-4 border-b border-[#F0ECE1]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-[#2C2A29] hover:bg-[#FDFBF7] rounded-full transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6">
                  <Image src="/logo.svg" alt="Orvion Logo" fill className="object-contain" />
                </div>
                <span className="text-[16px] font-heading font-medium tracking-widest text-[#305EFF] uppercase">
                  Orvion
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-[#FF6B6B] bg-[#FFF0F0] rounded-full">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 z-50 md:hidden backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 flex flex-col p-6 shadow-2xl md:hidden overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-10 px-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                      <Image src="/logo.svg" alt="Orvion Logo" fill className="object-contain" />
                    </div>
                    <span className="text-[20px] font-heading font-medium tracking-widest text-[#305EFF] uppercase">
                      Orvion
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#7A7571] hover:bg-[#FDFBF7] rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-2 flex-grow">
                  {NAV.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3.5 rounded-[16px] text-[15px] font-bold transition-all flex items-center gap-3 ${active
                          ? "bg-[#305EFF] text-white shadow-[0_4px_12px_rgba(48,94,255,0.2)]"
                          : "text-[#4A5568] hover:bg-[#EEF2F8] hover:text-[#305EFF]"
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <button
                  onClick={handleLogout}
                  className="mt-8 px-4 py-3.5 rounded-[16px] text-[15px] font-bold transition-colors flex items-center gap-3 text-[#FF6B6B] hover:bg-[#FFF0F0]"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Dashboard Content Container */}
        <div className="w-full max-w-[1200px] mx-auto px-5 md:px-10 py-8 md:py-12 flex-grow">

          {/* Header Section */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-12 min-w-0">
            <div className="min-w-0">
              <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-[38px] font-extrabold text-[#1A202C] mb-2 leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Welcome back, {name}! <span className="inline-block ml-1 text-3xl md:text-4xl">👋</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-[#4A5568] text-[16px] font-medium"
              >
                {program} • Level {level}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="flex flex-nowrap items-center gap-3 overflow-x-auto no-scrollbar pb-2 xl:pb-0 w-full xl:w-auto"
            >
              {/* Stat Pills */}
              <div className="bg-white rounded-[20px] px-5 py-3 flex items-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E2E8F0]">
                <div className="w-11 h-11 rounded-full bg-[#305EFF] flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[19px] font-extrabold text-[#1A202C] leading-tight">{xp}</span>
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Total XP</span>
                </div>
              </div>

              <div className="bg-white rounded-[20px] px-5 py-3 flex items-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E2E8F0]">
                <div className="w-11 h-11 rounded-full bg-[#FF6B6B] flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[19px] font-extrabold text-[#1A202C] leading-tight">{streak}</span>
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Day Streak</span>
                </div>
              </div>

              <div className="bg-white rounded-[20px] px-5 py-3 flex items-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E2E8F0]">
                <div className="w-11 h-11 rounded-full bg-[#305EFF] flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[19px] font-extrabold text-[#1A202C] leading-tight">{earnedBadges}</span>
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Badges</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Page Content */}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
      <MilestoneToast />
    </div>
  );
}
