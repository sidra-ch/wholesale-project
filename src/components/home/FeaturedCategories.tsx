"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { fetchCategories } from "@/lib/api-data";
import type { Category } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { useScrollFadeUp } from "@/hooks/useGSAPScroll";

export function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const ref = useScrollFadeUp(".gsap-fade-up", 0.12, 40);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <section className="py-16 lg:py-20">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-candy text-xs font-bold tracking-widest uppercase mb-2">Shop by Category</p>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#2E1B12]">Popular Categories</h2>
          </div>
          <Link
            href="/categories"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 border border-candy text-candy rounded-full text-sm font-semibold hover:bg-candy hover:text-white transition-all duration-300"
          >
            View All Categories
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Category Cards — horizontal scroll on mobile, grid on desktop */}
        <div
          ref={ref}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide lg:grid lg:grid-cols-5 lg:overflow-visible"
        >
          {categories.slice(0, 5).map((cat) => (
            <div
              key={cat.id}
              className="gsap-fade-up min-w-[160px] sm:min-w-[200px] lg:min-w-0"
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group block bg-white rounded-[20px] border border-[#F2D6D6]/50 overflow-hidden hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] hover:border-candy/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-[#FFF6EF] overflow-hidden flex items-center justify-center p-4">
                  <Image
                    src={cloudinaryUrl(cat.image, { width: 300, height: 225, crop: "fill" })}
                    alt={cat.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                    sizes="200px"
                    unoptimized
                  />
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-[#2E1B12] text-[16px]">{cat.name}</h3>
                  <p className="text-xs text-[#9A8B86] mt-0.5">
                    {cat.productCount.toLocaleString()}+ Products
                  </p>
                  <p className="text-candy text-xs font-semibold mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-semibold text-candy"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
