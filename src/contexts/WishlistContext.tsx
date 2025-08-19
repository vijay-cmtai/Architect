import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define the structure of a product. Adjust if your product has different properties.
interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
  salePrice?: number;
  image: string;
}

// Define the shape of the context
interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// The provider component that will wrap your app
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { toast } = useToast();

  // Load wishlist from localStorage when the app starts
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Function to add a product to the wishlist
  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlistItems((prevItems) => [...prevItems, product]);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} is now in your wishlist.`,
      });
    }
  };

  // Function to remove a product from the wishlist
  const removeFromWishlist = (productId: string) => {
    const itemToRemove = wishlistItems.find((item) => item.id === productId);
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
    if (itemToRemove) {
      toast({
        title: "Removed from Wishlist",
        description: `${itemToRemove.name} has been removed.`,
        variant: "destructive",
      });
    }
  };

  // Function to check if a product is already in the wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to easily access the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
