"use client";

import { motion } from "framer-motion";
import { ShoppingBag, DollarSign, Package, TrendingUp } from "lucide-react";

const stats = [
  { icon: ShoppingBag, label: "Total Orders", value: "24", color: "bg-blue-50 text-blue-600" },
  { icon: DollarSign, label: "Total Spent", value: "$12,450", color: "bg-green-50 text-green-600" },
  { icon: Package, label: "Pending Orders", value: "3", color: "bg-yellow-50 text-yellow-600" },
  { icon: TrendingUp, label: "This Month", value: "$2,340", color: "bg-purple-50 text-purple-600" },
];

export default function DashboardPage() {
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
              <p className="text-2xl font-bold text-dark-text">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-dark-text">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3 font-medium text-gray-500">
                  Order ID
                </th>
                <th className="px-5 py-3 font-medium text-gray-500">Date</th>
                <th className="px-5 py-3 font-medium text-gray-500">Items</th>
                <th className="px-5 py-3 font-medium text-gray-500">Total</th>
                <th className="px-5 py-3 font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "ORD-001", date: "Apr 14, 2026", items: 5, total: "$1,240.00", status: "Shipped" },
                { id: "ORD-002", date: "Apr 10, 2026", items: 3, total: "$680.00", status: "Processing" },
                { id: "ORD-003", date: "Apr 05, 2026", items: 8, total: "$2,150.00", status: "Delivered" },
              ].map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-50 hover:bg-light-gray/50"
                >
                  <td className="px-5 py-3.5 font-medium text-dark-text">
                    {order.id}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{order.date}</td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {order.items} items
                  </td>
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
