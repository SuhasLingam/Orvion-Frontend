"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[#305EFF] origin-left z-[100] drop-shadow-sm"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
