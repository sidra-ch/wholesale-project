import api from "./api";

// â”€â”€ Dashboard â”€â”€
export async function fetchDashboard() {
  const res = await api.get("/admin/dashboard");
  return res.data;
}

// â”€â”€ Products â”€â”€
export async function fetchAdminProducts(params?: {
  search?: string;
  category_id?: number;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/products", { params });
  return res.data;
}

export async function createProduct(data: Record<string, unknown>) {
  const res = await api.post("/admin/products", data);
  return res.data;
}

export async function updateProduct(
  id: number,
  data: Record<string, unknown>
) {
  const res = await api.put(`/admin/products/${id}`, data);
  return res.data;
}

export async function deleteProduct(id: number) {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
}

// â”€â”€ Categories â”€â”€
export async function fetchAdminCategories() {
  const res = await api.get("/admin/categories");
  return res.data;
}

export async function createCategory(data: Record<string, unknown>) {
  const res = await api.post("/admin/categories", data);
  return res.data;
}

export async function updateCategory(
  id: number,
  data: Record<string, unknown>
) {
  const res = await api.put(`/admin/categories/${id}`, data);
  return res.data;
}

export async function deleteCategory(id: number) {
  const res = await api.delete(`/admin/categories/${id}`);
  return res.data;
}

// â”€â”€ Orders â”€â”€
export async function fetchAdminOrders(params?: {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/orders", { params });
  return res.data;
}

export async function updateOrderStatus(id: number, status: string) {
  const res = await api.put(`/admin/orders/${id}`, { status });
  return res.data;
}

// â”€â”€ Customers â”€â”€
export async function fetchAdminCustomers(params?: {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/customers", { params });
  return res.data;
}

export async function updateCustomerStatus(
  id: number,
  data: { status?: string; customer_group_id?: number | null }
) {
  const res = await api.put(`/admin/customers/${id}`, data);
  return res.data;
}

// ── Upload Image ──
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/admin/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ── Inventory / Stock ──
export async function fetchInventory(params?: {
  search?: string;
  stock_status?: string;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/inventory", { params });
  return res.data;
}

export async function adjustStock(
  productId: number,
  data: { type: "in" | "out"; quantity: number; reason: string; note?: string }
) {
  const res = await api.post(`/admin/inventory/${productId}/adjust`, data);
  return res.data;
}

export async function fetchStockLogs(params?: {
  product_id?: number;
  type?: string;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/stock-logs", { params });
  return res.data;
}

// ── Payments ──
export async function fetchPayments(params?: {
  search?: string;
  status?: string;
  payment_method?: string;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/payments", { params });
  return res.data;
}

export async function updatePaymentStatus(
  id: number,
  data: { status: string; transaction_id?: string; notes?: string }
) {
  const res = await api.put(`/admin/payments/${id}`, data);
  return res.data;
}

// ── Reports ──
export async function fetchSalesReport(params?: {
  from?: string;
  to?: string;
  group_by?: string;
}) {
  const res = await api.get("/admin/reports/sales", { params });
  return res.data;
}

export async function fetchProductReport(params?: {
  from?: string;
  to?: string;
  limit?: number;
}) {
  const res = await api.get("/admin/reports/products", { params });
  return res.data;
}

export async function fetchCategoryReport(params?: {
  from?: string;
  to?: string;
}) {
  const res = await api.get("/admin/reports/categories", { params });
  return res.data;
}

export async function fetchCustomerReport(params?: {
  from?: string;
  to?: string;
  limit?: number;
}) {
  const res = await api.get("/admin/reports/customers", { params });
  return res.data;
}

export async function exportReport(type: string, params?: Record<string, string>) {
  const res = await api.get(`/admin/reports/${type}/export`, {
    params,
    responseType: "blob",
  });
  return res.data;
}

// ── Activity Logs ──
export async function fetchActivityLogs(params?: {
  search?: string;
  module?: string;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/activity-logs", { params });
  return res.data;
}

// ── Notifications ──
export async function fetchNotifications(params?: {
  page?: number;
  per_page?: number;
  read?: boolean;
}) {
  const res = await api.get("/admin/notifications", { params });
  return res.data;
}

export async function markNotificationRead(id: number) {
  const res = await api.put(`/admin/notifications/${id}/read`);
  return res.data;
}

export async function markAllNotificationsRead() {
  const res = await api.put("/admin/notifications/read-all");
  return res.data;
}

// ── Subcategories ──
export async function fetchSubcategories(params?: {
  search?: string;
  parent_id?: number;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/subcategories", { params });
  return res.data;
}

export async function createSubcategory(data: Record<string, unknown>) {
  const res = await api.post("/admin/subcategories", data);
  return res.data;
}

export async function updateSubcategory(id: number, data: Record<string, unknown>) {
  const res = await api.put(`/admin/subcategories/${id}`, data);
  return res.data;
}

export async function deleteSubcategory(id: number) {
  const res = await api.delete(`/admin/subcategories/${id}`);
  return res.data;
}

// ── Coupons ──
export async function fetchCoupons(params?: {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/coupons", { params });
  return res.data;
}

export async function createCoupon(data: Record<string, unknown>) {
  const res = await api.post("/admin/coupons", data);
  return res.data;
}

export async function updateCoupon(id: number, data: Record<string, unknown>) {
  const res = await api.put(`/admin/coupons/${id}`, data);
  return res.data;
}

export async function deleteCoupon(id: number) {
  const res = await api.delete(`/admin/coupons/${id}`);
  return res.data;
}

// ── Settings ──
export async function fetchSettings() {
  const res = await api.get("/admin/settings");
  return res.data;
}

export async function updateSettings(data: Record<string, string>) {
  const res = await api.put("/admin/settings", data);
  return res.data;
}

// ── Suppliers ──
export async function fetchSuppliers(params?: {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/suppliers", { params });
  return res.data;
}

export async function createSupplier(data: Record<string, unknown>) {
  const res = await api.post("/admin/suppliers", data);
  return res.data;
}

export async function fetchSupplier(id: number) {
  const res = await api.get(`/admin/suppliers/${id}`);
  return res.data;
}

export async function updateSupplier(id: number, data: Record<string, unknown>) {
  const res = await api.put(`/admin/suppliers/${id}`, data);
  return res.data;
}

export async function deleteSupplier(id: number) {
  const res = await api.delete(`/admin/suppliers/${id}`);
  return res.data;
}

// ── Purchase Orders ──
export async function fetchPurchaseOrders(params?: {
  search?: string;
  status?: string;
  supplier_id?: number;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/purchase-orders", { params });
  return res.data;
}

export async function createPurchaseOrder(data: Record<string, unknown>) {
  const res = await api.post("/admin/purchase-orders", data);
  return res.data;
}

export async function fetchPurchaseOrder(id: number) {
  const res = await api.get(`/admin/purchase-orders/${id}`);
  return res.data;
}

export async function updatePurchaseOrder(id: number, data: Record<string, unknown>) {
  const res = await api.put(`/admin/purchase-orders/${id}`, data);
  return res.data;
}

export async function receivePurchaseOrder(id: number, data: { items: Array<{ id: number; received_quantity: number }> }) {
  const res = await api.post(`/admin/purchase-orders/${id}/receive`, data);
  return res.data;
}

export async function deletePurchaseOrder(id: number) {
  const res = await api.delete(`/admin/purchase-orders/${id}`);
  return res.data;
}

// ── Admin Users & Roles (RBAC) ──
export async function fetchMyPermissions() {
  const res = await api.get("/admin/my-permissions");
  return res.data;
}

export async function fetchRoles() {
  const res = await api.get("/admin/roles");
  return res.data;
}

export async function createRole(data: Record<string, unknown>) {
  const res = await api.post("/admin/roles", data);
  return res.data;
}

export async function updateRole(id: number, data: Record<string, unknown>) {
  const res = await api.put(`/admin/roles/${id}`, data);
  return res.data;
}

export async function deleteRole(id: number) {
  const res = await api.delete(`/admin/roles/${id}`);
  return res.data;
}

export async function fetchPermissions() {
  const res = await api.get("/admin/permissions");
  return res.data;
}

export async function fetchAdminUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
  per_page?: number;
}) {
  const res = await api.get("/admin/admin-users", { params });
  return res.data;
}

export async function createAdminUser(data: Record<string, unknown>) {
  const res = await api.post("/admin/admin-users", data);
  return res.data;
}

export async function updateAdminUser(id: number, data: Record<string, unknown>) {
  const res = await api.put(`/admin/admin-users/${id}`, data);
  return res.data;
}

export async function deleteAdminUser(id: number) {
  const res = await api.delete(`/admin/admin-users/${id}`);
  return res.data;
}

