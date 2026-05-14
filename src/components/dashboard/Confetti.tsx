"use client";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#305EFF", "#3FB950", "#F78166", "#E3B341", "#FF7B72", "#ffffff", "#c0d8ff"];

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length]!,
  x: (Math.random() - 0.5) * 320,
  y: -(Math.random() * 200 + 80),
  rotate: Math.random() * 720 - 360,
  scale: Math.random() * 0.6 + 0.4,
}));

interface Props { active: boolean }

export default function Confetti({ active }: Props) {
  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[400] flex items-center justify-center overflow-hidden">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-2.5 h-2.5 rounded-sm"
              style={{ background: p.color }}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0 }}
              animate={{ opacity: [1, 1, 0], x: p.x, y: p.y, rotate: p.rotate, scale: p.scale }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          ))}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[48px]"
          >
            🎉
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
