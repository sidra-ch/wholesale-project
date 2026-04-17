export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  publicId?: string;
  type: "image" | "video";
  altText?: string;
  sortOrder: number;
}

export interface ApiProduct {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  retailPrice: string;
  wholesalePrice: string;
  distributorPrice: string;
  costPrice: string;
  moq: number;
  stock: number;
  lowStockThreshold: number;
  brand: string;
  unit: string;
  weight?: string;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  category?: { id: number; name: string; slug: string };
}

export interface ApiCategory {
  id: number;
  parentId?: number;
  name: string;
  slug: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
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
  retailPrice?: number;
  distributorPrice?: number;
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
