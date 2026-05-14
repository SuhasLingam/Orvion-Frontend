"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Award, TrendingUp, Flame } from "lucide-react";
import { useNotifStore, type Toast } from "~/stores/notifStore";

const ICONS: Record<Toast["type"], React.ReactNode> = {
  xp:     <Zap className="w-4 h-4 text-[#3FB950]" />,
  badge:  <Award className="w-4 h-4 text-[#E3B341]" />,
  level:  <TrendingUp className="w-4 h-4 text-[#305EFF]" />,
  streak: <Flame className="w-4 h-4 text-[#F78166]" />,
  info:   <Zap className="w-4 h-4 text-[#8B949E]" />,
};

const BG: Record<Toast["type"], string> = {
  xp:     "#3FB95022",
  badge:  "#E3B34122",
  level:  "#305EFF22",
  streak: "#F7816622",
  info:   "#21262D",
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useNotifStore((s) => s.dismissToast);

  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), 4500);
    return () => clearTimeout(t);
  }, [toast.id, dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0,  scale: 1   }}
      exit={{    opacity: 0, x: 60, scale: 0.9  }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex items-start gap-3 w-[300px] px-4 py-3.5 rounded-2xl border border-[#30363D] shadow-2xl"
      style={{ background: "#161B22" }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: BG[toast.type] }}
      >
        {ICONS[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#F0F6FC] leading-snug">{toast.title}</p>
        {toast.body && <p className="text-[11px] text-[#8B949E] mt-0.5 leading-snug">{toast.body}</p>}
      </div>
      <button onClick={() => dismiss(toast.id)} className="shrink-0 text-[#8B949E] hover:text-[#F0F6FC] transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export default function MilestoneToast() {
  const toasts = useNotifStore((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
