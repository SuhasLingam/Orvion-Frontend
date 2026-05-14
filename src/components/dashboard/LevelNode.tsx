"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Check, Lock } from "lucide-react";
import type { LevelNode as LessonNode } from "~/stores/progressStore";

interface Props {
  lesson: LessonNode;
  isActive: boolean;
  tierColor: string;
  showConnector?: boolean;
  onUnlocked?: () => void;
}

export default function LevelNode({ lesson, isActive, tierColor, showConnector = true, onUnlocked }: Props) {
  const [showMsg, setShowMsg] = useState(false);

  function handleClick() {
    if (lesson.status === "locked") { setShowMsg(true); setTimeout(() => setShowMsg(false), 2000); return; }
    if (onUnlocked) onUnlocked();
  }

  const nodeStyle = lesson.status === "locked"
    ? { bg: "#21262D", border: "#30363D", icon: <Lock className="w-5 h-5 text-[#8B949E]" /> }
    : lesson.status === "completed"
    ? { bg: `${tierColor}33`, border: tierColor, icon: <Check className="w-5 h-5" style={{ color: tierColor }} /> }
    : isActive
    ? { bg: `${tierColor}33`, border: tierColor, icon: <Play className="w-5 h-5 ml-0.5" style={{ color: tierColor }} /> }
    : { bg: "#21262D", border: "#30363D44", icon: <div className="w-3 h-3 rounded-full border-2 border-[#8B949E]" /> };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 w-full max-w-sm">
        {/* Node circle */}
        <div className="relative shrink-0">
          <motion.button
            onClick={handleClick}
            whileHover={lesson.status !== "locked" ? { scale: 1.08 } : {}}
            whileTap={lesson.status !== "locked" ? { scale: 0.95 } : {}}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all border-2"
            style={{ background: nodeStyle.bg, borderColor: nodeStyle.border }}
          >
            {isActive && lesson.status !== "locked" && (
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: tierColor }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            {nodeStyle.icon}
          </motion.button>
          {/* Locked tooltip */}
          <AnimatePresence>
            {showMsg && (
              <motion.div
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#21262D] border border-[#30363D] text-[11px] text-[#F0F6FC] px-3 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-lg"
              >
                🔒 Complete previous level first
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lesson info */}
        <div className={`flex-1 min-w-0 ${lesson.status === "locked" ? "opacity-40" : ""}`}>
          <p className={`text-[13px] font-semibold ${isActive ? "text-[#F0F6FC]" : lesson.status === "completed" ? "text-[#8B949E]" : "text-[#F0F6FC]"}`}>
            {lesson.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-[#8B949E]">{lesson.duration}</span>
            {isActive && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${tierColor}22`, color: tierColor }}>Up Next</span>}
          </div>
        </div>
      </div>

      {showConnector && (
        <div className="w-0.5 h-6 my-1 rounded-full" style={{ background: lesson.status === "completed" ? tierColor : "#30363D" }} />
      )}
    </div>
  );
}
