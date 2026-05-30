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
  // FastAPI oauth2 form-encoded login
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
    // Try JSON error message
    let message = "Invalid credentials";
    try {
      const err = await res.json() as { detail?: string };
      message = err.detail ?? message;
    } catch { /* empty */ }
    throw new Error(message);
  }

  return res.json() as Promise<LoginResponse>;
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
  program_id?: string;
  program?: string;
  joined_at?: string;
}

export async function apiGetMe(): Promise<MeResponse> {
  return request<MeResponse>("/auth/me");
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardResponse {
  xp?: number;
  level?: number;
  streak_days?: number;
  badges_earned?: number;
  [key: string]: unknown;
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

export interface ProgressResponse {
  completed: number;
  total: number;
  watched?: number;
  pending?: number;
  completion_pct?: number;
  nodes?: { node_id: string; status: "locked" | "active" | "completed" }[];
}

export async function apiGetProgress(): Promise<ProgressResponse> {
  return request<ProgressResponse>("/progress");
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export interface BadgeItem {
  id: string;
  title: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  is_earned: boolean;
  earned_at?: string;
}

export async function apiGetBadges(): Promise<BadgeItem[]> {
  return request<BadgeItem[]>("/badges");
}

// ─── Complete Node ─────────────────────────────────────────────────────────────

export interface CompleteNodeRequest {
  node_id: string;
  xp_reward: number;
}

export interface CompleteNodeResponse {
  success: boolean;
  new_xp?: number;
  new_level?: number;
}

export async function apiCompleteNode(
  data: CompleteNodeRequest
): Promise<CompleteNodeResponse> {
  return request<CompleteNodeResponse>("/progress/complete", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
