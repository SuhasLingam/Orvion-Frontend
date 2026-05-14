"use client";

import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore } from "~/stores/userStore";
import { useNotifStore } from "~/stores/notifStore";

interface Props {
  onMenuClick: () => void;
  pageTitle: string;
}

export default function Topbar({ onMenuClick, pageTitle }: Props) {
  const { initials, name, readinessBadge, readinessScore } = useUserStore();
  const { notifications, unreadCount, markAllAsRead } = useNotifStore();
  const [showNotif, setShowNotif] = useState(false);


  return (
    <header className="shrink-0 h-16 flex items-center justify-between px-5 border-b border-[#30363D] bg-[#161B22] z-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-bold text-[#F0F6FC]">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif((v) => !v); markAllAsRead(); }}
            className="relative p-1.5 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#F78166] rounded-full" />
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{    opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-[300px] bg-[#21262D] border border-[#30363D] rounded-2xl shadow-2xl z-20 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[#30363D] flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#F0F6FC]">Notifications</span>
                    <button onClick={() => setShowNotif(false)}>
                      <X className="w-4 h-4 text-[#8B949E]" />
                    </button>
                  </div>
                  <div className="divide-y divide-[#30363D] max-h-[280px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 text-[12px] leading-snug ${n.read ? "text-[#8B949E]" : "text-[#F0F6FC] bg-[#30363D22]"}`}>
                        <p className="text-[12px] font-bold text-[#F0F6FC]">{n.title}</p>
                        <p className="text-[11px] text-[#8B949E] mt-0.5 leading-snug">{n.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[12px] font-semibold text-[#F0F6FC]">{name}</span>
            <span className="text-[10px] text-[#8B949E]">{readinessBadge} · {readinessScore}/100</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#305EFF] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black text-white">{initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
