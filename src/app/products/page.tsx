"use client";

import { useState, useMemo, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import {
  FilterSidebar,
  MobileFilterDrawer,
} from "@/components/product/FilterSidebar";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchProducts } from "@/lib/api-data";
import type { Product } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const filtered = useMemo(() => {
    let result = [...products];

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
  }, [filters, sort, products]);

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

          {/* Content */}
          <div className="flex gap-8">
            <FilterSidebar filters={filters} onChange={setFilters} />
            <div className="flex-1">
              {filtered.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
