"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCartStore } from "@/store/cart";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { useHydration } from "@/hooks/useHydration";
import { Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();
  const hydrated = useHydration();

  if (!hydrated) {
    return (
      <Container className="py-20 text-center">
        <div className="animate-pulse text-gray-400">Loading cart...</div>
      </Container>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Cart" }]} />
      <section className="py-8 lg:py-12">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-dark-text">
                Shopping Cart
              </h1>
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:underline"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <EmptyState
                title="Your cart is empty"
                description="Browse our products and add items to your cart."
                actionLabel="Browse Products"
                actionHref="/products"
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4"
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={cloudinaryUrl(item.product.images[0], { width: 224, height: 224, crop: "fill" })}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-semibold text-dark-text text-sm hover:text-candy transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.product.brand} · ${item.product.price.toFixed(2)}/
                          {item.product.unit}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(q) =>
                              updateQuantity(item.product.id, q)
                            }
                            min={item.product.moq}
                            max={item.product.stock}
                          />
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-chocolate">
                              $
                              {(
                                item.product.price * item.quantity
                              ).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                    <h2 className="font-bold text-dark-text mb-4">
                      Order Summary
                    </h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Subtotal ({items.length} items)
                        </span>
                        <span className="font-medium">
                          ${totalPrice().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span className="font-medium text-green-600">
                          {totalPrice() >= 500 ? "Free" : "$25.00"}
                        </span>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-dark-text">
                            Total
                          </span>
                          <span className="text-xl font-bold text-chocolate">
                            $
                            {(
                              totalPrice() +
                              (totalPrice() >= 500 ? 0 : 25)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {totalPrice() < 500 && (
                      <p className="text-xs text-gray-400 mt-3">
                        Add ${(500 - totalPrice()).toFixed(2)} more for free
                        shipping!
                      </p>
                    )}
                    <Link
                      href="/checkout"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-candy text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors mt-5"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/products"
                      className="w-full flex items-center justify-center py-3 border border-gray-200 text-dark-text rounded-xl text-sm font-medium hover:bg-light-gray transition-colors mt-2"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </Container>
      </section>
    </>
  );
}
