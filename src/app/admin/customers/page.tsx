"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAdminCustomers, updateCustomerStatus } from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldCheck,
  ShieldX,
  Clock,
  Mail,
  Phone,
  ShoppingBag,
} from "lucide-react";

interface CustomerRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  orders_count: number;
  created_at: string;
  customer_group?: { id: number; name: string };
}

const statusCfg: Record<string, { color: string; label: string }> = {
  pending: { color: "bg-amber-100 text-amber-700", label: "Pending" },
  approved: { color: "bg-green-100 text-green-700", label: "Approved" },
  rejected: { color: "bg-red-100 text-red-700", label: "Rejected" },
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCustomers({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        per_page: 15,
      });
      setCustomers(data.data || []);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      toast("Failed to load customers", "error");
    }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await updateCustomerStatus(id, { status });
      toast("Customer status updated");
      load();
    } catch {
      toast("Failed to update status", "error");
    }
    setUpdating(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Customers</h2>
        <p className="text-sm text-gray-500">
          {total} total customer{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-chocolate transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              setStatusFilter("");
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              !statusFilter
                ? "bg-chocolate text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          {(["pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-chocolate text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {statusCfg[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No customers found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Contact
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">
                    Orders
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Group
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Joined
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const cfg = statusCfg[c.status] || statusCfg.pending;
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-chocolate/20 to-chocolate/5 flex items-center justify-center">
                            <User className="h-4 w-4 text-chocolate" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {c.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1 text-gray-600">
                            <Mail className="h-3 w-3" />
                            {c.email}
                          </p>
                          {c.phone && (
                            <p className="flex items-center gap-1 text-gray-400 text-xs">
                              <Phone className="h-3 w-3" />
                              {c.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-gray-700 font-medium">
                          <ShoppingBag className="h-3 w-3" />
                          {c.orders_count}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {c.customer_group?.name || "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex gap-1">
                          {c.status !== "approved" && (
                            <button
                              title="Approve"
                              onClick={() =>
                                handleStatusChange(c.id, "approved")
                              }
                              disabled={updating === c.id}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </button>
                          )}
                          {c.status !== "rejected" && (
                            <button
                              title="Reject"
                              onClick={() =>
                                handleStatusChange(c.id, "rejected")
                              }
                              disabled={updating === c.id}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            >
                              <ShieldX className="h-4 w-4" />
                            </button>
                          )}
                          {c.status !== "pending" && (
                            <button
                              title="Set Pending"
                              onClick={() =>
                                handleStatusChange(c.id, "pending")
                              }
                              disabled={updating === c.id}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-50"
                            >
                              <Clock className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {lastPage}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(lastPage, page + 1))}
                disabled={page >= lastPage}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
