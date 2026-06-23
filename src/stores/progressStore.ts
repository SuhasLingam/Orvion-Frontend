import { create } from "zustand";
import {
  apiGetProgress,
  apiCompleteNode,
  apiGetProjects,
  apiGetTests,
  apiGetInterviews,
  isLoggedIn,
  type BackendTest,
  type BackendInterview,
} from "~/utils/api";
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
  id: number;
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
  /** Source-of-truth set of completed node_ids from the backend. */
  completedNodes: string[];
  isLoading: boolean;

  fetchProgress: () => Promise<void>;
  completeNode: (nodeId: string, xpReward: number) => Promise<void>;
  updateSubProgress: (nodeId: string, completedIndices: number[]) => void;
}

/**
 * XP reward per node type — must match the backend gamification rules:
 *   lesson (video)  = +10 XP   (LESSON_COMPLETED_XP)
 *   test (quiz)     = +25 XP
 *   project         = +100 XP
 *   interview       = +50 XP
 * NOTE: the backend awards XP idempotently; the value passed here is only a
 * hint used for the optimistic local display.
 */
function xpForType(type: LevelNode["type"]): number {
  switch (type) {
    case "quiz":
      return 25;
    case "project":
      return 100;
    case "interview":
      return 50;
    case "video":
    default:
      return 10;
  }
}

/** Map a backend test response to the frontend MockTest shape. */
function mapBackendTest(t: BackendTest): MockTest {
  return {
    id: t.id,
    title: t.title,
    status: t.status === "completed" || t.status === "failed" ? "completed" : "pending",
    score: t.score ?? undefined,
    maxScore: t.max_score ?? 100,
    duration: t.duration ?? "45 min",
    topics: Array.isArray(t.topic_breakdown)
      ? t.topic_breakdown.map((tb) => ({ topic: tb.topic, score: tb.score }))
      : [],
    history: Array.isArray(t.attempt_history)
      ? t.attempt_history.map((a) => ({ date: a.date, score: a.score }))
      : [],
  };
}

/** Map a backend interview response to the frontend MockInterview shape. */
function mapBackendInterview(iv: BackendInterview): MockInterview {
  const date = iv.date ?? iv.created_at ?? "";
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";
  return {
    id: iv.id,
    title: iv.title ?? `Interview ${iv.id.slice(0, 6)}`,
    date: formattedDate,
    overallScore: iv.overall_score ?? 0,
    technicalScore: iv.technical_score ?? 0,
    communicationScore: iv.communication_score ?? 0,
    problemSolvingScore: iv.problem_solving_score ?? 0,
    clarityScore: iv.clarity_score ?? 0,
    feedback: iv.feedback_text ?? "No feedback available.",
    questions: Array.isArray(iv.question_level_breakdown)
      ? iv.question_level_breakdown.map((q) => ({
          id: q.id,
          question: q.question,
          level: q.level,
          result: q.result,
          llmComment: q.llm_comment ?? "",
        }))
      : [],
  };
}

/**
 * Given the ordered curriculum nodes and the set of completed node_ids,
 * derive each node's status with a strict sequential-unlock rule:
 *   - any node in the completed set  -> "completed"
 *   - the first non-completed node   -> "active"
 *   - everything after that          -> "locked"
 */
