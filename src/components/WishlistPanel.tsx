// components/WishlistPanel.tsx

import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X, HeartCrack, ShoppingCart, Loader2 } from "lucide-react";

type WishlistPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  size?: string;
}

const WishlistPanel: React.FC<WishlistPanelProps> = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addItem, state: cartState } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (item: WishlistItem) => {
    await addItem({
      productId: item.productId, // Use productId
      name: item.name,
      price: item.salePrice || item.price,
      image: item.image,
      size: item.size,
      quantity: 1,
    });
    removeFromWishlist(item.productId); // Use productId
    onClose();
    navigate("/cart");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-2xl font-bold">
            Your Wishlist ({wishlistItems.length})
          </SheetTitle>
        </SheetHeader>
        {wishlistItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <HeartCrack className="w-16 h-16 mb-4 text-primary/30" />
            <h3 className="text-xl font-semibold">Your Wishlist is Empty</h3>
            <p className="mt-2 max-w-xs">
              Start exploring and add your favorite plans!
            </p>
            <Button asChild className="mt-6" onClick={onClose}>
              <Link to="/products">Explore Plans</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {wishlistItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50"
              >
                <Link to={`/product/${item.productId}`} onClick={onClose}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                </Link>
                <div className="flex-grow">
                  <Link
                    to={`/product/${item.productId}`}
                    onClick={onClose}
                    className="hover:underline"
                  >
                    <h4 className="font-semibold leading-tight">{item.name}</h4>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.size}
                  </p>
                  <p className="text-lg font-bold text-primary mt-1">
                    ₹{(item.salePrice || item.price).toLocaleString()}
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 w-full sm:w-auto"
                    onClick={() => handleAddToCart(item)}
                    disabled={cartState.loading}
                  >
                    {cartState.loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-4 w-4" />
                    )}
                    Add to Cart
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-8 w-8 flex-shrink-0"
                  onClick={() => removeFromWishlist(item.productId)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistPanel;
