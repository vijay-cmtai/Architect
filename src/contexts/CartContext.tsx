// src/contexts/CartContext.js

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; 
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "@/lib/features/cart/cartSlice";

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
}

// ✨ FIX: Update the interface for what addItem expects ✨
interface AddItemPayload {
  productId: string; // Changed from 'id' to 'productId'
  name: string;
  quantity?: number;
  price: number;
  image?: string;
  size?: string;
}

interface CartContextType {
  state: { items: CartItem[]; total: number; loading: boolean };
  addItem: (item: AddItemPayload) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, status } = useSelector(
    (state: RootState) => state.cart
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart());
    } else {
      dispatch(clearCart()); // This is a reducer from your slice, which is correct.
    }
  }, [userInfo, dispatch]);

  // ✨ FIX: The logic inside addItem is now simpler and correct ✨
  const addItem = async (itemData: AddItemPayload) => {
    if (!userInfo) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    // No need to create a new object, itemData already has the correct shape
    await dispatch(addItemToCart(itemData)).unwrap();
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!userInfo) return;
    dispatch(updateCartItemQuantity({ productId, quantity }));
  };

  const removeItem = (productId: string) => {
    if (!userInfo) return;
    dispatch(removeCartItem(productId));
  };

  const value: CartContextType = {
    state: { items, total, loading: status === "loading" },
    addItem,
    updateQuantity,
    removeItem,
    clearCart: () => dispatch(clearCart()), // Ensure this calls the reducer
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
