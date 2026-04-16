"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Lock, Package, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toaster";
import { cloudinaryUrl } from "@/lib/cloudinary";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const inStock = product.stock > 0;

  const handleAdd = () => {
    if (!isAuthenticated) return;
    addItem(product, product.moq);
    openCart();
    toast(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        rotateX: -1,
        rotateY: 2,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      style={{ transformPerspective: 1200 }}
      className="group glass-card rounded-3xl overflow-hidden hover:premium-shadow-lg transition-all duration-500"
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-gradient-to-br from-light-gray to-gray-100"
      >
        <Image
          src={cloudinaryUrl(product.images[0], { width: 600, height: 600, crop: "fill" })}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge className="bg-chocolate/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg border-0">
            MOQ: {product.moq} {product.unit}
          </Badge>
          {!inStock && (
            <Badge className="bg-gray-800/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg border-0">
              Out of Stock
            </Badge>
          )}
        </div>
        {product.comparePrice && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-candy/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg animate-pulse-glow border-0">
              {Math.round(
                ((product.comparePrice - product.price) /
                  product.comparePrice) *
                  100
              )}
              % OFF
            </Badge>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            {product.brand}
          </p>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, j) => (
              <Star
                key={j}
                className="h-3 w-3 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-dark-text text-sm leading-snug mb-3 line-clamp-2 group-hover:text-candy transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-4">
          {isAuthenticated ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gradient">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
              <span className="text-xs text-gray-400">/{product.unit}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Lock className="h-3.5 w-3.5" />
              Login to view price
            </div>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Package className="h-3 w-3" />
          {inStock ? (
            <span className="text-emerald-600 font-medium">
              {product.stock} in stock
            </span>
          ) : (
            <span className="text-red-500 font-medium">Out of stock</span>
          )}
        </div>

        {/* Action */}
        {isAuthenticated ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleAdd}
            disabled={!inStock}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-chocolate to-[#5a3a28] text-white hover:shadow-lg hover:shadow-chocolate/20"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </motion.button>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold border-2 border-chocolate/20 text-chocolate hover:bg-chocolate hover:text-white transition-all duration-300"
          >
            <Lock className="h-4 w-4" />
            Login to Order
          </Link>
        )}
      </div>
    </motion.div>
  );
}
