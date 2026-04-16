"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
} from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";

interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  image: string;
  sort_order: number;
  is_active: boolean;
  products_count: number;
}

const emptyForm = {
  name: "",
  image: "",
  sort_order: "0",
  is_active: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<CategoryRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCategories();
      setCategories(data.categories || []);
    } catch {
      toast("Failed to load categories", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c: CategoryRow) => {
    setEditing(c);
    setForm({
      name: c.name,
      image: c.image || "",
      sort_order: String(c.sort_order),
      is_active: c.is_active,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: data.url }));
      toast("Image uploaded");
    } catch {
      toast("Upload failed", "error");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast("Category name is required", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        image: form.image || null,
        sort_order: Number(form.sort_order),
        is_active: form.is_active,
      };
      if (editing) {
        await updateCategory(editing.id, payload);
        toast("Category updated");
      } else {
        await createCategory(payload);
        toast("Category created");
      }
      setShowModal(false);
      load();
    } catch {
      toast("Failed to save category", "error");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteCategory(deleting.id);
      toast("Category deleted");
      setDeleting(null);
      load();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast(msg || "Failed to delete", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-chocolate text-white rounded-xl text-sm font-medium hover:bg-chocolate/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white rounded-2xl border border-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No categories yet. Create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative h-32 bg-gray-100">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                    No Image
                  </div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-2 bg-white rounded-lg text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(c)}
                    className="p-2 bg-white rounded-lg text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <div className="flex items-center gap-2">
                    {c.is_active ? (
                      <Eye className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-300" />
                    )}
                    <GripVertical className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {c.products_count} product{c.products_count !== 1 ? "s" : ""}{" "}
                  Â· Order #{c.sort_order}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleting && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete &ldquo;{deleting.name}&rdquo;?
            </h3>
            {deleting.products_count > 0 ? (
              <p className="text-sm text-red-600 mb-6">
                This category has {deleting.products_count} product
                {deleting.products_count !== 1 ? "s" : ""}. Move or delete them
                first.
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone.
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleting(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting.products_count > 0}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editing ? "Edit Category" : "New Category"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-chocolate"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-chocolate"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                {form.image ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group mb-2">
                    <Image
                      src={form.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-chocolate hover:bg-cream/50 transition-colors">
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-chocolate border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-400">
                          Click to upload
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="rounded border-gray-300 text-chocolate focus:ring-chocolate"
                />
                Active
              </label>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium bg-chocolate text-white rounded-xl hover:bg-chocolate/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
