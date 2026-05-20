import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "../data/products";
import { useAuth } from "./AuthContext";
import {
  getUserCart,
  addToUserCart,
  removeFromUserCart,
  updateCartItemQuantity,
  clearUserCart,
  CartItemData,
} from "../utils/myDatabase";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  loadUserCart: (userId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Load cart from database when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserCart(user.id);
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user]);

  const loadUserCart = async (userId: string) => {
    const cartData = await getUserCart(userId);
    const cartItems: CartItem[] = cartData.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: item.quantity,
      description: "", // Not stored in cart
      rating: 0,
      reviews: 0,
      inStock: 0,
    }));
    setItems(cartItems);
  };

  const addToCart = async (product: Product) => {
    if (!user) return;

    const cartItem: CartItemData = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1,
    };

    await addToUserCart(user.id, cartItem);

    // Update local state
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = async (productId: number) => {
    if (!user) return;

    await removeFromUserCart(user.id, productId);

    // Update local state
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    await updateCartItemQuantity(user.id, productId, quantity);

    // Update local state
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    if (!user) return;

    await clearUserCart(user.id);

    // Update local state
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        loadUserCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}