export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  public_id?: string;
  type: "image" | "video";
  alt_text?: string;
  sort_order: number;
}

export interface ApiProduct {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description?: string;
  retail_price: string;
  wholesale_price: string;
  distributor_price: string;
  cost_price: string;
  moq: number;
  stock: number;
  low_stock_threshold: number;
  brand: string;
  unit: string;
  weight?: string;
  is_active: boolean;
  is_featured: boolean;
  images: ProductImage[];
  category?: { id: number; name: string; slug: string };
}

export interface ApiCategory {
  id: number;
  parent_id?: number;
  name: string;
  slug: string;
  image: string;
  sort_order: number;
  is_active: boolean;
  products_count?: number;
}

// Frontend-facing types (used by components)
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  brand: string;
  moq: number;
  stock: number;
  unit: string;
  ingredients?: string;
  packaging?: string;
  deliveryInfo?: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
  phone: string;
  role: "admin" | "customer";
  status: "pending" | "approved" | "rejected";
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}
