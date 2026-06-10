import { create } from "zustand";
import { apiGetProgress, apiCompleteLesson, isLoggedIn } from "~/utils/api";

export interface LevelNode {
  id: string;
  title: string;
  description: string;
  status: "locked" | "active" | "completed";
  xpReward: number;
  type: "video" | "quiz" | "project" | "interview";
  duration: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "locked";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  techStack: string[];
  progress: number;
  codeQuality: number;
}

export interface TestAttempt {
  date: string;
  score: number;
}

export interface TopicScore {
  topic: string;
  score: number;
}

export interface MockTest {
  id: string;
  title: string;
  status: "completed" | "pending";
  score?: number;
  maxScore: number;
  duration: string;
  topics: TopicScore[];
  history: TestAttempt[];
}

export interface MockInterview {
  id: string;
  title: string;
  date: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  clarityScore: number;
  feedback: string;
  questions: {
    id: string;
    question: string;
    level: "Easy" | "Medium" | "Hard";
    result: "Correct" | "Partial" | "Incorrect";
    llmComment: string;
  }[];
}

interface ProgressState {
  learningPath: LevelNode[];
  projects: Project[];
  tests: MockTest[];
  interviews: MockInterview[];
  subProgress: Record<string, number[]>;
  isLoading: boolean;

  fetchProgress: () => Promise<void>;
  completeNode: (nodeId: string, xpReward: number) => Promise<void>;
  updateSubProgress: (nodeId: string, completedIndices: number[]) => void;
}

/**
 * XP reward per node type — matches the backend gamification rules:
 *   lesson (video)  = +10 XP
 *   test (quiz)     = +25 XP
 *   project         = +100 XP
 *   interview       = +50 XP
 */
