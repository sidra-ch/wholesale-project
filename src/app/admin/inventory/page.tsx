"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchInventory, adjustStock, fetchStockLogs } from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Warehouse,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  XCircle,
  Package,
  Plus,
  Minus,
  X,
  Filter,
} from "lucide-react";

interface InventoryRow {
  id: number;
  name: string;
  sku: string;
  stock: number;
  low_stock_threshold: number;
  unit: string;
  category?: { id: number; name: string };
}

interface StockLog {
  id: number;
  product_id: number;
  type: "in" | "out";
  quantity: number;
  reason: string;
  note?: string;
  created_at: string;
  product?: { name: string; sku: string };
  creator?: { name: string };
}

type StockFilter = "" | "low" | "out" | "in_stock";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Adjust modal
  const [adjusting, setAdjusting] = useState<InventoryRow | null>(null);
  const [adjustType, setAdjustType] = useState<"in" | "out">("in");
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("manual");
  const [adjustNote, setAdjustNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Logs tab
  const [tab, setTab] = useState<"stock" | "logs">("stock");
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [logsLastPage, setLogsLastPage] = useState(1);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInventory({
        search: search || undefined,
        stock_status: stockFilter || undefined,
        page,
        per_page: 20,
      });
      setProducts(data.data || []);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      toast("Failed to load inventory", "error");
    }
    setLoading(false);
  }, [search, stockFilter, page]);

  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const data = await fetchStockLogs({ page: logsPage, per_page: 20 });
      setLogs(data.data || []);
      setLogsLastPage(data.last_page || 1);
    } catch {
      toast("Failed to load stock logs", "error");
    }
    setLogsLoading(false);
  }, [logsPage]);

  useEffect(() => {
    if (tab === "stock") loadProducts();
  }, [loadProducts, tab]);

  useEffect(() => {
    if (tab === "logs") loadLogs();
  }, [loadLogs, tab]);

  const handleAdjust = async () => {
    if (!adjusting || !adjustQty) return;
    setSubmitting(true);
    try {
      await adjustStock(adjusting.id, {
        type: adjustType,
        quantity: parseInt(adjustQty),
        reason: adjustReason,
        note: adjustNote || undefined,
      });
      toast(`Stock ${adjustType === "in" ? "increased" : "decreased"} successfully`);
      setAdjusting(null);
      setAdjustQty("");
      setAdjustNote("");
      loadProducts();
    } catch {
      toast("Failed to adjust stock", "error");
    }
    setSubmitting(false);
  };

  const getStockBadge = (row: InventoryRow) => {
    if (row.stock <= 0)
      return { label: "Out of Stock", cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" };
    if (row.stock <= row.low_stock_threshold)
      return { label: "Low Stock", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" };
    return { label: "In Stock", cls: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-[#3B82F6]" />
            Inventory Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track stock levels and manage inventory
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.04] rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("stock")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "stock"
              ? "bg-white dark:bg-white/[0.1] text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Package className="h-4 w-4 inline mr-1.5" />
          Stock Levels
        </button>
        <button
          onClick={() => setTab("logs")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "logs"
              ? "bg-white dark:bg-white/[0.1] text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Filter className="h-4 w-4 inline mr-1.5" />
          Stock Logs
        </button>
      </div>

      {tab === "stock" && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:focus:border-[#3B82F6] transition-colors dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {([
                { value: "" as StockFilter, label: "All" },
                { value: "in_stock" as StockFilter, label: "In Stock" },
                { value: "low" as StockFilter, label: "Low Stock" },
                { value: "out" as StockFilter, label: "Out of Stock" },
              ]).map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setStockFilter(f.value); setPage(1); }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    stockFilter === f.value
                      ? "bg-[#3B82F6] text-white shadow-sm"
                      : "bg-white dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                <ArrowUpCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Products</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{total}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Low Stock</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {products.filter((p) => p.stock > 0 && p.stock <= p.low_stock_threshold).length}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Out of Stock</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {products.filter((p) => p.stock <= 0).length}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400 animate-pulse">Loading inventory...</div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No products found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">SKU</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Category</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Stock</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Threshold</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((row) => {
                      const badge = getStockBadge(row);
                      return (
                        <tr key={row.id} className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{row.name}</td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{row.sku}</td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{row.category?.name || "—"}</td>
                          <td className="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">
                            {row.stock} <span className="text-xs font-normal text-gray-400">{row.unit}</span>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">{row.low_stock_threshold}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${badge.cls}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => { setAdjusting(row); setAdjustType("in"); setAdjustQty(""); setAdjustNote(""); }}
                              className="text-sm text-[#3B82F6] font-medium hover:underline"
                            >
                              Adjust
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
        </>
      )}

      {tab === "logs" && (
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
          {logsLoading ? (
            <div className="p-12 text-center text-gray-400 animate-pulse">Loading stock logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No stock logs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Product</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Type</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Qty</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Reason</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Note</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">By</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">{log.product?.name || "—"}</p>
                        <p className="text-xs text-gray-400">{log.product?.sku}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {log.type === "in" ? (
                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
                            <ArrowUpCircle className="h-3.5 w-3.5" /> IN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-medium">
                            <ArrowDownCircle className="h-3.5 w-3.5" /> OUT
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">{log.quantity}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 capitalize">{log.reason}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">{log.note || "—"}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{log.creator?.name || "System"}</td>
                      <td className="py-3 px-4 text-gray-400 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {logsLastPage > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.06]">
              <p className="text-sm text-gray-500 dark:text-gray-400">Page {logsPage} of {logsLastPage}</p>
              <div className="flex gap-1">
                <button onClick={() => setLogsPage(Math.max(1, logsPage - 1))} disabled={logsPage <= 1} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 dark:text-gray-400">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setLogsPage(Math.min(logsLastPage, logsPage + 1))} disabled={logsPage >= logsLastPage} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 dark:text-gray-400">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjusting && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F1219] rounded-2xl w-full max-w-md shadow-xl dark:border dark:border-white/[0.06]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Adjust Stock</h3>
              <button onClick={() => setAdjusting(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Product</p>
                <p className="font-semibold text-gray-900 dark:text-white">{adjusting.name}</p>
                <p className="text-xs text-gray-400">Current stock: {adjusting.stock} {adjusting.unit}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setAdjustType("in")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    adjustType === "in"
                      ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 ring-1 ring-green-300 dark:ring-green-500/30"
                      : "bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Plus className="h-4 w-4" /> Stock In
                </button>
                <button
                  onClick={() => setAdjustType("out")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    adjustType === "out"
                      ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 ring-1 ring-red-300 dark:ring-red-500/30"
                      : "bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Minus className="h-4 w-4" /> Stock Out
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white"
                >
                  <option value="manual">Manual Adjustment</option>
                  <option value="restock">Restock</option>
                  <option value="return">Return</option>
                  <option value="adjustment">Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note (optional)</label>
                <textarea
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  rows={2}
                  placeholder="Add a note..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white dark:placeholder:text-gray-500 resize-none"
                />
              </div>

              <button
                onClick={handleAdjust}
                disabled={submitting || !adjustQty}
                className="w-full py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : `${adjustType === "in" ? "Add" : "Remove"} ${adjustQty || 0} ${adjusting.unit}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
