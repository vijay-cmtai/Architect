import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "@/lib/features/wishlist/wishlistSlice";

interface Product {
  id: string;
  _id: string;
  name: string;
  size?: string;
  price: number;
  salePrice?: number;
  image: string;
}

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const { items: wishlistData } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { toast } = useToast();

  const wishlistItems: Product[] = useMemo(
    () =>
      Array.isArray(wishlistData)
        ? wishlistData.map((item: any) => ({ ...item, id: item.productId }))
        : [],
    [wishlistData]
  );

  // Fetch wishlist when user logs in, clear it on logout
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchWishlist());
    } else {
      dispatch(clearWishlist());
    }
  }, [userInfo, dispatch]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const addToWishlistAPI = (product: Product) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
      });
      navigate("/login"); // Redirect to login page
      return;
    }
    if (isInWishlist(product.id)) return;

    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added.`,
    });
    dispatch(addToWishlist(product));
  };

  const removeFromWishlistAPI = (productId: string) => {
    if (!userInfo) {
      // This case is less likely but good for safety
      toast({
        title: "Login Required",
        description: "Please log in to manage your wishlist.",
      });
      navigate("/login");
      return;
    }

    const itemToRemove = wishlistItems.find((item) => item.id === productId);
    if (!itemToRemove) return;

    toast({
      title: "Removed from Wishlist",
      description: `${itemToRemove.name} has been removed.`,
      variant: "destructive",
    });
    dispatch(removeFromWishlist(productId));
  };

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist: addToWishlistAPI,
    removeFromWishlist: removeFromWishlistAPI,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
