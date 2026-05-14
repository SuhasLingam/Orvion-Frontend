import { create } from "zustand";
import { createClient } from "~/utils/supabase/client";

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

interface UserNodeRow {
  id: string;
  user_id: string;
  node_id: string;
  status: "locked" | "active" | "completed";
  completed_at: string | null;
}

interface UserProjectRow {
  project_id: string;
  status: "completed" | "in_progress" | "locked";
  progress: number;
  code_quality: number;
}

interface TestRow {
  id: string;
  title: string;
  max_score: number;
  duration: string;
}

interface UserTestRow {
  test_id: string;
  status: "completed" | "pending";
  score: number;
  topics: TopicScore[];
  completed_at: string | null;
}

interface InterviewQuestionRow {
  id: string;
  question: string;
  level: "Easy" | "Medium" | "Hard";
  result: "Correct" | "Partial" | "Incorrect";
  llm_comment: string;
}

interface InterviewRow {
  id: string;
  title: string;
  date: string;
  overall_score: number;
  technical_score: number;
  communication_score: number;
  problem_solving_score: number;
  clarity_score: number;
  feedback: string;
  interview_questions: InterviewQuestionRow[];
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  learningPath: [],
  projects: [],
  tests: [],
  interviews: [],
  subProgress: {},

  fetchProgress: async () => {
    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) return;
    const userId = session.user.id;

    // Fetch the user's enrolled program
    const { data: profile } = await supabase.from('profiles').select('program_id').eq('id', userId).single() as { data: { program_id: string } | null };
    const programId = profile?.program_id ?? 'ui-ux-design';

    // Dynamically import programs to avoid circular dependencies
    const { programs } = await import('~/data/programs');
    const program = programs.find((p) => p.id === programId) ?? programs[0];

    // 1. Generate Learning Path dynamically from the program's curriculum
    const { data: userNodes } = await supabase.from('user_learning_progress').select('*').eq('user_id', userId) as { data: UserNodeRow[] | null };

    if (program?.curriculum) {
      const mappedPath: LevelNode[] = [];
      let globalIdx = 0;

      program.curriculum.forEach((month, mIdx) => {
        month.weeks.forEach((week, wIdx) => {
          const nodeId = `node_${program.id}_m${mIdx}_w${wIdx}`;
          const progress = userNodes?.find(un => un.node_id === nodeId);

          mappedPath.push({
            id: nodeId,
            title: week.title,
            description: week.topics.join(" • "),
            xpReward: 50,
            type: "video",
            duration: "1 week",
            status: progress ? progress.status : (globalIdx === 0 ? "active" : "locked")
          });
          globalIdx++;
        });

        if (month.assessment) {
          const assessId = `node_assess_${program.id}_m${mIdx}`;
          const progress = userNodes?.find(un => un.node_id === assessId);
          mappedPath.push({
            id: assessId,
            title: month.assessment,
            description: `Comprehensive evaluation for ${month.title}`,
            xpReward: 200,
            type: "quiz",
            duration: "1 hour",
            status: progress ? progress.status : "locked"
          });
          globalIdx++;
        }
      });

      set({ learningPath: mappedPath });
    } else {
      set({ learningPath: [] });
    }

    // 2. Generate Projects dynamically from the program's projectsFramework
    const { data: userProjectsData } = await supabase.from('user_projects').select('*').eq('user_id', userId) as { data: UserProjectRow[] | null };

    if (program?.projectsFramework) {
      const mappedProjects: Project[] = [];
      let pIdx = 0;

      program.projectsFramework.sets.forEach((set) => {
        const difficultyLevel = set.level.toLowerCase().includes("advanced") ? "Advanced"
          : set.level.toLowerCase().includes("intermediate") ? "Intermediate"
            : "Beginner";

        set.projects.forEach((projTitle) => {
          const projId = `proj_${program.id}_${pIdx}`;
          const progress = userProjectsData?.find(up => up.project_id === projId);

          mappedProjects.push({
            id: projId,
            title: projTitle,
            description: set.description,
            difficulty: difficultyLevel,
            techStack: program.technologies.slice(0, 4), // Sample from the program's tech stack
            status: progress ? progress.status : (pIdx === 0 ? "in_progress" : "locked"),
            progress: progress ? progress.progress : 0,
            codeQuality: progress ? progress.code_quality : 0
          });
          pIdx++;
        });
      });

      set({ projects: mappedProjects });
    } else {
      set({ projects: [] });
    }

    // 3. Fetch Tests (Can remain database driven or we can generate them too. Keeping DB for now)
    const { data: testsData } = await supabase.from('tests').select('*') as { data: TestRow[] | null };
    const { data: userTestsData } = await supabase.from('user_tests').select('*').eq('user_id', userId) as { data: UserTestRow[] | null };

