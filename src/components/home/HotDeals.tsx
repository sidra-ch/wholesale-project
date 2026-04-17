"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { fetchProducts } from "@/lib/api-data";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toaster";
import { useScrollFadeUp } from "@/hooks/useGSAPScroll";

export function HotDeals() {
  const [products, setProducts] = useState<Product[]>([]);
  const ref = useScrollFadeUp(".gsap-fade-up", 0.12, 40);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    fetchProducts({ perPage: 8 }).then((res) => setProducts(res.products));
  }, []);

  const handleAdd = (product: Product) => {
    if (!isAuthenticated) return;
    addItem(product, product.moq);
    openCart();
    toast(`${product.name} added to cart`);
  };

  return (
    <section className="py-16 lg:py-20 bg-[#FFF1E8]">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-candy text-xs font-bold tracking-widest uppercase mb-2">Hot Wholesale Deals</p>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#2E1B12]">Limited Time Offers!</h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 border border-candy text-candy rounded-full text-sm font-semibold hover:bg-candy hover:text-white transition-all duration-300"
          >
            View All Deals
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Product Cards */}
        <div
          ref={ref}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible"
        >
          {products.slice(0, 8).map((product) => {
            const discount = product.comparePrice
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="gsap-fade-up min-w-[160px] sm:min-w-[220px] lg:min-w-0"
              >
                <div className="group bg-white rounded-[20px] border border-[#F2D6D6]/50 overflow-hidden hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="block relative aspect-[4/5] bg-[#FFF6EF] overflow-hidden"
                  >
                    <SafeImage
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* Discount badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-candy text-white text-xs font-bold px-2.5 py-1 rounded-[16px]">
                        -{discount}%
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-bold text-[#2E1B12] text-[16px] leading-snug line-clamp-1 group-hover:text-candy transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-candy text-lg font-extrabold">
                        Rs {product.price.toFixed(2)}
                      </span>
                      {product.comparePrice && (
                        <span className="text-[#9A8B86] text-xs line-through">
                          Rs {product.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAdd(product)}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-candy hover:bg-[#C62828] text-white rounded-[16px] text-xs font-bold transition-all duration-300"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-candy"
          >
            View All Deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
