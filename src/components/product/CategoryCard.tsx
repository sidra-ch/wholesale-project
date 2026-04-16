"use client";

import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
    >
      <Link
        href={`/products?category=${category.slug}`}
        className="group block relative rounded-3xl overflow-hidden premium-shadow hover:premium-shadow-lg transition-all duration-500"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <SafeImage
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/20 to-transparent group-hover:from-chocolate/90 transition-all duration-500" />

          {/* Content overlay */}
          <div className="absolute inset-0 p-3 sm:p-4 lg:p-6 flex flex-col justify-end">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg lg:text-xl mb-1 group-hover:translate-y-0 transition-transform duration-300">
                  {category.name}
                </h3>
                <p className="text-white/70 text-sm">
                  {category.productCount} Products
                </p>
              </div>
              <motion.div
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-candy transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <ArrowUpRight className="h-5 w-5 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
