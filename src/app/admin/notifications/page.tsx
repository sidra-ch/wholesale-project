"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  ShoppingCart,
  AlertTriangle,
  UserPlus,
  Package,
  CreditCard,
  Mail,
  Circle,
} from "lucide-react";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead?: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  new_order: { icon: ShoppingCart, color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
  low_stock: { icon: AlertTriangle, color: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  new_customer: { icon: UserPlus, color: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
  order_cancelled: { icon: Package, color: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
  payment_received: { icon: CreditCard, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  general: { icon: Mail, color: "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400" },
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, perPage: 20 };
      if (filter === "unread") params.read = false;
      if (filter === "read") params.read = true;
      const data = await fetchNotifications(params as Parameters<typeof fetchNotifications>[0]);
      setNotifications(data.data || []);
      setLastPage(data.lastPage || data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      toast("Failed to load notifications", "error");
    }
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch {
      toast("Failed to mark as read", "error");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      toast("All notifications marked as read");
    } catch {
      toast("Failed to mark all as read", "error");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const timeSince = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#3B82F6]" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-[#3B82F6] text-white text-xs rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} notification{total !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
          >
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.04] rounded-xl p-1 w-fit">
        {(["all", "unread", "read"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-white dark:bg-white/[0.1] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
            {notifications.map((n) => {
              const cfg = typeConfig[n.type] || typeConfig.general;
              const isUnread = !n.isRead;
              return (
                <div
                  key={n.id}
                  onClick={() => isUnread && handleMarkRead(n.id)}
                  className={`flex items-start gap-4 p-4 transition-colors cursor-pointer ${
                    isUnread
                      ? "bg-blue-50/30 dark:bg-blue-500/[0.03] hover:bg-blue-50/50 dark:hover:bg-blue-500/[0.05]"
                      : "hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.color}`}>
                    <cfg.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${isUnread ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                        {n.title}
                      </p>
                      {isUnread && <Circle className="h-2 w-2 fill-[#3B82F6] text-[#3B82F6] shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeSince(n.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.06]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {lastPage}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 dark:text-gray-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage(Math.min(lastPage, page + 1))} disabled={page >= lastPage} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 dark:text-gray-400">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
