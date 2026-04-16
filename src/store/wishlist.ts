import { create } from "zustand";

interface WishlistStore {
  items: string[]; // product IDs
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

const load = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("arslan-wishlist");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const save = (items: string[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("arslan-wishlist", JSON.stringify(items));
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: load(),
  toggle: (id) => {
    set((state) => {
      const next = state.items.includes(id)
        ? state.items.filter((i) => i !== id)
        : [...state.items, id];
      save(next);
      return { items: next };
    });
  },
  has: (id) => get().items.includes(id),
  clear: () => {
    save([]);
    set({ items: [] });
  },
}));
