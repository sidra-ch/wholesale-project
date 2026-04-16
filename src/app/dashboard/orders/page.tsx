"use client";

import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";

export default function OrdersPage() {
  const orders = [
    { id: "ORD-001", date: "Apr 14, 2026", items: 5, total: "$1,240.00", status: "Shipped" },
    { id: "ORD-002", date: "Apr 10, 2026", items: 3, total: "$680.00", status: "Processing" },
    { id: "ORD-003", date: "Apr 05, 2026", items: 8, total: "$2,150.00", status: "Delivered" },
    { id: "ORD-004", date: "Mar 28, 2026", items: 2, total: "$420.00", status: "Delivered" },
    { id: "ORD-005", date: "Mar 20, 2026", items: 6, total: "$1,890.00", status: "Delivered" },
  ];

  if (orders.length === 0) {
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
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left bg-light-gray/50">
                <th className="px-5 py-3 font-medium text-gray-500">Order ID</th>
                <th className="px-5 py-3 font-medium text-gray-500">Date</th>
                <th className="px-5 py-3 font-medium text-gray-500">Items</th>
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
                    {order.id}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{order.date}</td>
                  <td className="px-5 py-3.5 text-gray-500">{order.items} items</td>
                  <td className="px-5 py-3.5 font-medium text-dark-text">
                    {order.total}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-50 text-green-600"
                          : order.status === "Shipped"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-yellow-50 text-yellow-600"
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
    </motion.div>
  );
}
