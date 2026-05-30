import { create } from "zustand";
import { apiGetProgress, apiCompleteNode, isLoggedIn } from "~/utils/api";

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

  fetchProgress: () => Promise<void>;
  completeNode: (nodeId: string, xpReward: number) => Promise<void>;
  updateSubProgress: (nodeId: string, completedIndices: number[]) => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  learningPath: [],
  projects: [],
  tests: [],
  interviews: [],
  subProgress: {},

  fetchProgress: async () => {
    if (!isLoggedIn()) return;

    // ── 1. Get the user's program from userStore (already fetched) ─────────
    const { useUserStore } = await import("~/stores/userStore");
    const { programId } = useUserStore.getState();

    // ── 2. Build the learning path from local curriculum data ──────────────
    const { programs } = await import("~/data/programs");
    const program = programs.find((p) => p.id === programId) ?? programs[0];

    // ── 3. Fetch node statuses from FastAPI /progress ──────────────────────
    type NodeStatus = { node_id: string; status: "locked" | "active" | "completed" };
    let nodeStatuses: NodeStatus[] = [];
    try {
      const progress = await apiGetProgress();
      nodeStatuses = progress.nodes ?? [];
    } catch (err) {
      console.warn("[progressStore] /progress failed (non-fatal):", err);
    }

    if (program?.curriculum) {
      const mappedPath: LevelNode[] = [];
      let globalIdx = 0;

      program.curriculum.forEach((month, mIdx) => {
        month.weeks.forEach((week, wIdx) => {
          const nodeId = `node_${program.id}_m${mIdx}_w${wIdx}`;
          const serverNode = nodeStatuses.find((n) => n.node_id === nodeId);

          mappedPath.push({
            id: nodeId,
            title: week.title,
            description: week.topics.join(" • "),
            xpReward: 50,
            type: "video",
            duration: "1 week",
            status: serverNode
              ? serverNode.status
              : globalIdx === 0
              ? "active"
              : "locked",
          });
          globalIdx++;
        });

        if (month.assessment) {
          const assessId = `node_assess_${program.id}_m${mIdx}`;
          const serverNode = nodeStatuses.find((n) => n.node_id === assessId);
          mappedPath.push({
            id: assessId,
            title: month.assessment,
            description: `Comprehensive evaluation for ${month.title}`,
            xpReward: 200,
            type: "quiz",
            duration: "1 hour",
            status: serverNode ? serverNode.status : "locked",
          });
          globalIdx++;
        }
      });

      set({ learningPath: mappedPath });
    } else {
      set({ learningPath: [] });
    }

    // ── 4. Build projects from local curriculum ────────────────────────────
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

    // ── 5. Restore sub-progress from localStorage ──────────────────────────
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
    // ── Optimistically update local state ──────────────────────────────────
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

    // ── Call FastAPI to persist ────────────────────────────────────────────
    try {
      await apiCompleteNode({ node_id: nodeId, xp_reward: xpReward });
    } catch (err) {
      console.warn("[progressStore] /progress/complete failed (non-fatal):", err);
      // keep optimistic state; backend may sync on next load
    }

    // ── Refresh userStore so XP/level update immediately ──────────────────
    try {
      const { useUserStore } = await import("~/stores/userStore");
      await useUserStore.getState().fetchProfile();
    } catch (err) {
      console.warn("[progressStore] fetchProfile refresh failed:", err);
    }
  },
}));
