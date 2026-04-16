"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { cloudinaryUrl } from "@/lib/cloudinary";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-chocolate" />
                <h2 className="font-bold text-lg text-dark-text">
                  Cart ({items.length})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-light-gray transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
                  <p className="text-lg font-semibold text-dark-text mb-1">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-gray-400 mb-6">
                    Start adding products to your cart
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 bg-chocolate text-white rounded-xl text-sm font-medium hover:bg-chocolate/90 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 bg-light-gray/50 rounded-xl p-3"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={cloudinaryUrl(item.product.images[0], { width: 160, height: 160, crop: "fill" })}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-dark-text line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ${item.product.price.toFixed(2)} / {item.product.unit}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="p-1.5 hover:bg-light-gray"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="p-1.5 hover:bg-light-gray"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-chocolate">
                            $
                            {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1.5 self-start hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-dark-text">
                    Subtotal
                  </span>
                  <span className="text-xl font-bold text-chocolate">
                    ${totalPrice().toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full text-center py-3 border border-chocolate text-chocolate rounded-xl text-sm font-medium hover:bg-cream transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center py-3 bg-candy text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
