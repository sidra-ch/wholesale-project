"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { useAuthStore } from "@/store/auth";
import { useHydration } from "@/hooks/useHydration";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  LogOut,
  Package,
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: ShoppingBag, label: "Orders", href: "/dashboard/orders" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useHydration();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <Container className="py-20 text-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </Container>
    );
  }

  return (
    <section className="py-6 lg:py-10">
      <Container>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-24">
              <div className="mb-6">
                <p className="font-semibold text-dark-text text-sm">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400">{user?.businessName}</p>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-cream text-candy"
                        : "text-gray-500 hover:bg-light-gray hover:text-dark-text"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  );
}
