"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toaster";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Lock, Package, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [quantity, setQuantity] = useState(product?.moq || 1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const handleAdd = () => {
    addItem(product, quantity);
    openCart();
    toast(`${product.name} added to cart`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative aspect-square bg-light-gray">
              <SafeImage
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="320px"
              />
              {product.comparePrice && (
                <Badge className="absolute top-3 left-3 bg-candy text-white text-xs border-0">
                  {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </Badge>
              )}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 justify-center">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === selectedImage ? "bg-candy" : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                {product.brand}
              </p>
              <h3 className="text-lg font-bold text-dark-text mb-2">
                {product.name}
              </h3>

              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                {product.description}
              </p>

              {/* Price */}
              {isAuthenticated ? (
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-chocolate">
                    Rs {product.price.toFixed(2)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs {product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
                  <Lock className="h-4 w-4" />
                  Login to view price
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center gap-1.5 text-xs mb-4">
                <Package className="h-3.5 w-3.5 text-gray-400" />
                {product.stock > 0 ? (
                  <span className="text-emerald-600 font-medium">{product.stock} in stock</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of stock</span>
                )}
                <span className="text-gray-300">|</span>
                <span className="text-gray-400">MOQ: {product.moq} {product.unit}</span>
              </div>

              {/* Actions */}
              {isAuthenticated ? (
                <div className="space-y-3">
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    min={product.moq}
                    max={product.stock}
                  />
                  <button
                    onClick={handleAdd}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-chocolate to-[#5a3a28] text-white hover:shadow-lg transition-all disabled:opacity-40"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart — Rs {(product.price * quantity).toFixed(2)}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold border-2 border-chocolate/20 text-chocolate hover:bg-chocolate hover:text-white transition-all"
                >
                  <Lock className="h-4 w-4" />
                  Login to Order
                </Link>
              )}

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="block text-center text-xs text-candy font-medium mt-3 hover:underline"
              >
                View Full Details →
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
