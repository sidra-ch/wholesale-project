"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchSalesReport,
  fetchProductReport,
  fetchCategoryReport,
  fetchCustomerReport,
  exportReport,
} from "@/lib/admin-api";
import { toast } from "@/components/ui/Toaster";
import {
  FileBarChart,
  TrendingUp,
  Package,
  Users,
  FolderTree,
  Download,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";

interface SalesData {
  date: string;
  total_orders: number;
  total_revenue: number;
  total_items: number;
}

interface ProductData {
  id: number;
  name: string;
  sku: string;
  total_sold: number;
  total_revenue: number;
}

interface CategoryData {
  id: number;
  name: string;
  total_products: number;
  total_sold: number;
  total_revenue: number;
}

interface CustomerData {
  id: number;
  name: string;
  email: string;
  total_orders: number;
  total_spent: number;
}

type Tab = "sales" | "products" | "categories" | "customers";

export default function AdminReportsPage() {
  const [tab, setTab] = useState<Tab>("sales");
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [to, setTo] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = { from, to };
      switch (tab) {
        case "sales": {
          const data = await fetchSalesReport(params);
          setSalesData(data.data || []);
          break;
        }
        case "products": {
          const data = await fetchProductReport(params);
          setProductData(data.data || []);
          break;
        }
        case "categories": {
          const data = await fetchCategoryReport(params);
          setCategoryData(data.data || []);
          break;
        }
        case "customers": {
          const data = await fetchCustomerReport(params);
          setCustomerData(data.data || []);
          break;
        }
      }
    } catch {
      toast("Failed to load report", "error");
    }
    setLoading(false);
  }, [tab, from, to]);

  useEffect(() => { loadReport(); }, [loadReport]);

  const handleExport = async () => {
    try {
      const blob = await exportReport(tab, { from, to });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tab}-report-${from}-to-${to}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast("Report exported successfully");
    } catch {
      toast("Failed to export report", "error");
    }
  };

  // Calculate totals for sales
  const totalRevenue = salesData.reduce((s, d) => s + d.total_revenue, 0);
  const totalOrders = salesData.reduce((s, d) => s + d.total_orders, 0);
  const totalItems = salesData.reduce((s, d) => s + d.total_items, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const maxRevenue = Math.max(...salesData.map((d) => d.total_revenue), 1);

  const tabs: { value: Tab; label: string; icon: React.ElementType }[] = [
    { value: "sales", label: "Sales", icon: TrendingUp },
    { value: "products", label: "Products", icon: Package },
    { value: "categories", label: "Categories", icon: FolderTree },
    { value: "customers", label: "Customers", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-[#3B82F6]" />
            Reports
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analyze your business performance
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Download className="h-4 w-4" />Export CSV
        </button>
      </div>

      {/* Tabs + Date Range */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.04] rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.value
                  ? "bg-white dark:bg-white/[0.1] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm outline-none focus:border-[#3B82F6] dark:text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-12 text-center text-gray-400 animate-pulse">
          Loading report...
        </div>
      ) : (
        <>
          {/* ── SALES TAB ── */}
          {tab === "sales" && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "from-[#3B82F6] to-[#6366F1]" },
                  { label: "Total Orders", value: totalOrders.toLocaleString(), icon: BarChart3, color: "from-[#10B981] to-[#059669]" },
                  { label: "Items Sold", value: totalItems.toLocaleString(), icon: Package, color: "from-[#F59E0B] to-[#D97706]" },
                  { label: "Avg Order Value", value: `$${avgOrderValue.toFixed(2)}`, icon: ArrowUpRight, color: "from-[#8B5CF6] to-[#7C3AED]" },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                        <kpi.icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart-like bar visualization */}
              <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Revenue</h3>
                {salesData.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No sales data for this period</p>
                ) : (
                  <div className="space-y-2">
                    {salesData.map((d) => (
                      <div key={d.date} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0">
                          {new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                        <div className="flex-1 h-7 bg-gray-100 dark:bg-white/[0.04] rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-lg flex items-center px-2"
                            style={{ width: `${Math.max((d.total_revenue / maxRevenue) * 100, 2)}%` }}
                          >
                            <span className="text-[10px] font-medium text-white whitespace-nowrap">
                              ${d.total_revenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 w-16 text-right">{d.total_orders} orders</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── PRODUCTS TAB ── */}
          {tab === "products" && (
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
              {productData.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No product data for this period</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">#</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">SKU</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Units Sold</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.map((p, i) => (
                        <tr key={p.id} className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                          <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{p.name}</td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{p.sku}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{p.total_sold.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-bold text-green-600 dark:text-green-400">${p.total_revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── CATEGORIES TAB ── */}
          {tab === "categories" && (
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
              {categoryData.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No category data for this period</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Category</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Products</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Units Sold</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryData.map((c) => (
                        <tr key={c.id} className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{c.name}</td>
                          <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400">{c.total_products}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{c.total_sold.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-bold text-green-600 dark:text-green-400">${c.total_revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── CUSTOMERS TAB ── */}
          {tab === "customers" && (
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
              {customerData.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No customer data for this period</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">#</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Email</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Orders</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.map((c, i) => (
                        <tr key={c.id} className="border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                          <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{c.name}</td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">{c.email}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{c.total_orders}</td>
                          <td className="py-3 px-4 text-right font-bold text-green-600 dark:text-green-400">${c.total_spent.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