function applyStatuses(
  path: Omit<LevelNode, "status">[],
  completed: Set<string>,
): LevelNode[] {
  let activeAssigned = false;
  return path.map((node) => {
    if (completed.has(node.id)) {
      return { ...node, status: "completed" as const };
    }
    if (!activeAssigned) {
      activeAssigned = true;
      return { ...node, status: "active" as const };
    }
    return { ...node, status: "locked" as const };
  });
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  learningPath: [],
  projects: [],
  tests: [],
  interviews: [],
  subProgress: {},
  completedNodes: [],
  isLoading: false,

  fetchProgress: async () => {
    if (!isLoggedIn()) return;
    set({ isLoading: true });

    try {
      // 1. Resolve the user's program.
      const { useUserStore } = await import("~/stores/userStore");
      const { programId } = useUserStore.getState();

      const { programs } = await import("~/data/programs");
      const program = programs.find((p) => p.id === programId) ?? programs[0];

      // 2. Pull the authoritative completed-node set from the backend.
      let completedNodes: string[] = [];
      try {
        const progress = await apiGetProgress();
        completedNodes = progress.completed_nodes ?? [];
      } catch (err) {
        console.warn("[progressStore] /progress failed (non-fatal):", err);
      }
      const completedSet = new Set(completedNodes);

      // 3. Build the curriculum node list (without status), then apply status.
      const baseNodes: Omit<LevelNode, "status">[] = [];
      if (program?.curriculum) {
        program.curriculum.forEach((month, mIdx) => {
          month.weeks.forEach((week, wIdx) => {
            baseNodes.push({
              id: `node_${program.id}_m${mIdx}_w${wIdx}`,
              title: week.title,
              description: week.topics.join(" • "),
              xpReward: xpForType("video"),
              type: "video",
              duration: "1 week",
            });
          });

          if (month.assessment) {
            baseNodes.push({
              id: `node_assess_${program.id}_m${mIdx}`,
              title: month.assessment,
              description: `Comprehensive evaluation for ${month.title}`,
              xpReward: xpForType("quiz"),
              type: "quiz",
              duration: "1 hour",
            });
          }
        });
      }

      set({
        completedNodes,
        learningPath: applyStatuses(baseNodes, completedSet),
      });

      // 4. Load projects from backend
      try {
        const backendProjects = await apiGetProjects();
        console.log("PROJECTS FROM API:", backendProjects);

        interface BackendProject {
          id: string | number;
          title: string;
          description?: string;
          is_locked?: boolean;
          status?: string;
          code_quality_score?: number;
        }

        set({
          projects: (backendProjects as BackendProject[]).map((p) => ({
            id: Number(p.id),
            title: p.title,
            description: p.description ?? "",
            difficulty: "Beginner" as const,
            techStack: [],

            status: p.is_locked
              ? ("locked" as const)
              : p.status === "completed"
                ? ("completed" as const)
                : ("in_progress" as const),

            progress: p.status === "completed" ? 100 : 0,

            codeQuality: p.code_quality_score ?? 0,
          })),
        });
      } catch (err) {
        console.error("Failed to load projects:", err);
        set({ projects: [] });
      }

      // 5. Load tests from backend
      try {
        const backendTests = await apiGetTests();
        set({ tests: backendTests.map(mapBackendTest) });
      } catch (err) {
        console.warn("[progressStore] /tests failed (non-fatal):", err);
      }

      // 6. Load interviews from backend
      try {
        const backendInterviews = await apiGetInterviews();
        set({ interviews: backendInterviews.map(mapBackendInterview) });
      } catch (err) {
        console.warn("[progressStore] /interviews failed (non-fatal):", err);
      }

      // 7. Restore per-topic sub-progress from localStorage (UI nicety only).
      const subProg: Record<string, number[]> = {};
      if (typeof window !== "undefined") {
        get().learningPath.forEach((node) => {
          const saved = localStorage.getItem(`orvion_progress_${node.id}`);
          if (saved) {
            try {
              subProg[node.id] = JSON.parse(saved) as number[];
            } catch (e) {
              console.error("Error parsing sub-progress:", e);
            }
          }
        });
      }
      set({ subProgress: subProg });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSubProgress: (nodeId, completedIndices) => {
    set((state) => {
      const newSubProgress = {
        ...state.subProgress,
        [nodeId]: completedIndices,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `orvion_progress_${nodeId}`,
          JSON.stringify(completedIndices),
        );
      }
      return { subProgress: newSubProgress };
    });
  },

  completeNode: async (nodeId: string, xpReward: number) => {
    // Ensure the path exists so optimistic updates have something to act on.
    let { learningPath, completedNodes } = get();
    if (learningPath.length === 0) {
      await get().fetchProgress();
      learningPath = get().learningPath;
      completedNodes = get().completedNodes;
    }

    // Optimistic: mark this node completed and recompute statuses so the next
    // node unlocks immediately.
    const optimisticCompleted = new Set([...completedNodes, nodeId]);
    const base = learningPath.map(({ status: _status, ...rest }) => rest);
    set({
      completedNodes: Array.from(optimisticCompleted),
      learningPath: applyStatuses(base, optimisticCompleted),
    });

    // Persist to the backend (authoritative). Idempotent — safe to retry.
    try {
      await apiCompleteNode(nodeId, xpReward);
    } catch (err) {
      console.warn("[progressStore] /progress/complete failed:", err);
    }

    // Re-sync the completed set + the user's XP/level from the server.
    try {
      await get().fetchProgress();
    } catch (err) {
      console.warn("[progressStore] progress re-sync failed:", err);
    }
    try {
      const { useUserStore } = await import("~/stores/userStore");
      await useUserStore.getState().fetchProfile();
    } catch (err) {
      console.warn("[progressStore] fetchProfile refresh failed:", err);
    }
  },
}));