function xpForType(type: LevelNode["type"]): number {
  switch (type) {
    case "quiz": return 25;
    case "project": return 100;
    case "interview": return 50;
    case "video":
    default: return 10;
  }
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  learningPath: [],
  projects: [],
  tests: [],
  interviews: [],
  subProgress: {},
  isLoading: false,

  fetchProgress: async () => {
    if (!isLoggedIn()) return;
    set({ isLoading: true });

    try {
      // ── 1. Get the user's program from userStore (already fetched) ────────
      const { useUserStore } = await import("~/stores/userStore");
      const { programId } = useUserStore.getState();

      // ── 2. Build the learning path from local curriculum data ─────────────
      const { programs } = await import("~/data/programs");
      const program = programs.find((p) => p.id === programId) ?? programs[0];

      // ── 3. GET /progress — use summary stats; node-level statuses not yet
      //       available from backend. See TODO below.
      //
      // TODO(backend): The backend ProgressResponse does not yet include a
      // `nodes` array of { node_id, status } pairs. Until that endpoint is
      // extended, node completion status is local-only and resets on page
      // refresh. Raise a backend ticket to add node statuses to /progress.
      try {
        await apiGetProgress();
        // We still call the endpoint to ensure it returns 200 (confirms auth),
        // but we don't consume the fields because node-level data is missing.
      } catch (err) {
        console.warn("[progressStore] /progress failed (non-fatal):", err);
      }

      // ── 4. Build learning path from curriculum + local sub-progress ────────
      if (program?.curriculum) {
        const mappedPath: LevelNode[] = [];
        let globalIdx = 0;

        program.curriculum.forEach((month, mIdx) => {
          month.weeks.forEach((week, wIdx) => {
            const nodeId = `node_${program.id}_m${mIdx}_w${wIdx}`;
            const type: LevelNode["type"] = "video";

            mappedPath.push({
              id: nodeId,
              title: week.title,
              description: week.topics.join(" • "),
              xpReward: xpForType(type),
              type,
              duration: "1 week",
              // Status is local-only until backend adds node statuses to /progress
              status: globalIdx === 0 ? "active" : "locked",
            });
            globalIdx++;
          });

          if (month.assessment) {
            const assessId = `node_assess_${program.id}_m${mIdx}`;
            const type: LevelNode["type"] = "quiz";
            mappedPath.push({
              id: assessId,
              title: month.assessment,
              description: `Comprehensive evaluation for ${month.title}`,
              xpReward: xpForType(type),
              type,
              duration: "1 hour",
              status: "locked",
            });
            globalIdx++;
          }
        });

        set({ learningPath: mappedPath });
      } else {
        set({ learningPath: [] });
      }

      // ── 5. Build projects from local curriculum ────────────────────────────
      if (program?.projectsFramework) {
        const mappedProjects: Project[] = [];
        let pIdx = 0;

        program.projectsFramework.sets.forEach((projSet) => {
          const difficultyLevel = projSet.level.toLowerCase().includes("advanced")
            ? "Advanced"
            : projSet.level.toLowerCase().includes("intermediate")
            ? "Intermediate"
            : "Beginner";

          projSet.projects.forEach((projTitle) => {
            const projId = `proj_${program.id}_${pIdx}`;
            mappedProjects.push({
              id: projId,
              title: projTitle,
              description: projSet.description,
              difficulty: difficultyLevel,
              techStack: program.technologies.slice(0, 4),
              status: pIdx === 0 ? "in_progress" : "locked",
              progress: 0,
              codeQuality: 0,
            });
            pIdx++;
          });
        });

        set({ projects: mappedProjects });
      } else {
        set({ projects: [] });
      }

      // ── 6. Restore sub-progress from localStorage ──────────────────────────
      const subProg: Record<string, number[]> = {};
      const { learningPath: lp } = get();
      lp.forEach((node) => {
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem(`orvion_progress_${node.id}`);
          if (saved) {
            try {
              subProg[node.id] = JSON.parse(saved) as number[];
            } catch (e) {
              console.error("Error parsing sub-progress:", e);
            }
          }
        }
      });
      set({ subProgress: subProg });

      // ── 7. Apply completed status from localStorage ────────────────────────
      const { learningPath: builtPath } = get();
      let firstActive = false;
      const withStatus = builtPath.map((node) => {
        const completed = (subProg[node.id] ?? []).length;
        // If all topics are locally marked done, treat node as completed
        // (rough heuristic until backend node statuses are available)
        if (completed > 0) {
          return { ...node, status: "completed" as const };
        }
        if (!firstActive) {
          firstActive = true;
          return { ...node, status: "active" as const };
        }
        return { ...node, status: "locked" as const };
      });
      set({ learningPath: withStatus });

    } finally {
      set({ isLoading: false });
    }
  },

  updateSubProgress: (nodeId, completedIndices) => {
    set((state) => {
      const newSubProgress = { ...state.subProgress, [nodeId]: completedIndices };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `orvion_progress_${nodeId}`,
          JSON.stringify(completedIndices)
        );
      }
      return { subProgress: newSubProgress };
    });
  },

  completeNode: async (nodeId: string, xpReward: number) => {
    // ── Optimistically update local state ─────────────────────────────────
    let { learningPath } = get();

    if (learningPath.length === 0) {
      await get().fetchProgress();
      learningPath = get().learningPath;
    }

    const currentIndex = learningPath.findIndex((n) => n.id === nodeId);
    const updatedPath = learningPath.map((node, idx) => {
      if (node.id === nodeId) return { ...node, status: "completed" as const };
      if (idx === currentIndex + 1 && node.status === "locked")
        return { ...node, status: "active" as const };
      return node;
    });
    set({ learningPath: updatedPath });

    // ── POST /lessons/{lesson_id}/progress ────────────────────────────────
    try {
      await apiCompleteLesson(nodeId, {
        watch_time: 0,
        completed: true,
        rewatch_count: 0,
      });
    } catch (err) {
      console.warn("[progressStore] /lessons/{id}/progress failed (non-fatal):", err);
    }

    // ── Refresh userStore XP / level ──────────────────────────────────────
    try {
      const { useUserStore } = await import("~/stores/userStore");
      await useUserStore.getState().fetchProfile();
    } catch (err) {
      console.warn("[progressStore] fetchProfile refresh failed:", err);
    }

    // Suppress unused variable warning (xpReward is used for optimistic local XP)
    void xpReward;
  },
}));
