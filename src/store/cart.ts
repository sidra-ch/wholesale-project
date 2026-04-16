import { create } from "zustand";
import type { CartItem, Product } from "@/lib/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("arslan-wholesale-cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("arslan-wholesale-cart", JSON.stringify(items));
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: loadCartFromStorage(),
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  addItem: (product, quantity) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },
  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.product.id !== productId);
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },
  updateQuantity: (productId, quantity) => {
    set((state) => {
      const newItems =
        quantity <= 0
          ? state.items.filter((i) => i.product.id !== productId)
          : state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            );
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },
  clearCart: () => {
    saveCartToStorage([]);
    set({ items: [] });
  },
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
