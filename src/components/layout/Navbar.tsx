"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
  LogIn,
  Sparkles,
} from "lucide-react";
import { Container } from "./Container";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useHydration } from "@/hooks/useHydration";
import { fetchCategories } from "@/lib/api-data";
import type { Category } from "@/lib/types";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const hydrated = useHydration();
  const totalItems = useCartStore((s) => s.totalItems);
  const openCart = useCartStore((s) => s.openCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(59,36,22,0.08)] border-b border-[#F2D6D6]/50"
          : "bg-white/70 backdrop-blur-xl border-b border-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-[76px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-[50px] h-[50px] rounded-full overflow-hidden shadow-lg shadow-candy/20"
            >
              <Image src="https://res.cloudinary.com/dfixnhqn0/image/upload/q_auto/f_auto/v1774637471/logo-img_t6qfjg.jpg" alt="Arslan Wholesale" width={50} height={50} className="object-cover" />
            </motion.div>
            <span className="text-xl font-bold text-[#2E1B12] hidden sm:block">
              Arslan <span className="text-gradient">Wholesale</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Products" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-dark-text hover:text-candy transition-colors rounded-xl group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-candy to-red-400 rounded-full transition-all duration-300 group-hover:w-2/3" />
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="relative flex items-center gap-1 px-4 py-2 text-sm font-medium text-dark-text hover:text-candy transition-colors rounded-xl group">
                Categories
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    catOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-full left-0 w-64 glass-card rounded-2xl py-2 mt-2 overflow-hidden"
                  >
                    {categories.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={`/products?category=${c.slug}`}
                          className="block px-4 py-2.5 text-sm text-dark-text hover:bg-candy/5 hover:text-candy transition-all duration-200 hover:pl-5"
                        >
                          {c.name}
                        </Link>
                      </motion.div>
                    ))}
                    <div className="border-t border-gray-100/50 mt-1 pt-1">
                      <Link
                        href="/categories"
                        className="block px-4 py-2.5 text-sm font-semibold text-candy hover:bg-candy/5 transition-colors"
                      >
                        View All Categories →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Search + Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden md:flex items-center glass rounded-2xl px-4 py-2.5 w-56 lg:w-64 transition-all duration-300 focus-within:w-72 focus-within:shadow-lg focus-within:shadow-candy/5">
              <Search className="h-4 w-4 text-gray-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent text-sm outline-none w-full text-dark-text placeholder:text-gray-400"
              />
            </div>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={openCart}
              className="relative p-2.5 rounded-2xl hover:bg-candy/5 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-chocolate" />
              {hydrated && totalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-candy to-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-candy/30"
                >
                  {totalItems()}
                </motion.span>
              )}
            </motion.button>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {hydrated && isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-chocolate hover:text-candy transition-colors rounded-2xl hover:bg-candy/5"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-chocolate hover:text-candy transition-colors rounded-2xl hover:bg-candy/5"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/register"
                      className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-candy to-red-500 text-white rounded-2xl hover:shadow-lg hover:shadow-candy/30 transition-all duration-300"
                    >
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-2xl hover:bg-candy/5 transition-colors"
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-chocolate" />
              ) : (
                <Menu className="h-5 w-5 text-chocolate" />
              )}
            </motion.button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="lg:hidden border-t border-white/30 bg-white/90 backdrop-blur-2xl overflow-hidden"
          >
            <Container className="py-5 space-y-1">
              {/* Mobile Search */}
              <div className="md:hidden flex items-center glass rounded-2xl px-4 py-3 mb-4">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent text-sm outline-none w-full"
                />
              </div>

              {[
                { href: "/", label: "Home" },
                { href: "/categories", label: "Categories" },
                { href: "/products", label: "Products" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium rounded-xl hover:bg-candy/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border-t border-gray-100/50 pt-4 mt-4 flex gap-2"
              >
                {hydrated && isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-3 text-sm font-semibold bg-chocolate text-white rounded-2xl"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-3 text-sm font-semibold border-2 border-chocolate text-chocolate rounded-2xl"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-3 text-sm font-semibold bg-gradient-to-r from-candy to-red-500 text-white rounded-2xl"
                    >
                      Register
                    </Link>
                  </>
                )}
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
