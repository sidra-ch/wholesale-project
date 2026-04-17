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
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Activity,
  Zap,
  ChevronRight,
  Truck,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  CreditCard,
  UserPlus,
  PackageOpen,
  Ban,
  Calendar,
  Target,
} from "lucide-react";

/* ─── Types ─── */
interface DashboardData {
  stats: {
    totalRevenue: number;
    lastMonthRevenue: number;
    thisMonthRevenue: number;
    todayRevenue: number;
    revenueChange: string;
    totalOrders: number;
    lastMonthOrders: number;
    thisMonthOrders: number;
    thisWeekOrders: number;
    todayOrders: number;
    orderChange: string;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalProducts: number;
    totalCustomers: number;
    approvedCustomers: number;
    customerChange: string;
    pendingCustomers: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    avgOrderValue: number;
  };
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
  recentCustomers: Array<{
    id: number;
    name: string;
    email: string;
    businessName: string | null;
    status: string;
    orderCount: number;
    createdAt: string;
  }>;
}

const statusConfig: Record<string, { bg: string; dot: string }> = {
  pending: { bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  processing: { bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  shipped: { bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400", dot: "bg-purple-500" },
  delivered: { bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  cancelled: { bg: "bg-red-500/10 text-red-600 dark:text-red-400", dot: "bg-red-500" },
};

const paymentStatusConfig: Record<string, string> = {
  paid: "text-emerald-600 bg-emerald-500/10",
  unpaid: "text-amber-600 bg-amber-500/10",
  refunded: "text-red-600 bg-red-500/10",
};

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState<"revenue" | "orders">("revenue");

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ─── Loading skeleton ─── */
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-72 bg-gray-200 dark:bg-white/[0.06] rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[140px] bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]" />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[88px] bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[380px] bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]" />
          <div className="h-[380px] bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]" />
        </div>
        <div className="h-[400px] bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]" />
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
          Failed to load dashboard data. Please check your connection.
        </p>
        <button onClick={() => window.location.reload()} className="text-sm text-[#3B82F6] font-medium hover:underline flex items-center gap-1">
          <RefreshCcw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  const { stats, recentOrders, topProducts, monthlyRevenue, recentCustomers } = data;

  const chartData = monthlyRevenue;
  const maxChartVal = Math.max(...chartData.map((m) => chartMode === "revenue" ? m.revenue : m.orders), 1);

  // Order distribution for donut
  const orderDist = [
    { label: "Delivered", count: stats.deliveredOrders, color: "#10B981" },
    { label: "Processing", count: stats.processingOrders, color: "#3B82F6" },
    { label: "Shipped", count: stats.shippedOrders, color: "#8B5CF6" },
    { label: "Pending", count: stats.pendingOrders, color: "#F59E0B" },
    { label: "Cancelled", count: stats.cancelledOrders, color: "#EF4444" },
  ].filter((d) => d.count > 0);
  const totalDistOrders = orderDist.reduce((a, b) => a + b.count, 0);

  // Donut SVG calculations
  const donutSegments: Array<{ offset: number; pct: number; color: string }> = [];
  let cumulativeOffset = 0;
  orderDist.forEach((d) => {
    const pct = totalDistOrders > 0 ? (d.count / totalDistOrders) * 100 : 0;
    donutSegments.push({ offset: cumulativeOffset, pct, color: d.color });
    cumulativeOffset += pct;
  });

  const changeNum = (val: string) => {
    const n = parseFloat(val);
    return { isUp: n >= 0, display: `${n >= 0 ? "+" : ""}${val}%` };
  };

  const revChange = changeNum(stats.revenueChange);
  const ordChange = changeNum(stats.orderChange);
  const custChange = changeNum(stats.customerChange);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {greeting()}, {user?.name?.split(" ")[0] || "Admin"} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s your store overview for today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/reports" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <BarChart3 className="h-4 w-4" /> Reports
          </Link>
          <Link href="/admin/products" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors shadow-lg shadow-[#3B82F6]/25">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* ─── PRIMARY KPI CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="group relative bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Rs {stats.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${revChange.isUp ? "text-emerald-600 bg-emerald-500/10" : "text-red-600 bg-red-500/10"}`}>
                  {revChange.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {revChange.display}
                </span>
                <span className="text-[10px] text-gray-400">vs last month</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Today: <strong className="text-gray-600 dark:text-gray-300">Rs {stats.todayRevenue.toLocaleString()}</strong></span>
            <span className="text-[11px] text-gray-400">This month: <strong className="text-gray-600 dark:text-gray-300">Rs {stats.thisMonthRevenue.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Orders */}
        <div className="group relative bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{stats.totalOrders.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${ordChange.isUp ? "text-emerald-600 bg-emerald-500/10" : "text-red-600 bg-red-500/10"}`}>
                  {ordChange.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {ordChange.display}
                </span>
                <span className="text-[10px] text-gray-400">vs last month</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Today: <strong className="text-gray-600 dark:text-gray-300">{stats.todayOrders}</strong></span>
            <span className="text-[11px] text-gray-400">This week: <strong className="text-gray-600 dark:text-gray-300">{stats.thisWeekOrders}</strong></span>
          </div>
        </div>

        {/* Products */}
        <div className="group relative bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{stats.totalProducts.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-[11px]">
                {stats.lowStockProducts > 0 && (
                  <span className="text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md font-medium">{stats.lowStockProducts} low stock</span>
                )}
                {stats.outOfStockProducts > 0 && (
                  <span className="text-red-600 bg-red-500/10 px-1.5 py-0.5 rounded-md font-medium">{stats.outOfStockProducts} out</span>
                )}
                {stats.lowStockProducts === 0 && stats.outOfStockProducts === 0 && (
                  <span className="text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md font-medium">All stocked</span>
                )}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.04]">
            <Link href="/admin/inventory" className="text-[11px] text-[#3B82F6] font-medium hover:underline flex items-center gap-1">
              Manage inventory <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Customers */}
        <div className="group relative bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-bl-full" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{stats.totalCustomers.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${custChange.isUp ? "text-emerald-600 bg-emerald-500/10" : "text-red-600 bg-red-500/10"}`}>
                  {custChange.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {custChange.display}
                </span>
                <span className="text-[10px] text-gray-400">growth</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-cyan-500" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Active: <strong className="text-gray-600 dark:text-gray-300">{stats.approvedCustomers}</strong></span>
            {stats.pendingCustomers > 0 && (
              <span className="text-[11px] text-amber-600 font-medium">{stats.pendingCustomers} pending approval</span>
            )}
          </div>
        </div>
      </div>

      {/* ─── SECONDARY STAT STRIP ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.06] p-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.pendingOrders}</p>
            <p className="text-[11px] text-gray-400">Pending Orders</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.06] p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <RefreshCcw className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.processingOrders}</p>
            <p className="text-[11px] text-gray-400">Processing</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.06] p-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">Rs {stats.avgOrderValue.toLocaleString()}</p>
            <p className="text-[11px] text-gray-400">Avg Order Value</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.06] p-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.lowStockProducts + stats.outOfStockProducts}</p>
            <p className="text-[11px] text-gray-400">Stock Alerts</p>
          </div>
        </div>
      </div>

      {/* ─── CHARTS + ORDER DISTRIBUTION ROW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue / Orders Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-[#3B82F6]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {chartMode === "revenue" ? "Revenue Overview" : "Orders Overview"}
                </h2>
                <p className="text-[11px] text-gray-400">Last 12 months</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/[0.06] rounded-lg p-0.5">
              <button onClick={() => setChartMode("revenue")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartMode === "revenue" ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}>
                Revenue
              </button>
              <button onClick={() => setChartMode("orders")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartMode === "orders" ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}>
                Orders
              </button>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-400 text-sm">
              No data available yet
            </div>
          ) : (
            <div className="flex items-end gap-1.5 sm:gap-2 h-56">
              {chartData.map((m) => {
                const val = chartMode === "revenue" ? m.revenue : m.orders;
                const pct = Math.max((val / maxChartVal) * 100, 4);
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 group cursor-default">
                    <div className="relative">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-0.5 rounded-md">
                        {chartMode === "revenue"
                          ? `Rs ${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toLocaleString()}`
                          : `${val} orders`}
                      </span>
                    </div>
                    <div className="w-full relative">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 min-h-[4px] ${chartMode === "revenue" ? "bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] group-hover:from-[#2563EB] group-hover:to-[#3B82F6]" : "bg-gradient-to-t from-[#8B5CF6] to-[#A78BFA] group-hover:from-[#7C3AED] group-hover:to-[#8B5CF6]"}`}
                        style={{ height: `${pct * 2.2}px` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(m.month + "-01").toLocaleString("en-US", { month: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Distribution Donut */}
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-purple-500" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Order Status</h2>
          </div>

          {totalDistOrders === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No orders yet</div>
          ) : (
            <>
              {/* SVG Donut */}
              <div className="flex justify-center mb-5">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {donutSegments.map((seg, i) => (
                      <circle key={i} cx="18" cy="18" r="15.915" fill="none" strokeWidth="3"
                        stroke={seg.color}
                        strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                        strokeDashoffset={`${-seg.offset}`}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalDistOrders}</span>
                    <span className="text-[10px] text-gray-400 font-medium">Total Orders</span>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-2">
                {orderDist.map((d) => (
                  <div key={d.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[12px] text-gray-600 dark:text-gray-400">{d.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-gray-900 dark:text-white">{d.count}</span>
                      <span className="text-[10px] text-gray-400">{((d.count / totalDistOrders) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── TOP PRODUCTS + RECENT CUSTOMERS ROW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Top Selling Products</h2>
            </div>
            <Link href="/admin/products" className="text-xs text-[#3B82F6] font-medium hover:underline">View all</Link>
          </div>
          {topProducts.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">No sales data yet</div>
          ) : (
            <div className="space-y-3">
              {topProducts.slice(0, 5).map((p, i) => {
                const maxQty = Math.max(...topProducts.map((x) => x.totalQuantity || 0), 1);
                const barPct = ((p.totalQuantity || 0) / maxQty) * 100;
                return (
                  <div key={p.productId ?? i} className="group">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-amber-500/10 text-amber-500" : i === 1 ? "bg-gray-200/80 dark:bg-white/[0.06] text-gray-500" : i === 2 ? "bg-orange-500/10 text-orange-500" : "bg-gray-100 dark:bg-white/[0.04] text-gray-400"}`}>
                        #{i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{p.productName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{p.totalQuantity} sold</p>
                        <p className="text-[10px] text-gray-400">Rs {Number(p.totalRevenue || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="ml-10 h-1.5 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full transition-all duration-700" style={{ width: `${barPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Customers */}
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-cyan-500" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Customers</h2>
            </div>
            <Link href="/admin/customers" className="text-xs text-[#3B82F6] font-medium hover:underline">View all</Link>
          </div>
          {recentCustomers.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">No customers yet</div>
          ) : (
            <div className="space-y-3">
              {recentCustomers.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {c.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{c.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{c.businessName || c.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize ${c.status === "approved" ? "text-emerald-600 bg-emerald-500/10" : c.status === "pending" ? "text-amber-600 bg-amber-500/10" : "text-red-600 bg-red-500/10"}`}>
                      {c.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{c.orderCount} orders</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── RECENT ORDERS TABLE ─── */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
              <p className="text-[11px] text-gray-400">Latest transactions</p>
            </div>
          </div>
          <Link href="/admin/orders" className="text-xs text-[#3B82F6] font-medium hover:underline flex items-center gap-1">
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <PackageOpen className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-gray-500 text-sm">No orders yet</p>
            <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-1">Orders will appear here when customers start buying</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02]">
                  <th className="text-left py-3 px-5 sm:px-6 font-medium text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider">Order</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider hidden md:table-cell">Payment</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider">Amount</th>
                  <th className="text-center py-3 px-5 sm:px-6 font-medium text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 8).map((order) => {
                  const sc = statusConfig[order.status] || { bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" };
                  return (
                    <tr key={order.id} className="border-t border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-5 sm:px-6">
                        <Link href={`/admin/orders`} className="font-semibold text-gray-900 dark:text-white hover:text-[#3B82F6] transition-colors">
                          {order.orderNumber || `#${order.id.toString().padStart(4, "0")}`}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400 shrink-0">
                            {order.customerName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{order.customerName || "Guest"}</p>
                            <p className="text-[10px] text-gray-400 truncate hidden lg:block">{order.customerEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 hidden sm:table-cell">
                        <div>
                          <p className="text-[13px] text-gray-600 dark:text-gray-300">
                            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex text-[10px] w-fit font-semibold px-2 py-0.5 rounded-md capitalize ${paymentStatusConfig[order.paymentStatus] || "text-gray-500 bg-gray-100"}`}>
                            {order.paymentStatus}
                          </span>
                          <span className="text-[10px] text-gray-400 capitalize">{order.paymentMethod?.replace("_", " ")}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <p className="font-semibold text-gray-900 dark:text-white text-[13px]">Rs {Number(order.totalAmount || 0).toLocaleString()}</p>
                      </td>
                      <td className="py-3.5 px-5 sm:px-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize ${sc.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Add Product", icon: Plus, href: "/admin/products", color: "from-[#3B82F6] to-[#2563EB]" },
            { label: "View Orders", icon: ShoppingCart, href: "/admin/orders", color: "from-[#8B5CF6] to-[#7C3AED]" },
            { label: "Customers", icon: Users, href: "/admin/customers", color: "from-[#10B981] to-[#059669]" },
            { label: "Inventory", icon: Package, href: "/admin/inventory", color: "from-[#F59E0B] to-[#D97706]" },
            { label: "Reports", icon: BarChart3, href: "/admin/reports", color: "from-[#EC4899] to-[#DB2777]" },
            { label: "Settings", icon: Settings, href: "/admin/settings", color: "from-[#6366F1] to-[#4F46E5]" },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 hover:-translate-y-0.5">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-[12px] font-medium text-gray-600 dark:text-gray-300">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
