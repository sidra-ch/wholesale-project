"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Truck, Plus, Search, Edit2, Trash2, X, Eye,
  Phone, Mail, MapPin, Building2, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  fetchSuppliers, createSupplier, updateSupplier, deleteSupplier,
} from "@/lib/admin-api";

interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  contact_person: string | null;
  contact_phone: string | null;
  payment_terms: string | null;
  status: "active" | "inactive";
  notes: string | null;
  purchase_orders_count?: number;
  created_at: string;
}

const emptyForm: { name: string; email: string; phone: string; address: string; city: string; country: string; contact_person: string; contact_phone: string; payment_terms: string; status: string; notes: string } = {
  name: "", email: "", phone: "", address: "", city: "", country: "",
  contact_person: "", contact_phone: "", payment_terms: "", status: "active", notes: "",
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Supplier | null>(null);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Supplier | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchSuppliers({ search, status: statusFilter || undefined, page, per_page: 15 });
      setSuppliers(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch { showToast("error", "Failed to load suppliers"); }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s: Supplier) => {
    setEditing(s);
    setForm({
      name: s.name, email: s.email || "", phone: s.phone || "",
      address: s.address || "", city: s.city || "", country: s.country || "",
      contact_person: s.contact_person || "", contact_phone: s.contact_phone || "",
      payment_terms: s.payment_terms || "", status: s.status, notes: s.notes || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast("error", "Name is required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateSupplier(editing.id, form);
        showToast("success", "Supplier updated");
      } else {
        await createSupplier(form);
        showToast("success", "Supplier created");
      }
      setShowModal(false);
      load();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save";
      showToast("error", msg);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteSupplier(deleteConfirm.id);
      showToast("success", "Supplier deleted");
      setDeleteConfirm(null);
      load();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete";
      showToast("error", msg);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Truck className="h-6 w-6 text-[#3B82F6]" /> Suppliers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{total} supplier{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors shadow-lg shadow-[#3B82F6]/25">
          <Plus className="h-4 w-4" /> Add Supplier
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search suppliers..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-gray-200 dark:border-white/10 border-t-[#3B82F6] rounded-full animate-spin" /></div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No suppliers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left py-3 px-5 font-medium text-gray-400 text-xs uppercase">Name</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-400 text-xs uppercase hidden md:table-cell">Contact</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-400 text-xs uppercase hidden lg:table-cell">Location</th>
                  <th className="text-center py-3 px-3 font-medium text-gray-400 text-xs uppercase">POs</th>
                  <th className="text-center py-3 px-3 font-medium text-gray-400 text-xs uppercase">Status</th>
                  <th className="text-center py-3 px-3 font-medium text-gray-400 text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-gray-900 dark:text-white">{s.name}</p>
                      {s.email && <p className="text-xs text-gray-400">{s.email}</p>}
                    </td>
                    <td className="py-3.5 px-3 hidden md:table-cell">
                      <div className="space-y-1">
                        {s.contact_person && <p className="text-xs text-gray-500">{s.contact_person}</p>}
                        {s.phone && <p className="text-xs text-gray-400 flex items-center gap-1"><Phone className="h-3 w-3" />{s.phone}</p>}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 hidden lg:table-cell text-gray-500 text-xs">
                      {[s.city, s.country].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium">{s.purchase_orders_count ?? 0}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                        s.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-200/80 dark:bg-white/[0.06] text-gray-500"
                      }`}>{s.status}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setShowDetail(s)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-[#3B82F6]"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-amber-500"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteConfirm(s)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {lastPage > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-white/[0.06]">
            <span className="text-xs text-gray-400">Page {page} of {lastPage} ({total} items)</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
              <button disabled={page >= lastPage} onClick={() => setPage(page + 1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{showDetail.name}</h2>
              <button onClick={() => setShowDetail(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              {showDetail.email && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Mail className="h-4 w-4 text-gray-400" />{showDetail.email}</div>}
              {showDetail.phone && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Phone className="h-4 w-4 text-gray-400" />{showDetail.phone}</div>}
              {showDetail.address && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><MapPin className="h-4 w-4 text-gray-400" />{showDetail.address}</div>}
              {(showDetail.city || showDetail.country) && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Building2 className="h-4 w-4 text-gray-400" />{[showDetail.city, showDetail.country].filter(Boolean).join(", ")}</div>}
              <hr className="border-gray-200 dark:border-white/[0.06]" />
              {showDetail.contact_person && <p><span className="font-medium text-gray-500">Contact:</span> {showDetail.contact_person} {showDetail.contact_phone ? `(${showDetail.contact_phone})` : ""}</p>}
              {showDetail.payment_terms && <p><span className="font-medium text-gray-500">Payment Terms:</span> {showDetail.payment_terms}</p>}
              <p><span className="font-medium text-gray-500">Status:</span> <span className={showDetail.status === "active" ? "text-emerald-500" : "text-gray-400"}>{showDetail.status}</span></p>
              <p><span className="font-medium text-gray-500">Purchase Orders:</span> {showDetail.purchase_orders_count ?? 0}</p>
              {showDetail.notes && <p><span className="font-medium text-gray-500">Notes:</span> {showDetail.notes}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editing ? "Edit" : "Add"} Supplier</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Country</label>
                <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Contact Person</label>
                <input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Contact Phone</label>
                <input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Payment Terms</label>
                <select value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none">
                  <option value="">Select...</option>
                  <option value="Net-7">Net-7</option>
                  <option value="Net-15">Net-15</option>
                  <option value="Net-30">Net-30</option>
                  <option value="Net-60">Net-60</option>
                  <option value="COD">COD</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Notes</label>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/[0.04]">Cancel</button>
              <button disabled={saving} onClick={handleSave}
                className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] disabled:opacity-50 shadow-lg shadow-[#3B82F6]/25">
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Supplier</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
