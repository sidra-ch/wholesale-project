"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  fetchAdminCategories,
} from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  FolderTree,
} from "lucide-react";

interface Subcategory {
  id: number;
  parentId: number;
  name: string;
  slug: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  parent?: { id: number; name: string };
  productsCount?: number;
}

interface ParentCategory {
  id: number;
  name: string;
  slug: string;
}

export default function AdminSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [parents, setParents] = useState<ParentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [parentFilter, setParentFilter] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({ name: "", parent_id: "", slug: "", sort_order: "0", is_active: true });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSubcategories({
        search: search || undefined,
        parentId: parentFilter || undefined,
        page,
        perPage: 20,
      });
      setSubcategories(data.data || []);
      setLastPage(data.lastPage || data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      toast("Failed to load subcategories", "error");
    }
    setLoading(false);
  }, [search, parentFilter, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    fetchAdminCategories().then((data) => {
      const cats = (data.data || data || []).filter((c: ParentCategory & { parentId?: number }) => !c.parentId);
      setParents(cats);
    }).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: "", parent_id: parents[0]?.id?.toString() || "", slug: "", sort_order: "0", is_active: true });
    setShowForm(true);
  };

  const openEdit = (sub: Subcategory) => {
    setEditing(sub);
    setFormData({
      name: sub.name,
      parent_id: sub.parentId.toString(),
      slug: sub.slug,
      sort_order: sub.sortOrder.toString(),
      is_active: sub.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.parent_id) return;
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        parent_id: parseInt(formData.parent_id),
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        sort_order: parseInt(formData.sort_order) || 0,
        is_active: formData.is_active,
      };
      if (editing) {
        await updateSubcategory(editing.id, payload);
        toast("Subcategory updated");
      } else {
        await createSubcategory(payload);
        toast("Subcategory created");
      }
      setShowForm(false);
      load();
    } catch {
      toast(`Failed to ${editing ? "update" : "create"} subcategory`, "error");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this subcategory?")) return;
    setDeleting(id);
    try {
      await deleteSubcategory(id);
      toast("Subcategory deleted");
      load();
    } catch {
      toast("Failed to delete subcategory", "error");
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#3B82F6]" />
            Subcategories
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} subcategor{total !== 1 ? "ies" : "y"}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Subcategory
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subcategories..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:focus:border-[#3B82F6] transition-colors dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <select
          value={parentFilter}
          onChange={(e) => { setParentFilter(e.target.value ? parseInt(e.target.value) : ""); setPage(1); }}
          className="px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white"
        >
          <option value="">All Parent Categories</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">Loading subcategories...</div>
        ) : subcategories.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No subcategories found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Subcategory</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Parent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Slug</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Products</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Order</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{sub.name}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                        <FolderTree className="h-3 w-3" /> {sub.parent?.name || "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-xs">{sub.slug}</td>
                    <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">{sub.productsCount ?? 0}</td>
                    <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">{sub.sortOrder}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        sub.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-500/10 dark:text-gray-500"
                      }`}>
                        {sub.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(sub)} className="p-1.5 text-gray-400 hover:text-[#3B82F6] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          disabled={deleting === sub.id}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
          <div className="bg-white dark:bg-[#0F1219] rounded-2xl w-full max-w-md shadow-xl dark:border dark:border-white/[0.06]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editing ? "Edit" : "Add"} Subcategory
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parent Category *</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                >
                  <option value="">Select parent</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Subcategory name"
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Auto-generated if empty"
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.name || !formData.parent_id}
                className="w-full py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : editing ? "Update Subcategory" : "Create Subcategory"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
