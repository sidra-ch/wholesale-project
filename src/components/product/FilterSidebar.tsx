"use client";

import { useState, useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCategories, fetchBrands } from "@/lib/api-data";
import type { Category } from "@/lib/types";

interface Filters {
  category: string;
  brand: string;
  priceRange: [number, number];
  moq: string;
  stock: string;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

function FilterContent({ filters, onChange }: FilterSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchBrands().then(setBrands);
  }, []);

  const resetFilters = () =>
    onChange({
      category: "",
      brand: "",
      priceRange: [0, 200],
      moq: "",
      stock: "",
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-text">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-xs text-candy hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium text-dark-text mb-2 block">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-chocolate bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div>
        <label className="text-sm font-medium text-dark-text mb-2 block">
          Brand
        </label>
        <select
          value={filters.brand}
          onChange={(e) => onChange({ ...filters, brand: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-chocolate bg-white"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium text-dark-text mb-2 block">
          Price Range
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) =>
              onChange({
                ...filters,
                priceRange: [Number(e.target.value), filters.priceRange[1]],
              })
            }
            placeholder="Min"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-chocolate"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) =>
              onChange({
                ...filters,
                priceRange: [filters.priceRange[0], Number(e.target.value)],
              })
            }
            placeholder="Max"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-chocolate"
          />
        </div>
      </div>

      {/* MOQ */}
      <div>
        <label className="text-sm font-medium text-dark-text mb-2 block">
          Min Order Qty
        </label>
        <select
          value={filters.moq}
          onChange={(e) => onChange({ ...filters, moq: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-chocolate bg-white"
        >
          <option value="">Any</option>
          <option value="12">Up to 12 units</option>
          <option value="24">Up to 24 units</option>
          <option value="48">Up to 48 units</option>
        </select>
      </div>

      {/* Stock */}
      <div>
        <label className="text-sm font-medium text-dark-text mb-2 block">
          Stock Status
        </label>
        <select
          value={filters.stock}
          onChange={(e) => onChange({ ...filters, stock: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-chocolate bg-white"
        >
          <option value="">All</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <FilterContent {...props} />
      </div>
    </div>
  );
}

export function MobileFilterDrawer(props: FilterSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-cream transition-colors"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterContent {...props} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
