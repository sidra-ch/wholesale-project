import api from "./api";
import type { Product, Category, ApiProduct, ApiCategory } from "./types";
import { products as staticProducts, categories as staticCategories } from "./data";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

/**
 * Convert an API product to the frontend Product type.
 */
function mapApiProduct(p: ApiProduct): Product {
  const images =
    p.images && p.images.length > 0
      ? p.images.map((img) => img.image_url)
      : [PLACEHOLDER_IMAGE];

  const wholesale = parseFloat(p.wholesale_price);
  const retail = parseFloat(p.retail_price);
  const distributor = parseFloat(p.distributor_price);

  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    description: p.description || p.short_description || "",
    price: wholesale,
    comparePrice: retail > wholesale ? retail : undefined,
    retailPrice: retail,
    distributorPrice: distributor,
    images,
    category: p.category?.name || "",
    brand: p.brand || "",
    moq: p.moq,
    stock: p.stock,
    unit: p.unit,
    featured: p.is_featured,
  };
}

/**
 * Convert an API category to the frontend Category type.
 */
function mapApiCategory(c: ApiCategory): Category {
  return {
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    image: c.image || PLACEHOLDER_IMAGE,
    description: "",
    productCount: c.products_count ?? 0,
  };
}

/**
 * Fetch all products from the API. Falls back to static data on error.
 */
export async function fetchProducts(params?: {
  category?: string;
  brand?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
  order?: string;
  page?: number;
  per_page?: number;
}): Promise<{ products: Product[]; total: number }> {
  try {
    const res = await api.get("/products", { params });
    const data = res.data;
    // Laravel paginate returns { data: [...], total, ... }
    const items: ApiProduct[] = data.data || data;
    return {
      products: items.map(mapApiProduct),
      total: data.total || items.length,
    };
  } catch {
    return { products: staticProducts, total: staticProducts.length };
  }
}

/**
 * Fetch featured products from the API.
 */
export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await api.get("/products/featured");
    const items: ApiProduct[] = res.data.products || res.data;
    return items.map(mapApiProduct);
  } catch {
    return staticProducts.filter((p) => p.featured);
  }
}

/**
 * Fetch a single product by slug from the API.
 */
export async function fetchProduct(
  slug: string
): Promise<{ product: Product | null; related: Product[] }> {
  try {
    const res = await api.get(`/products/${slug}`);
    const product = mapApiProduct(res.data.product);
    const related = (res.data.related || []).map(mapApiProduct);
    return { product, related };
  } catch {
    const product = staticProducts.find((p) => p.slug === slug) || null;
    const related = product
      ? staticProducts
          .filter((p) => p.category === product.category && p.id !== product.id)
          .slice(0, 4)
      : [];
    return { product, related };
  }
}

/**
 * Fetch all categories from the API.
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await api.get("/categories");
    const items: ApiCategory[] = res.data.categories || res.data;
    // Only return main categories (no subcategories)
    return items.filter((c) => !c.parent_id).map(mapApiCategory);
  } catch {
    return staticCategories;
  }
}

/**
 * Fetch all brands from the API.
 */
export async function fetchBrands(): Promise<string[]> {
  try {
    const res = await api.get("/products/brands");
    return res.data.brands || [];
  } catch {
    return [...new Set(staticProducts.map((p) => p.brand))];
  }
}
