"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";
import api from "@/lib/api";

interface OrderData {
  id: number;
  total: string;
  status: string;
  createdAt: string;
  items_count?: number;
  items?: Array<{ id: number; productName?: string; quantity: number; price: string }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/my/orders")
      .then((res) => setOrders(res.data.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600",
    processing: "bg-blue-50 text-blue-600",
    shipped: "bg-purple-50 text-purple-600",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
  };

  if (!loading && orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Start browsing products and place your first wholesale order."
        actionLabel="Browse Products"
        actionHref="/products"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold text-dark-text mb-6">My Orders</h1>
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 animate-pulse">
          Loading orders...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left bg-light-gray/50">
                  <th className="px-5 py-3 font-medium text-gray-500">Order ID</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Date</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Total</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-light-gray/30"
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
        </div>
      )}
    </motion.div>
  );
}
