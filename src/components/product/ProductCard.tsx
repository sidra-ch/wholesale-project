"use client";

import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { motion } from "framer-motion";
import { ShoppingCart, Lock, Package, Star, Heart, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "@/components/ui/Toaster";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.items.includes(product.id));
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
        className="block relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-light-gray to-gray-100"
      >
        <SafeImage
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-y-2 md:group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
              toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
            }}
            className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
              isWishlisted
                ? "bg-candy text-white"
                : "bg-white/80 text-gray-600 hover:bg-candy hover:text-white"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-chocolate hover:text-white transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

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
          {product.comparePrice && (
            <Badge className="bg-candy/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg animate-pulse-glow border-0">
              {Math.round(
                ((product.comparePrice - product.price) /
                  product.comparePrice) *
                  100
              )}
              % OFF
            </Badge>
          )}
        </div>
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
                Rs {product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-xs text-gray-400 line-through">
                  Rs {product.comparePrice.toFixed(2)}
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
