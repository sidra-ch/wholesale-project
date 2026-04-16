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
  ChevronLeft,
  ChevronDown,
  Bell,
  Search,
  Command,
  Sun,
  Moon,
  Warehouse,
  CreditCard,
  FileBarChart,
  ScrollText,
  Layers,
  Ticket,
} from "lucide-react";

const LOGO_URL =
  "https://res.cloudinary.com/dfixnhqn0/image/upload/q_auto/f_auto/v1774637471/logo-img_t6qfjg.jpg";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/subcategories", label: "Subcategories", icon: Layers },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/coupons", label: "Coupons", icon: Ticket },
    ],
  },
  {
    label: "Analytics",
    items: [
      { href: "/admin/reports", label: "Reports", icon: FileBarChart },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/activity-logs", label: "Activity Logs", icon: ScrollText },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
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
  const [dark, setDark] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (hydrated && (!isAuthenticated || !isAdmin)) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  if (!hydrated || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E14]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#1a1f2e] border-t-[#3B82F6] animate-spin" />
          </div>
          <span className="text-sm text-gray-500 font-medium tracking-wide">
            Loading admin...
          </span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const currentPage =
    navGroups
      .flatMap((g) => g.items)
      .find(
        (n) =>
          pathname === n.href ||
          (n.href !== "/admin" && pathname.startsWith(n.href))
      )?.label || "Dashboard";

  const sidebarW = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        dark ? "bg-[#0B0E14] text-gray-100" : "bg-[#F1F5F9] text-gray-900"
      }`}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-[2px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out ${sidebarW} ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } bg-[#0B0E14]`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 shrink-0 border-b border-white/[0.06]">
          <Image
            src={LOGO_URL}
            alt="Arslan Wholesale"
            width={32}
            height={32}
            className="rounded-lg shrink-0"
          />
          {!collapsed && (
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[14px] font-bold text-white tracking-wide truncate">
                Arslan
              </span>
              <span className="text-[14px] font-bold text-[#3B82F6] tracking-wide">
                Admin
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-600 px-3 mb-2">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex items-center gap-3 rounded-xl py-2.5 text-[13px] font-medium transition-all duration-200 ${
                        collapsed ? "justify-center px-2" : "px-3"
                      } ${
                        active
                          ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25"
                          : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                      }`}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />
                      )}
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                      {!collapsed && active && (
                        <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />
                      )}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                          {item.label}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-white/[0.06] p-2">
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {user?.email || "admin@arslan.com"}
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-600 shrink-0" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full rounded-xl px-3 py-2 mt-0.5 text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-full flex justify-center p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-9 border-t border-white/[0.06] text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* ─── MAIN AREA ─── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top header */}
        <header
          className={`sticky top-0 z-30 h-16 border-b flex items-center px-4 lg:px-6 gap-3 backdrop-blur-xl transition-colors duration-300 ${
            dark
              ? "bg-[#0F1219]/80 border-white/[0.06]"
              : "bg-white/80 border-gray-200/80"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              dark
                ? "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1
            className={`text-base sm:text-lg font-semibold ${
              dark ? "text-white" : "text-gray-900"
            }`}
          >
            {currentPage}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            {/* Command palette button */}
            <button
              className={`hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                dark
                  ? "bg-white/[0.06] text-gray-400 hover:bg-white/[0.1]"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={{ minWidth: 200 }}
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="text-[13px]">Search...</span>
              <kbd
                className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  dark
                    ? "bg-white/[0.06] text-gray-500"
                    : "bg-gray-200/80 text-gray-400"
                }`}
              >
                <Command className="h-2.5 w-2.5 inline mr-0.5" />K
              </kbd>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-xl transition-colors ${
                dark
                  ? "text-amber-400 hover:bg-white/[0.06]"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {dark ? (
                <Sun className="h-[18px] w-[18px]" />
              ) : (
                <Moon className="h-[18px] w-[18px]" />
              )}
            </button>

            {/* Notifications */}
            <button
              className={`relative p-2 rounded-xl transition-colors ${
                dark
                  ? "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3B82F6] rounded-full ring-2 ring-white" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
