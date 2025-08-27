import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useToast } from "@/components/ui/use-toast";
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

interface CartContextType {
  state: { items: CartItem[]; total: number; loading: boolean };
  addItem: (item: {
    id: string;
    name: string;
    quantity?: number;
    price: number;
    image?: string;
    size?: string;
  }) => Promise<void>; // Make it async
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const { toast } = useToast();
  const { items, total, status } = useSelector(
    (state: RootState) => state.cart
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart());
    } else {
      dispatch(clearCart());
    }
  }, [userInfo, dispatch]);

  const addItem = async (item: {
    id: string;
    name: string;
    quantity?: number;
    price: number;
    image?: string;
    size?: string;
  }) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
      });
      navigate("/login"); // Redirect to login page
      return;
    }
    const itemData = {
      productId: item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price,
      image: item.image,
      size: item.size,
    };
    await dispatch(addItemToCart(itemData)).unwrap(); // Use unwrap to handle promise
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
