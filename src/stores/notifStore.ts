import { create } from "zustand";

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

const fallbackNotifications: Notification[] = [
  { id: "1", title: "Level Up!", description: "You've reached Level 2.", timeAgo: "2h ago", read: false, type: "milestone" },
  { id: "2", title: "Inactivity Alert", description: "You haven't coded in 3 days. Don't lose your streak!", timeAgo: "1d ago", read: false, type: "alert" },
  { id: "3", title: "New Project Unlocked", description: "You can now start 'E-commerce API'.", timeAgo: "2d ago", read: true, type: "info" },
];

interface NotifState {
  notifications: Notification[];
  toasts: Toast[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

export const useNotifStore = create<NotifState>((set) => ({
  notifications: fallbackNotifications,
  toasts: [],
  unreadCount: fallbackNotifications.filter((n) => !n.read).length,
  
  fetchNotifications: async () => {
    // In a real app, you'd fetch from a `user_notifications` table in Supabase.
    set({ notifications: fallbackNotifications, unreadCount: fallbackNotifications.filter((n) => !n.read).length });
  },

  markAsRead: (id) =>
    set((state) => {
      const newNotifs = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      return { notifications: newNotifs, unreadCount: newNotifs.filter((n) => !n.read).length };
    }),

  markAllAsRead: () =>
    set((state) => {
      const newNotifs = state.notifications.map((n) => ({ ...n, read: true }));
      return { notifications: newNotifs, unreadCount: 0 };
    }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).slice(2) }],
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
