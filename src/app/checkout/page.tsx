"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useHydration } from "@/hooks/useHydration";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone is required"),
  company: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(4, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const hydrated = useHydration();
  const router = useRouter();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
    },
  });

  const shipping = totalPrice() >= 500 ? 0 : 25;
  const total = totalPrice() + shipping;

  const onSubmit = async () => {
    // Simulate order
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    setOrderPlaced(true);
  };

  if (!hydrated) {
    return (
      <Container className="py-20 text-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </Container>
    );
  }

  if (orderPlaced) {
    return (
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-dark-text mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mb-1">
            Your wholesale order has been submitted for processing.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Order #WS-{Date.now().toString().slice(-6)} · You&apos;ll receive a
            confirmation email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard/orders"
              className="px-6 py-3 bg-chocolate text-white rounded-xl text-sm font-semibold hover:bg-chocolate/90 transition-colors"
            >
              View Orders
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 border border-gray-200 text-dark-text rounded-xl text-sm font-medium hover:bg-light-gray transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </Container>
    );
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <section className="py-8 lg:py-12">
        <Container>
          <h1 className="text-2xl lg:text-3xl font-bold text-dark-text mb-8">
            Checkout
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Shipping Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-dark-text mb-5">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" {...register("firstName")} className="mt-1" />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" {...register("lastName")} className="mt-1" />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register("email")} className="mt-1" />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" type="tel" {...register("phone")} className="mt-1" />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" {...register("company")} className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" {...register("address")} className="mt-1" />
                    {errors.address && (
                      <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" {...register("city")} className="mt-1" />
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State / Province *</Label>
                    <Input id="state" {...register("state")} className="mt-1" />
                    {errors.state && (
                      <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP / Postal Code *</Label>
                    <Input id="zip" {...register("zip")} className="mt-1" />
                    {errors.zip && (
                      <p className="text-xs text-red-500 mt-1">{errors.zip.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" {...register("country")} className="mt-1" />
                    {errors.country && (
                      <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Order Notes</Label>
                    <Textarea
                      id="notes"
                      {...register("notes")}
                      placeholder="Special instructions for delivery..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  Secure Checkout
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Tracked Shipping
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky lg:top-24">
                <h2 className="font-bold text-dark-text mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <SafeImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-text line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} × Rs {item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap">
                        Rs {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>Rs {totalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : `Rs ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-dark-text">Total</span>
                      <span className="text-lg font-bold text-chocolate">
                        Rs {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-candy text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors mt-5 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </button>
                <Link
                  href="/cart"
                  className="block text-center text-sm text-gray-400 hover:text-dark-text mt-3"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </form>
        </Container>
      </section>
    </>
  );
}
