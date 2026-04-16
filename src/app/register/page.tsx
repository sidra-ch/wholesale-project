"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(7, "Please enter a valid phone number"),
    businessName: z.string().min(2, "Business name is required"),
    businessType: z.string().min(1, "Please select business type"),
    taxId: z.string().optional(),
    address: z.string().min(5, "Address is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    console.log("Register:", data);
    toast("Registration submitted successfully!");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Breadcrumb items={[{ label: "Register" }]} />
        <section className="py-20">
          <Container className="max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-dark-text mb-2">
                Registration Submitted
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Thank you for registering! Your account is pending admin
                approval. You&apos;ll receive an email once your account is
                activated.
              </p>
              <Link
                href="/"
                className="inline-flex px-6 py-2.5 bg-chocolate text-white rounded-xl text-sm font-medium hover:bg-chocolate/90 transition-colors"
              >
                Back to Home
              </Link>
            </motion.div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Register" }]} />
      <section className="py-8 lg:py-12">
        <Container className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8"
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-7 w-7 text-candy" />
              </div>
              <h1 className="text-2xl font-bold text-dark-text">
                Create Wholesale Account
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Register your business to access wholesale pricing
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-dark-text mb-1.5 block">
                    Full Name *
                  </label>
                  <input
                    {...register("name")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-text mb-1.5 block">
                    Email *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-dark-text mb-1.5 block">
                    Phone Number *
                  </label>
                  <input
                    {...register("phone")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                    placeholder="+92 3XX XXXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-text mb-1.5 block">
                    Business Name *
                  </label>
                  <input
                    {...register("businessName")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                    placeholder="Your Business LLC"
                  />
                  {errors.businessName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-dark-text mb-1.5 block">
                    Business Type *
                  </label>
                  <select
                    {...register("businessType")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="retailer">Retail Store</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="convenience">Convenience Store</option>
                    <option value="distributor">Distributor</option>
                    <option value="online">Online Retailer</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.businessType && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.businessType.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-text mb-1.5 block">
                    Tax ID / VAT Number
                  </label>
                  <input
                    {...register("taxId")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-dark-text mb-1.5 block">
                  Business Address *
                </label>
                <input
                  {...register("address")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                  placeholder="123 Main St, City, State, ZIP"
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-dark-text mb-1.5 block">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate pr-10"
                      placeholder="Min 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-text mb-1.5 block">
                    Confirm Password *
                  </label>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-candy text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-candy font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
