"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, DollarSign, Package, TrendingUp, Clock } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

interface OrderData {
  id: number;
  total: string;
  status: string;
  createdAt: string;
  items_count?: number;
  items?: Array<{ id: number }>;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/my/orders")
      .then((res) => setOrders(res.data.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.total || "0"), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const thisMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthSpent = thisMonthOrders.reduce((sum, o) => sum + parseFloat(o.total || "0"), 0);

  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: orders.length.toString(), color: "bg-blue-50 text-blue-600" },
    { icon: DollarSign, label: "Total Spent", value: `Rs ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "bg-green-50 text-green-600" },
    { icon: Clock, label: "Pending Orders", value: pendingOrders.toString(), color: "bg-yellow-50 text-yellow-600" },
    { icon: TrendingUp, label: "This Month", value: `Rs ${thisMonthSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "bg-purple-50 text-purple-600" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600",
    processing: "bg-blue-50 text-blue-600",
    shipped: "bg-purple-50 text-purple-600",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold text-dark-text mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-text">{loading ? "..." : stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-dark-text">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-xs text-candy font-medium hover:underline">
            View All
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 animate-pulse">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No orders yet</p>
            <Link href="/products" className="text-sm text-candy font-medium mt-2 inline-block hover:underline">
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 font-medium text-gray-500">Order ID</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Date</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Total</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-light-gray/50"
                  >
                    <td className="px-5 py-3.5 font-medium text-dark-text">
                      #{order.id.toString().padStart(4, "0")}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-dark-text">
                      Rs {parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          statusColors[order.status] || "bg-gray-50 text-gray-500"
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
    </motion.div>
  );
}
