"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { useHydration } from "@/hooks/useHydration";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const LOGO_URL =
  "https://res.cloudinary.com/dfixnhqn0/image/upload/q_auto/f_auto/v1774637471/logo-img_t6qfjg.jpg";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydration();
  const { user, isAdmin, isAuthenticated, loadFromStorage, logout } =
    useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (hydrated && (!isAuthenticated || !isAdmin)) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, isAdmin, router]);

  if (!hydrated || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-[72px]" : "w-64"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-100 shrink-0">
          <Image
            src={LOGO_URL}
            alt="Arslan Wholesale"
            width={36}
            height={36}
            className="rounded-xl shrink-0"
          />
          {!collapsed && (
            <span className="text-base font-bold text-chocolate truncate">
              Admin Panel
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-chocolate text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 p-3 space-y-2">
          {!collapsed && (
            <div className="px-2 py-1">
              <p className="text-xs font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle â€” desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-8 border-t border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              collapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 flex items-center px-4 lg:px-8 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 capitalize">
            {navItems.find(
              (n) =>
                pathname === n.href ||
                (n.href !== "/admin" && pathname.startsWith(n.href))
            )?.label || "Admin"}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
