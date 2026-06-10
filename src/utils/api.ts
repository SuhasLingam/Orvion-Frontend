/**
 * FastAPI client helper.
 * Reads the JWT token from localStorage and attaches it as a Bearer header.
 * Base URL is configured via NEXT_PUBLIC_API_URL (default: http://localhost:8000).
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
  requireAuth = true
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

  return res.json() as Promise<T>;
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

export async function apiLogin(data: LoginRequest): Promise<LoginResponse> {
  // FastAPI OAuth2 form-encoded login
  const body = new URLSearchParams({
    username: data.email,
    password: data.password,
  });

  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    let message = "Invalid credentials";
    try {
      const err = await res.json() as { detail?: string };
      message = err.detail ?? message;
    } catch { /* empty */ }
    throw new Error(message);
  }

  return res.json() as Promise<LoginResponse>;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  access_token?: string;
}

/**
 * POST /auth/register — creates a new user account.
 * If the backend returns an access_token directly, it is saved automatically.
 */
export async function apiRegister(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let message = "Registration failed";
    try {
      const err = await res.json() as { detail?: string };
      message = err.detail ?? message;
    } catch { /* empty */ }
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
  // TODO(backend): program_id, program, and joined_at are not yet returned by
  // the backend /auth/me endpoint. Raise a backend ticket to add these fields
  // to the UserResponse schema. Until then the frontend falls back to defaults.
  program_id?: string;
  program?: string;
  joined_at?: string;
}

export async function apiGetMe(): Promise<MeResponse> {
  return request<MeResponse>("/auth/me");
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

/** Matches the actual backend GET /dashboard response shape. */
export interface DashboardResponse {
  completed_lessons: number;
  total_lessons: number;
  completed_projects: number;
  total_projects: number;
  total_tests_taken: number;
  readiness_score: number;
}

export async function apiGetDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>("/dashboard");
}

// ─── Readiness ────────────────────────────────────────────────────────────────

export interface ReadinessResponse {
  score: number;
  level?: string;
}

export async function apiGetReadiness(): Promise<ReadinessResponse> {
  return request<ReadinessResponse>("/readiness-score");
}

// ─── Progress ─────────────────────────────────────────────────────────────────

/** Matches the actual backend GET /progress response shape. */
export interface ProgressResponse {
  completed_lessons: number;
  total_lessons: number;
  completed_projects?: number;
  total_projects?: number;
  // TODO(backend): Add a `nodes` array of { node_id, status } to ProgressResponse
  // so the frontend can apply per-node completion status from the server.
  // Until that backend change lands, node status is local-only and resets on refresh.
}

export async function apiGetProgress(): Promise<ProgressResponse> {
  return request<ProgressResponse>("/progress");
}

// ─── Badges ───────────────────────────────────────────────────────────────────

/**
 * Matches the actual backend badge shape.
 * NOTE: The backend does not yet return `icon` or `rarity`.
 * Those fields default to a placeholder until the backend schema is extended.
 */
export interface BadgeItem {
  badge_id: string;
  name: string;
  description?: string;
  awarded_at: string | null;
  // TODO(backend): Add `icon` and `rarity` fields to the badge schema.
}

export async function apiGetBadges(): Promise<BadgeItem[]> {
  return request<BadgeItem[]>("/badges");
}

// ─── Complete Node ─────────────────────────────────────────────────────────────

export interface LessonProgressRequest {
  watch_time: number;       // seconds watched
  completed: boolean;
  rewatch_count: number;
}

export interface LessonProgressResponse {
  success: boolean;
  new_xp?: number;
  new_level?: number;
}

/**
 * POST /lessons/{lesson_id}/progress
 *
 * The node ID stored in the frontend is a string like "node_fsd_m0_w1".
 * The backend expects a numeric lesson_id in the URL path.
 *
 * Mapping convention: extract the module index (mIdx) and week index (wIdx)
 * from the node ID and derive a lesson_id as (mIdx * 100 + wIdx + 1).
 *
 * TODO(backend): Confirm the exact node_id → lesson_id mapping with the backend
 * team and update this function if the convention differs.
 */
export function nodeidToLessonId(nodeId: string): number {
  // e.g. "node_fsd_m0_w2"  →  mIdx=0, wIdx=2  →  lessonId=3
  const parts = nodeId.split("_");
  const mIdx = parseInt(parts[2]?.replace("m", "") ?? "0", 10);
  const wIdx = parseInt(parts[3]?.replace("w", "") ?? "0", 10);
  return mIdx * 100 + wIdx + 1;
}

export async function apiCompleteLesson(
  nodeId: string,
  opts: Partial<LessonProgressRequest> = {}
): Promise<LessonProgressResponse> {
  const lessonId = nodeidToLessonId(nodeId);
  return request<LessonProgressResponse>(`/lessons/${lessonId}/progress`, {
    method: "POST",
    body: JSON.stringify({
      watch_time: opts.watch_time ?? 0,
      completed: opts.completed ?? true,
      rewatch_count: opts.rewatch_count ?? 0,
    }),
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface BackendNotification {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type?: string;
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

export interface BackendRecommendation {
  weak_areas: string[];
  strengths: string[];
  next_actions: {
    id: string;
    title: string;
    type: string;
    priority: string;
    reason: string;
  }[];
  generated_at: string;
}

export async function apiGetRecommendations(): Promise<BackendRecommendation> {
  return request<BackendRecommendation>("/recommendations");
}

export async function apiRefreshRecommendations(): Promise<BackendRecommendation> {
  return request<BackendRecommendation>("/recommendations/refresh", {
    method: "POST",
  });
}
