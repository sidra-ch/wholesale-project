"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAdminOrders, updateOrderStatus } from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface OrderRow {
  id: number;
  total: string;
  status: string;
  created_at: string;
  user?: { id: number; name: string; email: string; phone: string };
  items?: Array<{
    id: number;
    quantity: number;
    price: string;
    product?: { id: number; name: string; slug: string };
  }>;
}

const statusConfig: Record<
  string,
  { color: string; icon: React.ElementType; label: string }
> = {
  pending: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Pending" },
  processing: { color: "bg-blue-100 text-blue-700", icon: Package, label: "Processing" },
  shipped: { color: "bg-purple-100 text-purple-700", icon: Truck, label: "Shipped" },
  delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Delivered" },
  cancelled: { color: "bg-red-100 text-red-700", icon: XCircle, label: "Cancelled" },
};

const allStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Detail
  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        per_page: 15,
      });
      setOrders(data.data || []);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      toast("Failed to load orders", "error");
    }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast("Order status updated");
      if (selected && selected.id === orderId) {
        setSelected({ ...selected, status: newStatus });
      }
      load();
    } catch {
      toast("Failed to update status", "error");
    }
    setUpdatingStatus(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Orders</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {total} total order{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order # or customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:focus:border-[#3B82F6] transition-colors dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => {
              setStatusFilter("");
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              !statusFilter
                ? "bg-[#3B82F6] text-white shadow-sm"
                : "bg-white dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.06]"
            }`}
          >
            All
          </button>
          {allStatuses.map((s) => {
            const cfg = statusConfig[s];
            return (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors capitalize ${
                  statusFilter === s
                    ? "bg-[#3B82F6] text-white shadow-sm"
                    : "bg-white dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Order #
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Customer
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Total
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const cfg = statusConfig[o.status] || statusConfig.pending;
                  return (
                    <tr
                      key={o.id}
                      className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        #{o.id}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {o.user?.name || "Guest"}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {o.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(o.total).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${cfg.color}`}
                        >
                          <cfg.icon className="h-3 w-3" />
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelected(o)}
                          className="text-sm text-[#3B82F6] font-medium hover:underline"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.06]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {lastPage}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 dark:text-gray-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(lastPage, page + 1))}
                disabled={page >= lastPage}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 dark:text-gray-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F1219] rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto dark:border dark:border-white/[0.06]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order #{selected.id}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Customer */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Customer
                </h4>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selected.user?.name || "Guest"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selected.user?.email}
                </p>
                {selected.user?.phone && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selected.user.phone}
                  </p>
                )}
              </div>

              {/* Items */}
              {selected.items && selected.items.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Items
                  </h4>
                  <div className="space-y-2">
                    {selected.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/[0.03] rounded-xl text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity} Ã— $
                            {parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                        <span className="font-semibold">
                          $
                          {(item.quantity * parseFloat(item.price)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                <span className="font-medium text-gray-500 dark:text-gray-400">Total</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ${parseFloat(selected.total).toFixed(2)}
                </span>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Update Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map((s) => {
                    const cfg = statusConfig[s];
                    const isActive = selected.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() =>
                          !isActive && handleStatusChange(selected.id, s)
                        }
                        disabled={isActive || updatingStatus}
                        className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                          isActive
                            ? `${cfg.color} ring-2 ring-offset-1 ring-current`
                            : "bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.1]"
                        } disabled:cursor-not-allowed`}
                      >
                        <cfg.icon className="h-3 w-3" />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs text-gray-400">
                Created: {new Date(selected.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
