"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import {
  FilterSidebar,
  MobileFilterDrawer,
} from "@/components/product/FilterSidebar";
import { EmptyState } from "@/components/ui/EmptyState";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { fetchProducts } from "@/lib/api-data";
import type { Product } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    category: categoryParam,
    brand: "",
    priceRange: [0, 200] as [number, number],
    moq: "",
    stock: "",
  });
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    fetchProducts().then(({ products: data }) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Search suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery, products]);

  const filtered = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      result = result.filter(
        (p) =>
          p.category
            .toLowerCase()
            .replace(/\s+/g, "-")
            .includes(filters.category) ||
          p.category.toLowerCase().includes(filters.category.replace(/-/g, " "))
      );
    }
    if (filters.brand) {
      result = result.filter((p) => p.brand === filters.brand);
    }
    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    if (filters.moq) {
      result = result.filter((p) => p.moq <= Number(filters.moq));
    }
    if (filters.stock === "in-stock") {
      result = result.filter((p) => p.stock > 0);
    } else if (filters.stock === "out-of-stock") {
      result = result.filter((p) => p.stock === 0);
    }

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [filters, sort, products, searchQuery]);

  return (
    <>
      <Breadcrumb items={[{ label: "Products" }]} />
      <section className="py-8 lg:py-12">
        <Container>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-dark-text">
                All Products
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filtered.length} products found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MobileFilterDrawer filters={filters} onChange={setFilters} />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search products, brands, categories..."
                className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-2xl text-sm outline-none focus:border-chocolate focus:ring-2 focus:ring-chocolate/10 bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-light-gray/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-text truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.brand} · {p.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-chocolate">Rs {p.price.toFixed(2)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex gap-0 lg:gap-8">
            <FilterSidebar filters={filters} onChange={setFilters} />
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gray-100" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-10 bg-gray-100 rounded-xl w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {filtered.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  title="No products found"
                  description="Try adjusting your filters or search criteria."
                />
              )}
            </div>
          </div>
        </Container>
      </section>
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
