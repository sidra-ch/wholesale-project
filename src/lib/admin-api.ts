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

// â”€â”€ Media Upload â”€â”€
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
