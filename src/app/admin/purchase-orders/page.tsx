"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ClipboardList, Plus, Search, Eye, Trash2, X, Check, Package,
  ChevronLeft, ChevronRight, Truck,
} from "lucide-react";
import {
  fetchPurchaseOrders, createPurchaseOrder, updatePurchaseOrder,
  receivePurchaseOrder, deletePurchaseOrder,
  fetchSuppliers, fetchAdminProducts,
} from "@/lib/admin-api";

interface POItem {
  id?: number;
  productId: number;
  product?: { id: number; name: string; sku: string; stock?: number };
  quantity: number;
  receivedQuantity: number;
  unitPrice: number;
  subtotal: number;
  productName?: string;
}

interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  supplier?: { id: number; name: string };
  creator?: { id: number; name: string };
  status: "draft" | "sent" | "partial" | "received" | "cancelled";
  subtotal: string;
  taxAmount: string;
  shippingCost: string;
  totalAmount: string;
  notes: string | null;
  expectedAt: string | null;
  receivedAt: string | null;
  items?: POItem[];
  createdAt: string;
}

interface SupplierOption { id: number; name: string }
interface ProductOption { id: number; name: string; sku: string; costPrice: string }

const statusColors: Record<string, string> = {
  draft: "bg-gray-200/80 dark:bg-white/[0.06] text-gray-600 dark:text-gray-400",
  sent: "bg-blue-500/10 text-blue-500",
  partial: "bg-amber-500/10 text-amber-500",
  received: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-red-500/10 text-red-500",
};

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState<PurchaseOrder | null>(null);
  const [showReceive, setShowReceive] = useState<PurchaseOrder | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<PurchaseOrder | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Create form
  const [formSupplier, setFormSupplier] = useState(0);
  const [formItems, setFormItems] = useState<Array<{ product_id: number; quantity: number; unit_cost: number }>>([]);
  const [formTax, setFormTax] = useState(0);
  const [formShipping, setFormShipping] = useState(0);
  const [formNotes, setFormNotes] = useState("");
  const [formExpected, setFormExpected] = useState("");

  // Receive form
  const [receiveItems, setReceiveItems] = useState<Array<{ id: number; name: string; ordered: number; received: number; receiving: number }>>([]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPurchaseOrders({ search, status: statusFilter || undefined, page, perPage: 15 });
      setOrders(res.data);
      setLastPage(res.lastPage || res.last_page || 1);
      setTotal(res.total);
    } catch { showToast("error", "Failed to load purchase orders"); }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const loadOptions = async () => {
    try {
      const [supRes, prodRes] = await Promise.all([
        fetchSuppliers({ perPage: 100 }),
        fetchAdminProducts({ perPage: 200 }),
      ]);
      setSuppliers(supRes.data?.map((s: SupplierOption) => ({ id: s.id, name: s.name })) || []);
      setProducts(prodRes.data?.map((p: ProductOption) => ({ id: p.id, name: p.name, sku: p.sku, costPrice: p.costPrice })) || []);
    } catch {}
  };

  const openCreate = async () => {
    await loadOptions();
    setFormSupplier(0);
    setFormItems([{ product_id: 0, quantity: 1, unit_cost: 0 }]);
    setFormTax(0); setFormShipping(0); setFormNotes(""); setFormExpected("");
    setShowCreate(true);
  };

  const addItem = () => setFormItems([...formItems, { product_id: 0, quantity: 1, unit_cost: 0 }]);
  const removeItem = (i: number) => setFormItems(formItems.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, value: number) => {
    const items = [...formItems];
    items[i] = { ...items[i], [field]: value };
    setFormItems(items);
  };

  const formSubtotal = formItems.reduce((s, i) => s + i.quantity * i.unit_cost, 0);
  const formTotal = formSubtotal + formTax + formShipping;

  const handleCreate = async () => {
    if (!formSupplier) { showToast("error", "Select a supplier"); return; }
    if (formItems.some((i) => !i.product_id)) { showToast("error", "Select products"); return; }
    setSaving(true);
    try {
      await createPurchaseOrder({
        supplier_id: formSupplier,
        items: formItems,
        tax_amount: formTax,
        shipping_cost: formShipping,
        notes: formNotes || null,
        expected_date: formExpected || null,
      });
      showToast("success", "Purchase order created");
      setShowCreate(false);
      load();
    } catch (e: unknown) {
      showToast("error", (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create");
    }
    setSaving(false);
  };

  const openReceive = (po: PurchaseOrder) => {
    if (!po.items) return;
    setReceiveItems(po.items.map((item) => ({
      id: item.id!,
      name: item.productName || item.product?.name || `Product #${item.productId}`,
      ordered: item.quantity,
      received: item.receivedQuantity,
      receiving: 0,
    })));
    setShowReceive(po);
  };

  const handleReceive = async () => {
    if (!showReceive) return;
    const items = receiveItems.filter((i) => i.receiving > 0).map((i) => ({ id: i.id, received_quantity: i.receiving }));
    if (items.length === 0) { showToast("error", "Enter quantities to receive"); return; }
    setSaving(true);
    try {
      await receivePurchaseOrder(showReceive.id, { items });
      showToast("success", "Stock received successfully");
      setShowReceive(null);
      load();
    } catch (e: unknown) {
      showToast("error", (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to receive");
    }
    setSaving(false);
  };

  const handleStatusChange = async (po: PurchaseOrder, status: string) => {
    try {
      await updatePurchaseOrder(po.id, { status });
      showToast("success", `Status updated to ${status}`);
      load();
    } catch (e: unknown) {
      showToast("error", (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deletePurchaseOrder(deleteConfirm.id);
      showToast("success", "Purchase order deleted");
      setDeleteConfirm(null);
      load();
    } catch (e: unknown) {
      showToast("error", (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete");
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-[#3B82F6]" /> Purchase Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{total} order{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors shadow-lg shadow-[#3B82F6]/25">
          <Plus className="h-4 w-4" /> Create PO
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search PO number or supplier..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="partial">Partial</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-gray-200 dark:border-white/10 border-t-[#3B82F6] rounded-full animate-spin" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No purchase orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left py-3 px-5 font-medium text-gray-400 text-xs uppercase">PO Number</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-400 text-xs uppercase">Supplier</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-400 text-xs uppercase hidden md:table-cell">Total</th>
                  <th className="text-center py-3 px-3 font-medium text-gray-400 text-xs uppercase">Status</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-400 text-xs uppercase hidden lg:table-cell">Expected</th>
                  <th className="text-center py-3 px-3 font-medium text-gray-400 text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((po) => (
                  <tr key={po.id} className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                    <td className="py-3.5 px-5 font-semibold text-gray-900 dark:text-white">{po.poNumber}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span>{po.supplier?.name || "—"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium hidden md:table-cell">Rs {parseFloat(po.totalAmount).toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize ${statusColors[po.status]}`}>{po.status}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 text-xs hidden lg:table-cell">{po.expectedAt || "—"}</td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setShowDetail(po)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-[#3B82F6]"><Eye className="h-4 w-4" /></button>
                        {po.status === "draft" && (
                          <button onClick={() => handleStatusChange(po, "sent")} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-blue-500" title="Mark as Sent"><Truck className="h-4 w-4" /></button>
                        )}
                        {(po.status === "sent" || po.status === "partial") && (
                          <button onClick={() => { setShowDetail(po); setTimeout(() => openReceive(po), 100); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-emerald-500" title="Receive"><Check className="h-4 w-4" /></button>
                        )}
                        {(po.status === "draft" || po.status === "cancelled") && (
                          <button onClick={() => setDeleteConfirm(po)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        )}
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
      {showDetail && !showReceive && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{showDetail.poNumber}</h2>
              <button onClick={() => setShowDetail(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <p><span className="text-gray-500">Supplier:</span> {showDetail.supplier?.name}</p>
              <p><span className="text-gray-500">Status:</span> <span className={`px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${statusColors[showDetail.status]}`}>{showDetail.status}</span></p>
              <p><span className="text-gray-500">Created by:</span> {showDetail.creator?.name}</p>
              <p><span className="text-gray-500">Expected:</span> {showDetail.expectedAt || "—"}</p>
              <p><span className="text-gray-500">Subtotal:</span> Rs {parseFloat(showDetail.subtotal).toFixed(2)}</p>
              <p><span className="text-gray-500">Tax:</span> Rs {parseFloat(showDetail.taxAmount).toFixed(2)}</p>
              <p><span className="text-gray-500">Shipping:</span> Rs {parseFloat(showDetail.shippingCost).toFixed(2)}</p>
              <p className="font-semibold"><span className="text-gray-500">Total:</span> Rs {parseFloat(showDetail.totalAmount).toFixed(2)}</p>
            </div>
            {showDetail.notes && <p className="text-sm text-gray-500 mb-4">Notes: {showDetail.notes}</p>}
            {showDetail.items && showDetail.items.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Items</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-white/[0.06]">
                      <th className="text-left py-2 text-xs text-gray-400">Product</th>
                      <th className="text-center py-2 text-xs text-gray-400">Qty</th>
                      <th className="text-center py-2 text-xs text-gray-400">Received</th>
                      <th className="text-right py-2 text-xs text-gray-400">Unit Cost</th>
                      <th className="text-right py-2 text-xs text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showDetail.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-white/[0.03]">
                        <td className="py-2">{item.productName || item.product?.name || `#${item.productId}`}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-center">{item.receivedQuantity}</td>
                        <td className="py-2 text-right">Rs {parseFloat(String(item.unitPrice)).toFixed(2)}</td>
                        <td className="py-2 text-right">Rs {parseFloat(String(item.subtotal)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {(showDetail.status === "sent" || showDetail.status === "partial") && (
              <button onClick={() => openReceive(showDetail)} className="mt-4 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600">
                <Check className="h-4 w-4 inline mr-1" /> Receive Items
              </button>
            )}
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {showReceive && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowReceive(null)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Receive Items - {showReceive.poNumber}</h2>
              <button onClick={() => setShowReceive(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              {receiveItems.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-white/[0.06]">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Ordered: {item.ordered} | Received: {item.received} | Remaining: {item.ordered - item.received}</p>
                  </div>
                  <input type="number" min={0} max={item.ordered - item.received}
                    value={item.receiving} onChange={(e) => {
                      const items = [...receiveItems];
                      items[i] = { ...items[i], receiving: Math.min(parseInt(e.target.value) || 0, item.ordered - item.received) };
                      setReceiveItems(items);
                    }}
                    className="w-20 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm text-center" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowReceive(null)} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] text-sm font-medium">Cancel</button>
              <button disabled={saving} onClick={handleReceive}
                className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:opacity-50">
                {saving ? "Processing..." : "Receive"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Purchase Order</h2>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>
            </div>

            {/* Supplier & dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Supplier *</label>
                <select value={formSupplier} onChange={(e) => setFormSupplier(+e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm">
                  <option value={0}>Select supplier...</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Expected Date</label>
                <input type="date" value={formExpected} onChange={(e) => setFormExpected(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm" />
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Items</label>
                <button onClick={addItem} className="text-xs text-[#3B82F6] font-medium flex items-center gap-1"><Plus className="h-3 w-3" /> Add Item</button>
              </div>
              <div className="space-y-2">
                {formItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-white/[0.06]">
                    <select value={item.product_id} onChange={(e) => {
                      const pid = +e.target.value;
                      const p = products.find((pr) => pr.id === pid);
                      updateItem(i, "product_id", pid);
                      if (p) updateItem(i, "unit_cost", parseFloat(p.costPrice) || 0);
                    }} className="flex-1 px-2 py-2 rounded-lg border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm">
                      <option value={0}>Select product...</option>
                      {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                    </select>
                    <input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(i, "quantity", +e.target.value)}
                      className="w-20 px-2 py-2 rounded-lg border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm text-center" placeholder="Qty" />
                    <input type="number" min={0} step={0.01} value={item.unit_cost} onChange={(e) => updateItem(i, "unit_cost", +e.target.value)}
                      className="w-24 px-2 py-2 rounded-lg border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm text-right" placeholder="Cost" />
                    <span className="text-sm font-medium w-20 text-right">Rs {(item.quantity * item.unit_cost).toFixed(2)}</span>
                    {formItems.length > 1 && (
                      <button onClick={() => removeItem(i)} className="p-1 text-red-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Tax</label>
                <input type="number" min={0} step={0.01} value={formTax} onChange={(e) => setFormTax(+e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Shipping</label>
                <input type="number" min={0} step={0.01} value={formShipping} onChange={(e) => setFormShipping(+e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm" />
              </div>
              <div className="flex items-end">
                <p className="text-lg font-bold text-gray-900 dark:text-white">Total: Rs {formTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Notes</label>
              <textarea rows={2} value={formNotes} onChange={(e) => setFormNotes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm resize-none" />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] text-sm font-medium">Cancel</button>
              <button disabled={saving} onClick={handleCreate}
                className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] disabled:opacity-50 shadow-lg shadow-[#3B82F6]/25">
                {saving ? "Creating..." : "Create PO"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Purchase Order</h3>
            <p className="text-sm text-gray-500 mb-6">Delete <strong>{deleteConfirm.poNumber}</strong>? This cannot be undone.</p>
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
