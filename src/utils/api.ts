/**
 * FastAPI client helper.
 * Reads the JWT token from localStorage and attaches it as a Bearer header.
 * Base URL is configured via NEXT_PUBLIC_API_URL (default: http://localhost:8000).
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("orvion_token");
}

export function saveToken(token: string): void {
  localStorage.setItem("orvion_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("orvion_token");
  localStorage.removeItem("orvion_user");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (requireAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed [${res.status}]: ${text}`);
  }

  // 202/204 or empty bodies should not blow up JSON.parse
  if (res.status === 204) return undefined as T;
  const raw = await res.text();
  return (raw ? JSON.parse(raw) : undefined) as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

/**
 * POST /auth/login — the backend expects a JSON body { email, password }
 * (FastAPI LoginRequest model), NOT an OAuth2 form. Returns a bearer token.
 */
export async function apiLogin(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: data.email, password: data.password }),
  });

  if (!res.ok) {
    let message = "Invalid email or password";
    try {
      const err = (await res.json()) as { detail?: string };
      message = err.detail ?? message;
    } catch {
      /* empty */
    }
    throw new Error(message);
  }

  return res.json() as Promise<LoginResponse>;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * The backend /auth/register returns the created UserResponse (no token).
 * The caller is expected to follow up with apiLogin to obtain a token.
 */
export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  level?: number;
  xp?: number;
}

/** POST /auth/register — creates a new user account. */
export async function apiRegister(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let message = "Registration failed";
    try {
      const err = (await res.json()) as { detail?: string };
      message = err.detail ?? message;
    } catch {
      /* empty */
    }
    throw new Error(message);
  }

  return res.json() as Promise<RegisterResponse>;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak_days: number;
  last_active: string | null;
  program_id?: string | null;
  program?: string | null;
  joined_at?: string | null;
}

export async function apiGetMe(): Promise<MeResponse> {
  return request<MeResponse>("/auth/me");
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

/** Matches the backend GET /dashboard response shape. */
export interface DashboardResponse {
  user_id: string;
  level: number;
  xp: number;
  streak_days: number;
  readiness_score: number | null;
  readiness_level?: string | null;
  completed_lessons: number;
  total_lessons: number;
  completion_pct?: number;
  badges_earned?: number;
  completed_projects: number;
  total_projects: number;
  total_tests_taken: number;
}

export async function apiGetDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>("/dashboard");
}

// ─── Readiness ────────────────────────────────────────────────────────────────

/** Normalized readiness shape used by the frontend. */
export interface ReadinessResponse {
  score: number;
  level: number;
}

/**
 * GET /readiness-score returns { readiness_score, level } from the backend.
 * We normalize `readiness_score` -> `score` so the rest of the app reads `.score`.
 */
export async function apiGetReadiness(): Promise<ReadinessResponse> {
  const raw = await request<{ readiness_score: number; level: number }>(
    "/readiness-score",
  );
  return {
    score: typeof raw?.readiness_score === "number" ? raw.readiness_score : 0,
    level: typeof raw?.level === "number" ? raw.level : 1,
  };
}

// ─── Progress ─────────────────────────────────────────────────────────────────

/** Matches the backend GET /progress response shape. */
export interface ProgressResponse {
  completed_lessons: number;
  total_lessons: number;
  current_level: number;
  total_watch_time: number;
  /** Frontend node_id strings the user has completed (source of truth for unlock). */
  completed_nodes: string[];
}

export async function apiGetProgress(): Promise<ProgressResponse> {
  const raw = await request<Partial<ProgressResponse>>("/progress");
  return {
    completed_lessons: raw.completed_lessons ?? 0,
    total_lessons: raw.total_lessons ?? 0,
    current_level: raw.current_level ?? 1,
    total_watch_time: raw.total_watch_time ?? 0,
    completed_nodes: Array.isArray(raw.completed_nodes)
      ? raw.completed_nodes
      : [],
  };
}

// ─── Complete Node ─────────────────────────────────────────────────────────────

export interface CompleteNodeResponse {
  success: boolean;
  node_id: string;
  newly_completed: boolean;
  xp_awarded: number;
  new_xp: number;
  new_level: number;
}

/**
 * POST /progress/complete — marks a curriculum node complete by its node_id.
 *
 * The backend persists completion against the node_id string directly
 * (e.g. "node_fsd_m0_w1"), awards XP once, and returns the updated xp/level.
 * No fragile node_id -> lesson_id guessing on the client anymore.
 */
export async function apiCompleteNode(
  nodeId: string,
  xpReward = 0,
): Promise<CompleteNodeResponse> {
  return request<CompleteNodeResponse>("/progress/complete", {
    method: "POST",
    body: JSON.stringify({ node_id: nodeId, xp_reward: xpReward }),
  });
}

// ─── Badges ───────────────────────────────────────────────────────────────────

/** Matches the backend BadgeResponse shape. */
export interface BadgeItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  rarity?: string;
  is_earned?: boolean;
  awarded_at: string | null;
}

