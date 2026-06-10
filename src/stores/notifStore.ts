import { create } from "zustand";
import {
  apiGetNotifications,
  apiMarkNotificationRead,
  type BackendNotification,
} from "~/utils/api";

export interface Notification {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
  type: "milestone" | "alert" | "info";
}

export interface Toast {
  id: string;
  title: string;
  body?: string;
  type: "xp" | "badge" | "level" | "streak" | "info";
}

/** Derive timeAgo string from an ISO timestamp. */
function toTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/** Split a single `message` string into a short title and a description. */
function splitMessage(message: string): { title: string; description: string } {
  const parts = message.split(/[.!?]\s+/, 2);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return { title: parts[0].trim(), description: parts[1].trim() };
  }
  const truncated = message.length > 50 ? message.slice(0, 50) + "…" : message;
  return { title: truncated, description: message };
}

/** Guess a notification type from the message content. */
function inferType(message: string): Notification["type"] {
  const m = message.toLowerCase();
  if (m.includes("level") || m.includes("badge") || m.includes("xp")) return "milestone";
  if (m.includes("alert") || m.includes("streak") || m.includes("inactive")) return "alert";
  return "info";
}

function mapBackendNotification(n: BackendNotification): Notification {
  const { title, description } = splitMessage(n.message);
  return {
    id: n.id,
    title,
    description,
    timeAgo: toTimeAgo(n.created_at),
    read: n.is_read,
    type: n.type ? (n.type as Notification["type"]) : inferType(n.message),
  };
}

interface NotifState {
  notifications: Notification[];
  toasts: Toast[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

export const useNotifStore = create<NotifState>((set, get) => ({
  notifications: [],
  toasts: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const raw = await apiGetNotifications();
      const mapped = raw.map(mapBackendNotification);
      set({
        notifications: mapped,
        unreadCount: mapped.filter((n) => !n.read).length,
      });
    } catch (err) {
      console.warn("[notifStore] /notifications failed (non-fatal):", err);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: (id) => {
    // Optimistic update
    set((state) => {
      const newNotifs = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications: newNotifs, unreadCount: newNotifs.filter((n) => !n.read).length };
    });
    // Persist to backend
    void apiMarkNotificationRead(id).catch((err) =>
      console.warn("[notifStore] mark-read failed:", err)
    );
  },

  markAllAsRead: () => {
    const { notifications } = get();
    set((state) => {
      const newNotifs = state.notifications.map((n) => ({ ...n, read: true }));
      return { notifications: newNotifs, unreadCount: 0 };
    });
    // Mark each unread item on the backend
    notifications
      .filter((n) => !n.read)
      .forEach((n) => {
        void apiMarkNotificationRead(n.id).catch((err) =>
          console.warn("[notifStore] mark-all-read failed for", n.id, err)
        );
      });
  },

  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).slice(2) }],
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