    if (testsData) {
      const mappedTests = testsData.map(test => {
        const attempts = userTestsData?.filter(ut => ut.test_id === test.id) ?? [];
        const latest = attempts[attempts.length - 1];
        return {
          id: test.id,
          title: test.title,
          maxScore: test.max_score,
          duration: test.duration,
          status: latest ? latest.status : 'pending',
          score: latest ? latest.score : undefined,
          topics: latest?.topics ?? [],
          history: attempts.map(a => ({ date: a.completed_at ?? new Date().toISOString(), score: a.score }))
        } as MockTest;
      });
      set({ tests: mappedTests });
    }

    // 4. Fetch Interviews
    const { data: interviewsData } = await supabase.from('user_interviews').select('*, interview_questions(*)').eq('user_id', userId) as { data: InterviewRow[] | null };

    if (interviewsData) {
      const mappedInterviews = interviewsData.map(int => ({
        id: int.id,
        title: int.title,
        date: int.date,
        overallScore: int.overall_score,
        technicalScore: int.technical_score,
        communicationScore: int.communication_score,
        problemSolvingScore: int.problem_solving_score,
        clarityScore: int.clarity_score,
        feedback: int.feedback,
        questions: int.interview_questions.map((q) => ({
          id: q.id,
          question: q.question,
          level: q.level,
          result: q.result,
          llmComment: q.llm_comment
        }))
      })) as MockInterview[];
      set({ interviews: mappedInterviews });
    }

    // 5. Initialize sub-progress from localStorage
    const subProg: Record<string, number[]> = {};
    const { learningPath: lp } = get();
    lp.forEach(node => {
      if (typeof window !== 'undefined') {
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
    set(state => {
      const newSubProgress = { ...state.subProgress, [nodeId]: completedIndices };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`orvion_progress_${nodeId}`, JSON.stringify(completedIndices));
      }
      return { subProgress: newSubProgress };
    });
  },

  completeNode: async (nodeId: string, xpReward: number) => {
    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) return;
    const userId = session.user.id;
    let { learningPath } = get();

    // 0. If learningPath is empty, fetch it first (essential for direct link navigation)
    if (learningPath.length === 0) {
      await get().fetchProgress();
      learningPath = get().learningPath;
    }

    // Ensure current node exists in learning_nodes to satisfy foreign key
    const currentNodeData = learningPath.find(n => n.id === nodeId);
    if (currentNodeData) {
      await supabase.from('learning_nodes').upsert({
        id: currentNodeData.id,
        title: currentNodeData.title,
        description: currentNodeData.description,
        xp_reward: currentNodeData.xpReward,
        type: currentNodeData.type,
        duration: currentNodeData.duration,
        order_index: learningPath.findIndex((n) => n.id === nodeId)
      });
    }

    // 1. Mark current node as completed
    await supabase.from('user_learning_progress').upsert({
      user_id: userId,
      node_id: nodeId,
      status: 'completed',
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id, node_id' });

    // 2. Mark the next node as active
    const currentIndex = learningPath.findIndex((n) => n.id === nodeId);
    if (currentIndex !== -1 && currentIndex < learningPath.length - 1) {
      const nextNode = learningPath[currentIndex + 1];
      if (nextNode?.status === 'locked') {

        // Ensure next node exists in learning_nodes
        await supabase.from('learning_nodes').upsert({
          id: nextNode.id,
          title: nextNode.title,
          description: nextNode.description,
          xp_reward: nextNode.xpReward,
          type: nextNode.type,
          duration: nextNode.duration,
          order_index: currentIndex + 1
        });

        await supabase.from('user_learning_progress').upsert({
          user_id: userId,
          node_id: nextNode.id,
          status: 'active'
        }, { onConflict: 'user_id, node_id' });
      }
    }

    // 3. Log Activity for Heatmap
    const today = new Date().toISOString().split('T')[0]!;
    const { data: existingActivity } = await supabase
      .from('user_activity')
      .select('activity_count')
      .eq('user_id', userId)
      .eq('date', today)
      .single() as { data: { activity_count: number } | null };

    if (existingActivity) {
      const { error: updateError } = await supabase.from('user_activity').update({
        activity_count: (existingActivity.activity_count ?? 0) + 1
      }).eq('user_id', userId).eq('date', today);
      if (updateError) console.error("Error updating activity:", updateError);
    } else {
      const { error: insertError } = await supabase.from('user_activity').insert({
        user_id: userId,
        date: today,
        activity_count: 1
      });
      if (insertError) console.error("Error inserting activity:", insertError);
    }

    // 4. Update XP in the database
    const { data: profile } = await supabase.from('profiles').select('xp, level, xp_to_next_level').eq('id', userId).single() as { data: { xp: number, level: number, xp_to_next_level: number } | null };
    if (profile) {
      let newXp = profile.xp + xpReward;
      let newLevel = profile.level;
      let newXpToNext = profile.xp_to_next_level;

      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel += 1;
        newXpToNext += 500;
      }

      await supabase.from('profiles').update({
        xp: newXp,
        level: newLevel,
        xp_to_next_level: newXpToNext
      }).eq('id', userId);
    }

    // 4. Re-fetch both stores to sync local state with Supabase
    const { useUserStore: uStore } = await import('~/stores/userStore');
    await uStore.getState().fetchProfile();
    await get().fetchProgress();
  }
}));