export async function apiGetBadges(): Promise<BadgeItem[]> {
  return request<BadgeItem[]>("/badges");
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface BackendNotification {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type?: string;
  title?: string | null;
}

export async function apiGetNotifications(): Promise<BackendNotification[]> {
  return request<BackendNotification[]>("/notifications");
}

export async function apiMarkNotificationRead(id: string): Promise<void> {
  await request<unknown>(`/notifications/read`, {
    method: "POST",
    body: JSON.stringify({ notification_id: id }),
  });
}

// ─── Recommendations (AI Insights) ────────────────────────────────────────────

/**
 * Matches the backend LLMInsightResponse.
 * NOTE: `next_actions` is an OBJECT { actions: string[], analytics_context }
 * — NOT an array. `weak_areas` / `strengths` are flat string arrays.
 */
export interface BackendRecommendation {
  user_id?: string;
  weak_areas: string[];
  strengths: string[];
  next_actions: {
    actions?: string[];
    analytics_context?: unknown;
  } | null;
  readiness_level?: string;
  confidence_score?: number;
  generated_at: string;
  tip_of_day?: string | null;
}

export async function apiGetRecommendations(): Promise<BackendRecommendation> {
  return request<BackendRecommendation>("/recommendations");
}

export interface RecommendationRefreshResponse {
  message: string;
  status: string;
  generated_at: string | null;
}

/**
 * POST /recommendations/generate — synchronously (re)generates insights and
 * returns a status. Follow with apiGetRecommendations() to read the result.
 * (The /refresh endpoint only queues an async job and returns 202.)
 */
export async function apiGenerateRecommendations(): Promise<RecommendationRefreshResponse> {
  return request<RecommendationRefreshResponse>("/recommendations/generate", {
    method: "POST",
  });
}
// ─── Tests ────────────────────────────────────────────────────────────────────

export interface BackendTopicScore {
  topic: string;
  score: number;
}

export interface BackendTestAttempt {
  date: string;
  score: number;
}

export interface BackendTest {
  id: string;
  title: string;
  topic?: string;
  status: "pending" | "completed" | "failed";
  score?: number | null;
  max_score?: number;
  duration?: string;
  topic_breakdown?: BackendTopicScore[] | null;
  attempt_history?: BackendTestAttempt[] | null;
}

export async function apiGetTests(): Promise<BackendTest[]> {
  return request<BackendTest[]>("/tests");
}

export interface SubmitTestRequest {
  answers: Record<string, unknown>;
}

export interface SubmitTestResponse {
  score: number;
  passed: boolean;
  topic_breakdown: BackendTopicScore[];
}

export async function apiSubmitTest(
  testId: string,
  data: SubmitTestRequest,
): Promise<SubmitTestResponse> {
  return request<SubmitTestResponse>(`/tests/${testId}/submit`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetTestBreakdown(
  testId: string,
): Promise<BackendTopicScore[]> {
  return request<BackendTopicScore[]>(`/tests/${testId}/breakdown`);
}

// ─── Interviews ───────────────────────────────────────────────────────────────

export interface BackendQuestionResult {
  id: string;
  question: string;
  level: "Easy" | "Medium" | "Hard";
  result: "Correct" | "Partial" | "Incorrect";
  llm_comment?: string;
}

export interface BackendInterview {
  id: string;
  title?: string | null;
  date?: string | null;
  created_at?: string | null;
  overall_score?: number | null;
  technical_score?: number | null;
  communication_score?: number | null;
  problem_solving_score?: number | null;
  clarity_score?: number | null;
  feedback_text?: string | null;
  question_level_breakdown?: BackendQuestionResult[] | null;
}

export async function apiGetInterviews(): Promise<BackendInterview[]> {
  return request<BackendInterview[]>("/interviews");
}

export async function apiSyncInterviews(): Promise<{ synced: number }> {
  return request<{ synced: number }>("/interviews/sync", { method: "POST" });
}

// ─── Activity & Streaks ───────────────────────────────────────────────────────

export interface ActivityLogRequest {
  active_time_mins?: number;
}

export interface ActivityLogResponse {
  streak_days: number;
  xp?: number;
}

export async function apiLogActivity(
  data?: ActivityLogRequest,
): Promise<ActivityLogResponse> {
  return request<ActivityLogResponse>("/activity", {
    method: "POST",
    body: JSON.stringify(data ?? {}),
  });
}

export interface StreakResponse {
  current_streak: number;
  longest_streak: number;
  history?: { date: string; active: boolean }[];
}

export async function apiGetStreaks(): Promise<StreakResponse> {
  return request<StreakResponse>("/streaks");
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  xp: number;
  level: number;
  rank: number;
  initials?: string;
}

export async function apiGetLeaderboard(): Promise<LeaderboardEntry[]> {
  return request<LeaderboardEntry[]>("/leaderboard");
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface SubmitProjectRequest {
  project_id: number;
  github_url: string;
}

export interface BackendProject {
  id: number;
  title: string;
  status?: string;
  description?: string;
  code_quality_score?: number;
}

export async function apiGetProjects(): Promise<BackendProject[]> {
  return request<BackendProject[]>("/projects");
}

export async function apiAnalyzeProject(
  data: SubmitProjectRequest,
): Promise<unknown> {
  return request<unknown>("/projects/analyze", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiReviewProject(
  data: SubmitProjectRequest,
): Promise<unknown> {
  return request<unknown>("/projects/review", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface ProjectSubmissionResponse {
  success: boolean;
  score: number;
  review: unknown;
  project: unknown;
}

export async function apiSubmitProject(
  data: SubmitProjectRequest,
): Promise<ProjectSubmissionResponse> {
  return request<ProjectSubmissionResponse>("/projects/submit", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
