"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryCard } from "@/components/product/CategoryCard";
import { fetchCategories } from "@/lib/api-data";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Categories" }]} />
      <section className="py-8 lg:py-12">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-dark-text mb-2">
              Product Categories
            </h1>
            <p className="text-gray-500 mb-8">
              Browse our complete range of wholesale confectionery categories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
