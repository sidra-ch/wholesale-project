"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Plus,
  Edit2,
  Trash2,
  X,
  Copy,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react";

interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: string;
  min_order_amount?: string;
  max_discount?: string;
  usage_limit?: number;
  used_count: number;
  starts_at?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    min_order_amount: "",
    max_discount: "",
    usage_limit: "",
    starts_at: "",
    expires_at: "",
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCoupons({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        per_page: 15,
      });
      setCoupons(data.data || []);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      toast("Failed to load coupons", "error");
    }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setFormData((prev) => ({ ...prev, code }));
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      min_order_amount: "",
      max_discount: "",
      usage_limit: "",
      starts_at: "",
      expires_at: "",
      is_active: true,
    });
    generateCode();
    setShowForm(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setFormData({
      code: c.code,
      type: c.type,
      value: c.value,
      min_order_amount: c.min_order_amount || "",
      max_discount: c.max_discount || "",
      usage_limit: c.usage_limit?.toString() || "",
      starts_at: c.starts_at?.split("T")[0] || "",
      expires_at: c.expires_at?.split("T")[0] || "",
      is_active: c.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.value) return;
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        is_active: formData.is_active,
      };
      if (formData.min_order_amount) payload.min_order_amount = parseFloat(formData.min_order_amount);
      if (formData.max_discount) payload.max_discount = parseFloat(formData.max_discount);
      if (formData.usage_limit) payload.usage_limit = parseInt(formData.usage_limit);
      if (formData.starts_at) payload.starts_at = formData.starts_at;
      if (formData.expires_at) payload.expires_at = formData.expires_at;

      if (editing) {
        await updateCoupon(editing.id, payload);
        toast("Coupon updated");
      } else {
        await createCoupon(payload);
        toast("Coupon created");
      }
      setShowForm(false);
      load();
    } catch {
      toast(`Failed to ${editing ? "update" : "create"} coupon`, "error");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this coupon?")) return;
    setDeleting(id);
    try {
      await deleteCoupon(id);
      toast("Coupon deleted");
      load();
    } catch {
      toast("Failed to delete coupon", "error");
    }
    setDeleting(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast("Coupon code copied");
  };

  const isExpired = (c: Coupon) => c.expires_at && new Date(c.expires_at) < new Date();
  const isUsedUp = (c: Coupon) => c.usage_limit !== undefined && c.usage_limit !== null && c.used_count >= c.usage_limit;

  const getStatus = (c: Coupon) => {
    if (!c.is_active) return { label: "Inactive", cls: "bg-gray-100 text-gray-500 dark:bg-gray-500/10 dark:text-gray-500" };
    if (isExpired(c)) return { label: "Expired", cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" };
    if (isUsedUp(c)) return { label: "Used Up", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" };
    return { label: "Active", cls: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Ticket className="h-5 w-5 text-[#3B82F6]" />
            Coupons & Promotions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} coupon{total !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by coupon code..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:focus:border-[#3B82F6] transition-colors dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <div className="flex gap-1.5">
          {["", "active", "expired", "inactive"].map((f) => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${
                statusFilter === f
                  ? "bg-[#3B82F6] text-white shadow-sm"
                  : "bg-white dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.06]"
              }`}
            >
              {f || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No coupons found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Discount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Min Order</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Usage</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Validity</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => {
                  const status = getStatus(c);
                  return (
                    <tr key={c.id} className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/[0.06] px-2.5 py-1 rounded-lg text-xs">
                            {c.code}
                          </span>
                          <button onClick={() => copyCode(c.code)} className="p-1 text-gray-400 hover:text-[#3B82F6] transition-colors">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        {c.type === "percentage" ? (
                          <span className="inline-flex items-center gap-0.5">
                            {parseFloat(c.value)}<Percent className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5">
                            <DollarSign className="h-3.5 w-3.5" />{parseFloat(c.value).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {c.min_order_amount ? `$${parseFloat(c.min_order_amount).toFixed(2)}` : "—"}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">
                        {c.used_count}{c.usage_limit ? `/${c.usage_limit}` : ""}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
                        {c.starts_at || c.expires_at ? (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {c.starts_at ? new Date(c.starts_at).toLocaleDateString() : "—"}
                            {" → "}
                            {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "∞"}
                          </span>
                        ) : (
                          "No limit"
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-[#3B82F6] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={deleting === c.id}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F1219] rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto dark:border dark:border-white/[0.06]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editing ? "Edit" : "Create"} Coupon
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coupon Code *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SAVE10"
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm font-mono outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500"
                  />
                  <button
                    onClick={generateCode}
                    className="px-3 py-2.5 bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-400 rounded-xl text-xs font-medium hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "percentage" | "fixed" })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === "percentage" ? "e.g. 10" : "e.g. 5.00"}
                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Order Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                    placeholder="No minimum"
                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Discount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                    placeholder="No cap"
                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usage Limit</label>
                <input
                  type="number"
                  min="0"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  placeholder="Unlimited"
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
              </label>

              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.code || !formData.value}
                className="w-full py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : editing ? "Update Coupon" : "Create Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
