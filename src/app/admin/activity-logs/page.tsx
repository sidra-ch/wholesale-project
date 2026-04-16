"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchActivityLogs } from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  User,
  Clock,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FolderTree,
  CreditCard,
  Shield,
} from "lucide-react";

interface LogEntry {
  id: number;
  user_id?: number;
  module: string;
  action: string;
  description: string;
  ip_address?: string;
  created_at: string;
  user?: { name: string; email: string };
}

const moduleIcons: Record<string, React.ElementType> = {
  products: Package,
  orders: ShoppingCart,
  customers: Users,
  categories: FolderTree,
  settings: Settings,
  payments: CreditCard,
  auth: Shield,
};

const moduleColors: Record<string, string> = {
  products: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  orders: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  customers: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  categories: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  settings: "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
  payments: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  auth: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const actionBadge: Record<string, string> = {
  create: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  update: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  delete: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  login: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  logout: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
};

const allModules = ["products", "orders", "customers", "categories", "payments", "settings", "auth"];

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchActivityLogs({
        search: search || undefined,
        module: moduleFilter || undefined,
        page,
        per_page: 20,
      });
      setLogs(data.data || []);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      toast("Failed to load activity logs", "error");
    }
    setLoading(false);
  }, [search, moduleFilter, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-[#3B82F6]" />
          Activity Logs
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {total} total log entr{total !== 1 ? "ies" : "y"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:focus:border-[#3B82F6] transition-colors dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => { setModuleFilter(""); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              !moduleFilter
                ? "bg-[#3B82F6] text-white shadow-sm"
                : "bg-white dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.06]"
            }`}
          >
            All
          </button>
          {allModules.map((m) => (
            <button
              key={m}
              onClick={() => { setModuleFilter(m); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors capitalize ${
                moduleFilter === m
                  ? "bg-[#3B82F6] text-white shadow-sm"
                  : "bg-white dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.06]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">Loading activity logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No activity logs found</div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
            {logs.map((log) => {
              const ModIcon = moduleIcons[log.module] || ScrollText;
              const mColor = moduleColors[log.module] || moduleColors.settings;
              const aBadge = actionBadge[log.action] || actionBadge.update;
              return (
                <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${mColor}`}>
                    <ModIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${aBadge}`}>
                        {log.action}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{log.module}</span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{log.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      {log.user && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />{log.user.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{new Date(log.created_at).toLocaleString()}
                      </span>
                      {log.ip_address && (
                        <span className="font-mono">{log.ip_address}</span>
                      )}
                    </div>
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
