"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { fetchDashboard } from "@/lib/admin-api";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Activity,
  Zap,
  ChevronRight,
} from "lucide-react";

interface DashboardData {
  stats: {
    total_revenue: number;
    total_orders: number;
    total_products: number;
    total_customers: number;
    pending_orders: number;
    low_stock: number;
  };
  recent_orders: Array<{
    id: number;
    total: string;
    status: string;
    created_at: string;
    user?: { id: number; name: string; email: string };
  }>;
  top_products: Array<{
    id: number;
    name: string;
    retail_price: string;
    stock: number;
    total_sold: number;
  }>;
  monthly_revenue: Array<{ month: string; revenue: number }>;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  processing: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border border-red-500/20",
};

const quickActions = [
  {
    label: "Add Product",
    icon: Plus,
    href: "/admin/products",
    color: "from-[#3B82F6] to-[#2563EB]",
  },
  {
    label: "View Orders",
    icon: ShoppingCart,
    href: "/admin/orders",
    color: "from-[#8B5CF6] to-[#7C3AED]",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/admin/customers",
    color: "from-[#10B981] to-[#059669]",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
    color: "from-[#F59E0B] to-[#D97706]",
  },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ─── SKELETON LOADING ─── */
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Welcome skeleton */}
        <div className="h-8 w-64 bg-gray-200 dark:bg-white/[0.06] rounded-lg" />
        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[120px] bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-[100px] bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]"
            />
          ))}
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]" />
          <div className="h-80 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]" />
        </div>
        {/* Table */}
        <div className="h-72 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          Failed to load dashboard data. Make sure the backend is running.
        </p>
      </div>
    );
  }

  const { stats, recent_orders, top_products, monthly_revenue } = data;
  const maxRevenue = Math.max(...monthly_revenue.map((m) => m.revenue), 1);

  const kpiCards = [
    {
      label: "Total Revenue",
      value: `$${stats.total_revenue.toLocaleString()}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      label: "Total Orders",
      value: stats.total_orders.toLocaleString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingCart,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      label: "Total Products",
      value: stats.total_products.toLocaleString(),
      change: "+3",
      trend: "up" as const,
      icon: Package,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      label: "Total Customers",
      value: stats.total_customers.toLocaleString(),
      change: "+5.1%",
      trend: "up" as const,
      icon: Users,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
    },
  ];

  const alertCards = [
    {
      label: "Pending Orders",
      value: stats.pending_orders,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/admin/orders",
    },
    {
      label: "Low Stock Items",
      value: stats.low_stock,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      href: "/admin/products",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── WELCOME HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s what&apos;s happening with your store today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors shadow-lg shadow-[#3B82F6]/25"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </div>

      {/* ─── KPI INTELLIGENCE CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="group relative bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 overflow-hidden"
          >
            {/* Subtle gradient accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-50 dark:from-white/[0.02] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {card.value}
                </p>
                <div
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    card.trend === "up"
                      ? "text-emerald-600 bg-emerald-500/10"
                      : "text-red-600 bg-red-500/10"
                  }`}
                >
                  {card.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {card.change}
                </div>
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}
              >
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── ALERT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {alertCards.map((alert) => (
          <Link
            key={alert.label}
            href={alert.href}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md ${
              alert.value > 0
                ? "bg-white dark:bg-white/[0.03] border-gray-100 dark:border-white/[0.06]"
                : "bg-white dark:bg-white/[0.03] border-gray-100 dark:border-white/[0.06] opacity-60"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.bg}`}
            >
              <alert.icon className={`h-6 w-6 ${alert.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {alert.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {alert.value}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300 dark:text-gray-600" />
          </Link>
        ))}
      </div>

      {/* ─── CHARTS ROW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-[#3B82F6]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Revenue Overview
                </h2>
                <p className="text-[11px] text-gray-400">Monthly breakdown</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/[0.06] rounded-lg p-0.5">
              <button className="px-3 py-1 text-xs font-medium bg-white dark:bg-white/10 text-gray-900 dark:text-white rounded-md shadow-sm">
                Revenue
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md">
                Orders
              </button>
            </div>
          </div>
          <div className="flex items-end gap-2 sm:gap-3 h-52">
            {monthly_revenue.map((m, idx) => {
              const pct = Math.max((m.revenue / maxRevenue) * 100, 4);
              return (
                <div
                  key={m.month}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <span className="text-[10px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    $
                    {m.revenue >= 1000
                      ? `${(m.revenue / 1000).toFixed(1)}k`
                      : m.revenue}
                  </span>
                  <div className="w-full relative">
                    <div
                      className="w-full bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] rounded-t-lg transition-all duration-500 group-hover:from-[#2563EB] group-hover:to-[#3B82F6] min-h-[4px]"
                      style={{ height: `${pct}%`, minHeight: `${pct * 2}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {m.month.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Top Products
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-xs text-[#3B82F6] font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {top_products.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No sales data yet
              </p>
            ) : (
              top_products.slice(0, 5).map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      i === 0
                        ? "bg-amber-500/10 text-amber-500"
                        : i === 1
                        ? "bg-gray-200/80 dark:bg-white/[0.06] text-gray-500"
                        : i === 2
                        ? "bg-orange-500/10 text-orange-500"
                        : "bg-gray-100 dark:bg-white/[0.04] text-gray-400"
                    }`}
                  >
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {p.stock} in stock
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-emerald-500">
                      {p.total_sold}
                    </p>
                    <p className="text-[10px] text-gray-400">sold</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── RECENT ORDERS TABLE ─── */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 pb-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recent Orders
              </h2>
              <p className="text-[11px] text-gray-400">Latest transactions</p>
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-[#3B82F6] font-medium hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        {recent_orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 dark:text-gray-500">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left py-3 px-5 sm:px-6 font-medium text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">
                    Order
                  </th>
                  <th className="text-left py-3 px-3 font-medium text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left py-3 px-3 font-medium text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="text-right py-3 px-3 font-medium text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-center py-3 px-5 sm:px-6 font-medium text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent_orders.slice(0, 8).map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-5 sm:px-6">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        #{order.id.toString().padStart(4, "0")}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400 shrink-0">
                          {order.user?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                            {order.user?.name || "Guest"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 text-[13px] hidden sm:table-cell">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-gray-900 dark:text-white text-[13px]">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5 sm:px-6 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── QUICK ACTIONS ─── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 hover:-translate-y-0.5"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
              >
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
