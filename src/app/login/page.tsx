"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toaster";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast(json.error || "Login failed");
        return;
      }
      login(
        {
          id: String(json.user.id),
          email: json.user.email,
          name: json.user.name,
          businessName: json.user.businessName || "",
          phone: json.user.phone || "",
          status: json.user.status,
          role: json.user.role,
        },
        json.token
      );
      toast("Welcome back! You are now logged in.");
      router.push(json.user.role === "customer" ? "/dashboard" : "/admin");
    } catch {
      toast("Network error. Please try again.");
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Login" }]} />
      <section className="py-12 lg:py-20">
        <Container className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8"
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-7 w-7 text-candy" />
              </div>
              <h1 className="text-2xl font-bold text-dark-text">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to access wholesale prices and place orders
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-dark-text mb-1.5 block">
                  Email
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

              <div>
                <label className="text-sm font-medium text-dark-text mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate pr-10"
                    placeholder="••••••••"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-candy text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-candy font-medium hover:underline"
              >
                Create Account
              </Link>
            </p>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
