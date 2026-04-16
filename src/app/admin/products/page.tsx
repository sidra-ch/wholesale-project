"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchAdminProducts,
  fetchAdminCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import Image from "next/image";

interface ProductImage {
  image_url: string;
  public_id?: string;
  alt_text?: string;
}

interface ProductRow {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  retail_price: string;
  wholesale_price: string;
  distributor_price: string;
  cost_price: string;
  moq: number;
  stock: number;
  low_stock_threshold: number;
  brand: string;
  unit: string;
  weight: string;
  is_active: boolean;
  is_featured: boolean;
  category_id: number;
  category?: { id: number; name: string };
  images: ProductImage[];
}

interface CategoryOption {
  id: number;
  name: string;
}

const emptyForm = {
  name: "",
  category_id: "",
  sku: "",
  description: "",
  short_description: "",
  retail_price: "",
  wholesale_price: "",
  distributor_price: "",
  cost_price: "",
  moq: "1",
  stock: "0",
  low_stock_threshold: "10",
  brand: "",
  unit: "piece",
  weight: "",
  is_active: true,
  is_featured: false,
  images: [] as ProductImage[],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Delete confirm
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        fetchAdminProducts({ search, page, per_page: 15 }),
        fetchAdminCategories(),
      ]);
      setProducts(prodData.data || []);
      setLastPage(prodData.last_page || 1);
      setTotal(prodData.total || 0);
      setCategories(
        (catData.categories || []).map((c: CategoryOption) => ({
          id: c.id,
          name: c.name,
        }))
      );
    } catch {
      toast("Failed to load products", "error");
    }
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: ProductRow) => {
    setEditing(p);
    setForm({
      name: p.name,
      category_id: String(p.category_id),
      sku: p.sku,
      description: p.description || "",
      short_description: p.short_description || "",
      retail_price: p.retail_price,
      wholesale_price: p.wholesale_price,
      distributor_price: p.distributor_price,
      cost_price: p.cost_price,
      moq: String(p.moq),
      stock: String(p.stock),
      low_stock_threshold: String(p.low_stock_threshold),
      brand: p.brand || "",
      unit: p.unit,
      weight: p.weight || "",
      is_active: p.is_active,
      is_featured: p.is_featured,
      images: p.images || [],
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            image_url: data.url,
            public_id: data.public_id,
            alt_text: form.name,
          },
        ],
      }));
      toast("Image uploaded");
    } catch {
      toast("Upload failed", "error");
    }
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category_id || !form.sku) {
      toast("Fill all required fields", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        retail_price: Number(form.retail_price),
        wholesale_price: Number(form.wholesale_price),
        distributor_price: Number(form.distributor_price),
        cost_price: Number(form.cost_price),
        moq: Number(form.moq),
        stock: Number(form.stock),
        low_stock_threshold: Number(form.low_stock_threshold),
        weight: form.weight ? Number(form.weight) : null,
      };

      if (editing) {
        await updateProduct(editing.id, payload);
        toast("Product updated");
      } else {
        await createProduct(payload);
        toast("Product created");
      }
      setShowModal(false);
      load();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast(msg || "Failed to save", "error");
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      toast("Product deleted");
      setDeleting(null);
      load();
    } catch {
      toast("Failed to delete", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Products</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} total product{total !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors shadow-lg shadow-[#3B82F6]/25"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name, SKU, or brand..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:focus:border-[#3B82F6] transition-colors dark:text-white dark:placeholder:text-gray-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    SKU
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Stock
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/[0.05] overflow-hidden shrink-0 relative">
                          {p.images?.[0] ? (
                            <Image
                              src={p.images[0].image_url}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {p.sku}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {p.category?.name || "â€”"}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                      ${parseFloat(p.retail_price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-medium ${
                          p.stock <= p.low_stock_threshold
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {p.is_active ? (
                          <Eye className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-300" />
                        )}
                        {p.is_featured && (
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(p.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.06]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {lastPage}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed dark:text-gray-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(lastPage, page + 1))}
                disabled={page >= lastPage}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed dark:text-gray-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleting !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F1219] rounded-2xl p-6 max-w-sm w-full shadow-xl dark:border dark:border-white/[0.06]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Product?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This action cannot be undone. The product and all its images will
              be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleting(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleting)}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0F1219] rounded-2xl w-full max-w-2xl shadow-xl my-8 dark:border dark:border-white/[0.06]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editing ? "Edit Product" : "New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name + SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-white/[0.06] dark:bg-white/[0.03] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) =>
                      setForm({ ...form, sku: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-white/[0.06] dark:bg-white/[0.03] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Category + Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category_id}
                    onChange={(e) =>
                      setForm({ ...form, category_id: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-white/[0.06] dark:bg-white/[0.03] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3B82F6] bg-white dark:bg-transparent dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-white/[0.06] dark:bg-white/[0.03] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                  />
                </div>
              </div>

              {/* Prices */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pricing
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(
                    [
                      ["retail_price", "Retail *"],
                      ["wholesale_price", "Wholesale *"],
                      ["distributor_price", "Distributor *"],
                      ["cost_price", "Cost *"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {label}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        className="w-full border border-gray-200 dark:border-white/[0.06] dark:bg-white/[0.03] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock, MOQ, Unit, Weight */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-white/[0.06] dark:bg-white/[0.03] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    MOQ *
                  </label>
                  <input
                    type="number"
                    value={form.moq}
                    onChange={(e) =>
                      setForm({ ...form, moq: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-white/[0.06] dark:bg-white/[0.03] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) =>
                      setForm({ ...form, unit: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-white/[0.06] dark:bg-white/[0.03] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.weight}
                    onChange={(e) =>
                      setForm({ ...form, weight: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-white/[0.06] dark:bg-white/[0.03] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-gray-200 dark:border-white/[0.06] dark:bg-white/[0.03] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3B82F6] dark:text-white resize-none"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Images
                </label>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-white/[0.06] group"
                    >
                      <Image
                        src={img.image_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/[0.1] flex flex-col items-center justify-center cursor-pointer hover:border-[#3B82F6] hover:bg-[#3B82F6]/5 transition-colors">
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">
                          Upload
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
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="rounded border-gray-300 dark:border-white/[0.1] text-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) =>
                      setForm({ ...form, is_featured: e.target.checked })
                    }
                    className="rounded border-gray-300 dark:border-white/[0.1] text-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                  Featured
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-colors disabled:opacity-50"
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
