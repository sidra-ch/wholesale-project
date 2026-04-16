"use client";

import { useEffect, useState } from "react";
import { fetchDashboard } from "@/lib/admin-api";
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
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          <div className="h-80 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-400">
        Failed to load dashboard data. Make sure the backend is running.
      </div>
    );
  }

  const { stats, recent_orders, top_products, monthly_revenue } = data;

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats.total_revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Total Orders",
      value: stats.total_orders.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      label: "Total Products",
      value: stats.total_products.toLocaleString(),
      icon: Package,
      color: "bg-violet-50 text-violet-600",
      iconBg: "bg-violet-100",
    },
    {
      label: "Total Customers",
      value: stats.total_customers.toLocaleString(),
      icon: Users,
      color: "bg-cyan-50 text-cyan-600",
      iconBg: "bg-cyan-100",
    },
    {
      label: "Pending Orders",
      value: stats.pending_orders.toLocaleString(),
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      label: "Low Stock Items",
      value: stats.low_stock.toLocaleString(),
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      iconBg: "bg-red-100",
    },
  ];

  const maxRevenue = Math.max(...monthly_revenue.map((m) => m.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}
              >
                <card.icon className={`h-5 w-5 ${card.color.split(" ")[1]}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-semibold text-gray-900">
              Monthly Revenue
            </h2>
          </div>
          <div className="flex items-end gap-3 h-48">
            {monthly_revenue.map((m) => (
              <div
                key={m.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span className="text-xs text-gray-500 font-medium">
                  ${m.revenue >= 1000 ? `${(m.revenue / 1000).toFixed(1)}k` : m.revenue}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-chocolate to-candy rounded-t-lg transition-all duration-500 min-h-[4px]"
                  style={{
                    height: `${Math.max((m.revenue / maxRevenue) * 100, 3)}%`,
                  }}
                />
                <span className="text-xs text-gray-400">
                  {m.month.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <ArrowUpRight className="h-5 w-5 text-blue-500" />
            <h2 className="text-base font-semibold text-gray-900">
              Top Products
            </h2>
          </div>
          <div className="space-y-4">
            {top_products.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No sales data yet
              </p>
            ) : (
              top_products.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      ${parseFloat(p.retail_price).toFixed(2)} Â· {p.stock} in
                      stock
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    {p.total_sold} sold
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <ArrowDownRight className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-semibold text-gray-900">
            Recent Orders
          </h2>
        </div>
        {recent_orders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No orders yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 font-medium text-gray-500">
                    Order
                  </th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">
                    Total
                  </th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent_orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="py-3 px-3 font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {order.user?.name || "â€”"}
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          statusColors[order.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
