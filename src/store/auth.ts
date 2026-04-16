import { create } from "zustand";
import type { User } from "@/lib/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  permissions: string[];
  roles: string[];
  login: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
  setPermissions: (permissions: string[], roles: string[]) => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  permissions: [],
  roles: [],
  login: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isAdmin: user.role === "admin" });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      localStorage.removeItem("roles");
    }
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false, permissions: [], roles: [] });
  },
  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");
        set({ user, token, isAuthenticated: true, isAdmin: user.role === "admin", permissions, roles });
      } catch {
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },
  setPermissions: (permissions, roles) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("permissions", JSON.stringify(permissions));
      localStorage.setItem("roles", JSON.stringify(roles));
    }
    set({ permissions, roles });
  },
  hasPermission: (permission) => {
    const { roles, permissions } = get();
    if (roles.includes("super-admin")) return true;
    return permissions.includes(permission);
  },
}));
