"use client";

import { motion } from "framer-motion";
import { Check, Lock, Play, Star } from "lucide-react";
import { useProgressStore } from "~/stores/progressStore";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { programs } from "~/data/programs";

export default function LearnPage() {
  const router = useRouter();
  const { learningPath, subProgress } = useProgressStore();
  const allLessons = learningPath;
  const done = allLessons.filter((l) => l.status === "completed").length;
  const total = allLessons.length;
  const currentId = allLessons.find((l) => l.status === "active")?.id ?? null;
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [nodeCenters, setNodeCenters] = useState<{x: number, y: number}[]>([]);

  useEffect(() => {
    let animationFrameId: number;

    const updatePath = () => {
      if (!svgRef.current) return;
      const svgRect = svgRef.current.getBoundingClientRect();
      const centers = nodeRefs.current.map(node => {
        if (!node) return { x: 0, y: 0 };
        const rect = node.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - svgRect.left,
          y: rect.top + rect.height / 2 - svgRect.top,
        };
      });
      
      // Only update state if coordinates actually changed to prevent infinite re-renders
      setNodeCenters(prev => {
        if (prev.length !== centers.length) return centers;
        const hasChanged = centers.some((pt, i) => {
          const prevPt = prev[i];
          if (!prevPt) return true;
          return Math.abs(pt.x - prevPt.x) > 1 || Math.abs(pt.y - prevPt.y) > 1;
        });
        return hasChanged ? centers : prev;
      });
      
      // Keep tracking in case of CSS transitions
      animationFrameId = requestAnimationFrame(updatePath);
    };

    updatePath();

    // Use ResizeObserver for structural changes
    const observer = new ResizeObserver(() => {
      updatePath();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updatePath);
    return () => {
      window.removeEventListener('resize', updatePath);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [allLessons]);

  const handleStartLearning = (lessonId: string) => {
    router.push(`/dashboard/learn/${lessonId}`);
  };

  // Duolingo-style zigzag pattern (values in pixels)
  const getOffset = (i: number) => {
    const pattern = [0, 90, 160, 90, 0, -90, -160, -90];
    return pattern[i % pattern.length];
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-32 pt-4 relative overflow-x-hidden md:overflow-x-visible">
      
      {/* ── Sticky Progress indicator (Bottom Right) ── */}
      <div className="fixed bottom-8 right-8 z-50 bg-white rounded-full p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#E2E8F0]">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
            <circle 
              cx="50" cy="50" r="44" fill="transparent" stroke="#305EFF" strokeWidth="8" 
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPct) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <TrendingUpIcon className="w-4 h-4 text-[#305EFF] mb-0.5" />
            <span className="text-[13px] font-extrabold text-[#1A202C] leading-none">{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
        <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#2C2A29] mb-3">Your Learning Journey</h2>
        <p className="text-[16px] text-[#7A7571] font-medium">Follow the path from beginner to placement-ready professional</p>
      </motion.div>

      {/* ── Journey Map ── */}
      <div className="relative w-full flex flex-col items-center" ref={containerRef}>
        
        {/* Dynamic Connected Wavy Line */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
          <svg className="w-full h-full" ref={svgRef}>
            {nodeCenters.length > 1 && nodeCenters[0] && (
              <path 
                d={`M ${nodeCenters[0].x} ${nodeCenters[0].y} ` + nodeCenters.slice(1).map((pt, i) => {
                  const prev = nodeCenters[i];
                  if (!prev) return "";
                  // Control points to create a smooth bezier curve between nodes
                  const midY = (prev.y + pt.y) / 2;
                  return `C ${prev.x} ${midY}, ${pt.x} ${midY}, ${pt.x} ${pt.y}`;
                }).join(" ")}
                stroke="#CBD5E1" strokeWidth="10" fill="none" strokeLinecap="round" 
              />
            )}
            
            {/* Draw a subtle inner line for depth */}
            {nodeCenters.length > 1 && nodeCenters[0] && (
              <path 
                d={`M ${nodeCenters[0].x} ${nodeCenters[0].y} ` + nodeCenters.slice(1).map((pt, i) => {
                  const prev = nodeCenters[i];
                  if (!prev) return "";
                  const midY = (prev.y + pt.y) / 2;
                  return `C ${prev.x} ${midY}, ${pt.x} ${midY}, ${pt.x} ${pt.y}`;
                }).join(" ")}
                stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" 
              />
            )}
          </svg>
        </div>

        {allLessons.map((lesson, i) => {
          const isLeft = i % 2 === 0;
          const isCompleted = lesson.status === "completed";
          const isActive = lesson.status === "active" || lesson.id === currentId;
          const isLocked = lesson.status === "locked";

          // Calculate granular progress for this node
          let nodeProgress = isCompleted ? 100 : 0;
          if (isActive) {
            const parts = lesson.id.split('_');
            const pId = parts[1];
            const mIdx = parseInt(parts[2]?.replace('m', '') ?? "0");
            const wIdx = parseInt(parts[3]?.replace('w', '') ?? "0");
            const program = programs.find(p => p.id === pId);
            const topics = program?.curriculum?.[mIdx]?.weeks?.[wIdx]?.topics;
            
            if (topics && topics.length > 0) {
              const completedCount = subProgress[lesson.id]?.length ?? 0;
              nodeProgress = Math.round((completedCount / topics.length) * 100);
            }
          }

          return (
            <div 
              key={lesson.id} 
              style={{ '--desktop-offset': `${getOffset(i)}px` } as React.CSSProperties}
              className={`relative flex items-center w-full max-w-[900px] px-4 md:px-0 mb-12 md:mb-20 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row translate-x-0 md:translate-x-[var(--desktop-offset)] transition-transform duration-500`}
            >
              
              {/* Card (Left or Right on desktop, always right on mobile) */}
              <motion.div 
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full md:w-[46%] z-10 pl-24 md:pl-0"
              >
                <div className={`bg-white rounded-[24px] p-6 border ${isActive ? 'border-[#305EFF] shadow-[0_8px_30px_rgba(48,94,255,0.15)]' : 'border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'} relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                  
                  {isLocked && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-20" />}
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[11px] font-black text-[#94A3B8] uppercase tracking-widest">
                      {lesson.type === 'video' ? 'LEARNING' : lesson.type === 'quiz' ? 'EVALUATION' : 'PROJECT'}
                    </span>
                    <div className="bg-[#F1F5F9] px-3 py-1 rounded-full flex items-center gap-1 border border-[#E2E8F0]">
                      <Star className={`w-3.5 h-3.5 ${isCompleted ? 'text-[#305EFF]' : 'text-[#94A3B8]'}`} fill={isCompleted ? "currentColor" : "none"} />
                      <span className="text-[12px] font-bold text-[#4A5568]">{lesson.xpReward}</span>
                    </div>
                  </div>

                  <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#1A202C] mb-1">{lesson.title}</h3>
                  <p className="text-[13px] font-medium text-[#4A5568] mb-6 leading-relaxed line-clamp-2">{lesson.description}</p>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[12px] font-bold text-[#4A5568]">Progress</span>
                      <span className="text-[12px] font-extrabold text-[#1A202C]">{nodeProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#305EFF] transition-all duration-500" style={{ width: `${nodeProgress}%` }} />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (isActive || isCompleted) handleStartLearning(lesson.id);
                    }}
                    disabled={isLocked}
                    className={`w-full py-3.5 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                    isCompleted ? 'bg-gradient-to-r from-[#305EFF] to-[#1E3A8A] text-white shadow-md hover:opacity-90' :
                    isActive ? 'bg-gradient-to-r from-[#305EFF] to-[#254EDB] text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]' :
                    'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                  }`}>
                    {isCompleted ? 'Review' : isActive ? 'Start Learning' : 'Locked'}
                    {!isLocked && <Play className="w-4 h-4 fill-current ml-1" />}
                  </button>

                </div>
              </motion.div>

              {/* Node Circle on Path (Center on desktop, Left on mobile) */}
              <div className="absolute left-6 md:static md:w-[8%] flex justify-center z-20">
                <div>
                  <motion.div 
                    ref={el => { nodeRefs.current[i] = el; }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-[6px] border-white ${
                      isCompleted ? 'bg-[#305EFF] text-white' : 
                      isActive ? 'bg-[#1E3A8A] text-white' : 
                      'bg-[#E2E8F0] text-[#94A3B8]'
                    } relative`}
                  >
                    {/* Pulsing ring for active node */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-full animate-ping border-2 border-[#305EFF] opacity-20"></span>
                    )}
                    
                    {isCompleted ? <Check className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} /> :
                     isLocked ? <Lock className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} /> :
                     <Star className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" />}
                  </motion.div>
                </div>
              </div>

              {/* Empty space for alignment */}
              <div className="hidden md:block md:w-[46%]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Simple icon for the progress widget
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
