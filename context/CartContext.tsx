"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// ✅ Cart item shape with color and size added
export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
}

// ✅ Cart context shape
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "price"> & { price: number | string }) => void;
  removeFromCart: (name: string, color?: string, size?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ✅ Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      setCart([]);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);

  // ✅ Add or update item (differentiating by name+color+size)
  const addToCart = (item: Omit<CartItem, "price"> & { price: number | string }) => {
    const normalizedPrice = typeof item.price === "string"
      ? parseFloat(item.price)
      : item.price;

    setCart((prev) => {
      // Find existing item by name + color + size
      const existing = prev.find(
        (p) =>
          p.name === item.name &&
          p.color === item.color &&
          p.size === item.size
      );

      if (existing) {
        // Update quantity
        return prev.map((p) =>
          p.name === item.name &&
          p.color === item.color &&
          p.size === item.size
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }

      // Add new item
      return [...prev, { ...item, price: normalizedPrice }];
    });
  };

  // ✅ Remove item by name + optional color + optional size
  const removeFromCart = (name: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.name === name &&
            (color ? item.color === color : true) &&
            (size ? item.size === size : true)
          )
      )
    );
  };

  // ✅ Clear all items
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
