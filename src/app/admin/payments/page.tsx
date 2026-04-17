"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchPayments, updatePaymentStatus } from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  X,
  Eye,
} from "lucide-react";

interface Payment {
  id: number;
  orderId: number;
  amount: string;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  order?: {
    id: number;
    orderNumber: string;
    totalAmount: string;
    user?: { name: string; email: string };
  };
}

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  pending: { color: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400", icon: Clock, label: "Pending" },
  paid: { color: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400", icon: CheckCircle, label: "Paid" },
  failed: { color: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400", icon: XCircle, label: "Failed" },
  refunded: { color: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400", icon: RefreshCw, label: "Refunded" },
};

const methodLabels: Record<string, string> = {
  cod: "Cash on Delivery",
  bank_transfer: "Bank Transfer",
  credit_card: "Credit Card",
  online: "Online Payment",
};

const allStatuses = ["pending", "paid", "failed", "refunded"];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Detail / update modal
  const [selected, setSelected] = useState<Payment | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [txnId, setTxnId] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPayments({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        perPage: 15,
      });
      setPayments(data.data || []);
      setLastPage(data.lastPage || data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      toast("Failed to load payments", "error");
    }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const openDetail = (p: Payment) => {
    setSelected(p);
    setNewStatus(p.status);
    setTxnId(p.transactionId || "");
    setNotes(p.notes || "");
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      await updatePaymentStatus(selected.id, {
        status: newStatus,
        transaction_id: txnId || undefined,
        notes: notes || undefined,
      });
      toast("Payment updated successfully");
      setSelected(null);
      load();
    } catch {
      toast("Failed to update payment", "error");
    }
    setUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#3B82F6]" />
          Payments
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {total} total payment{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {allStatuses.map((s) => {
          const cfg = statusConfig[s];
          const count = payments.filter((p) => p.status === s).length;
          return (
            <div key={s} className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.color}`}>
                <cfg.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{cfg.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order # or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:focus:border-[#3B82F6] transition-colors dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => { setStatusFilter(""); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              !statusFilter
                ? "bg-[#3B82F6] text-white shadow-sm"
                : "bg-white dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.06]"
            }`}
          >
            All
          </button>
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors capitalize ${
                statusFilter === s
                  ? "bg-[#3B82F6] text-white shadow-sm"
                  : "bg-white dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.06]"
              }`}
            >
              {statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No payments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Order</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Method</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const cfg = statusConfig[p.status] || statusConfig.pending;
                  return (
                    <tr key={p.id} className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        {p.order?.orderNumber || `#${p.orderId}`}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">{p.order?.user?.name || "—"}</p>
                        <p className="text-xs text-gray-400">{p.order?.user?.email}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                        <DollarSign className="h-3.5 w-3.5 inline" />
                        {parseFloat(p.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
                        {methodLabels[p.paymentMethod] || p.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                          <cfg.icon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button onClick={() => openDetail(p)} className="text-sm text-[#3B82F6] font-medium hover:underline inline-flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> View
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

      {/* Payment Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F1219] rounded-2xl w-full max-w-md shadow-xl dark:border dark:border-white/[0.06]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selected.order?.orderNumber || `#${selected.orderId}`}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Rs {parseFloat(selected.amount).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Method</p>
                  <p className="font-medium text-gray-900 dark:text-white">{methodLabels[selected.paymentMethod] || selected.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{new Date(selected.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selected.transactionId && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">{selected.transactionId}</p>
                </div>
              )}

              <hr className="border-gray-100 dark:border-white/[0.06]" />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                >
                  {allStatuses.map((s) => (
                    <option key={s} value={s}>{statusConfig[s].label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction ID</label>
                <input
                  type="text"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  placeholder="External transaction reference"
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Add notes..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500 resize-none"
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
