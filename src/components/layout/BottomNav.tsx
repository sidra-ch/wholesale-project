"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, User, Heart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";
import { useHydration } from "@/hooks/useHydration";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Products", href: "/products" },
  { icon: Heart, label: "Wishlist", href: "/products", isWishlist: true },
  { icon: ShoppingCart, label: "Cart", href: "/cart", isCart: true },
  { icon: User, label: "Account", href: "/dashboard", isAuth: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useHydration();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const href = item.isAuth && !isAuthenticated ? "/login" : item.href;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                isActive ? "text-candy" : "text-gray-400"
              }`}
            >
              <div className="relative">
                <item.icon className={`h-5 w-5 ${isActive ? "text-candy" : ""}`} />
                {hydrated && item.isCart && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-candy text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
                {hydrated && item.isWishlist && wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-candy text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
