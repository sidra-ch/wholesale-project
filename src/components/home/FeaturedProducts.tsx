"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/motion";
import { fetchFeaturedProducts } from "@/lib/api-data";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts().then(setFeatured);
  }, []);

  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-light-gray/30 to-cream" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chocolate/10 to-transparent" />

      <Container className="relative">
        <div className="flex items-end justify-between mb-14">
          <SectionHeading
            badge="Best Sellers"
            title="Featured Products"
            center={false}
          />
          <motion.div whileHover={{ x: 4 }} className="hidden sm:block">
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm font-semibold text-chocolate hover:text-candy transition-colors group"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="!pb-4"
        >
          {featured.map((product) => (
            <SwiperSlide key={product.id} className="py-2">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-candy"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
