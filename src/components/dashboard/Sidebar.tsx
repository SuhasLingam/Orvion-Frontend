"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Mic,
  Rocket,
  Sparkles,
  User,
  Flame,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useUserStore } from "~/stores/userStore";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learn", label: "Learning Path", icon: BookOpen },
  { href: "/dashboard/tests", label: "Tests", icon: ClipboardList },
  { href: "/dashboard/interviews", label: "Interviews", icon: Mic },
  { href: "/dashboard/projects", label: "Projects", icon: Rocket },
  { href: "/dashboard/ai", label: "AI Insights", icon: Sparkles },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

interface Props {
  onNav?: () => void;
}

export default function Sidebar({ onNav }: Props) {
  const pathname = usePathname();
  const { name, initials, streak, level, levelLabel } = useUserStore();

  return (
    <div className="flex flex-col h-full bg-[#161B22] border-r border-[#30363D]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[#30363D] shrink-0">
        <Image src="/logo.svg" alt="Orvion Logo" width={28} height={28} className="object-contain" />
        <span className="text-[15px] font-extrabold text-[#F0F6FC]">Orvion</span>
        <span className="text-[10px] text-[#305EFF] font-bold bg-[#305EFF22] px-1.5 py-0.5 rounded-full ml-auto">Beta</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${active
                ? "bg-[#305EFF] text-white shadow-[0_2px_12px_rgba(48,94,255,0.35)]"
                : "text-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC]"
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: streak + user chip */}
      <div className="shrink-0 px-3 pb-4 space-y-2 border-t border-[#30363D] pt-3">
        {/* Streak chip */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F7816622] border border-[#F7816633]">
          <Flame className="w-4 h-4 text-[#F78166]" />
          <span className="text-[13px] font-bold text-[#F78166]">{streak}-day streak</span>
        </div>

        {/* User chip */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#21262D]">
          <div className="w-7 h-7 rounded-full bg-[#305EFF] flex items-center justify-center shrink-0">
            <span className="text-[10px] font-black text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-[#F0F6FC] truncate">{name}</p>
            <p className="text-[10px] text-[#8B949E] truncate">Lvl {level} · {levelLabel}</p>
          </div>
        </div>

        {/* Back to site */}
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-[11px] text-[#8B949E] hover:text-[#F0F6FC] transition-colors mb-1"
        >
          <ExternalLink className="w-3 h-3" />
          Back to Orvion site
        </Link>
        {/* Logout */}
        <button
          onClick={() => {
            void import("~/utils/api").then(({ clearToken }) => {
              clearToken();
              window.location.href = "/";
            });
          }}
          className="flex w-full items-center gap-2 px-3 py-2 text-[11px] text-[#FF7B72] hover:bg-[#FF7B7211] rounded-xl transition-colors"
        >
          <LogOut className="w-3 h-3" />
          Log Out
        </button>
      </div>
    </div>
  );
}
