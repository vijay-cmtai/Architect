import { Link } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { state, updateQuantity, removeItem } = useCart();

  // Loading spinner while cart data is being fetched
  if (state.loading && state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate order summary with the new, simplified logic
  const calculateOrderSummary = () => {
    if (!state.items || state.items.length === 0) {
      return {
        subtotalBeforeDiscount: 0,
        totalDiscount: 0,
        subtotalAfterDiscount: 0,
        totalTax: 0,
        shipping: 0,
        finalTotal: 0,
      };
    }

    const shipping = 0;
    let subtotalBeforeDiscount = 0; // Based on original MRP
    let totalDiscount = 0; // Total savings from original MRP
    let subtotalAfterDiscount = 0; // Final total before tax
    let totalTax = 0;

    state.items.forEach((item) => {
      // --- NEW SIMPLIFIED LOGIC ---

      // 1. Get base values
      const originalPrice = item.productId?.price ?? item.price;
      const salePrice = item.productId?.salePrice ?? 0;
      const isSale = item.productId?.isSale ?? false;
      const quantity = item.quantity ?? 1;
      const taxRate = (item.productId?.taxRate ?? 0) / 100;

      // 2. Determine the final price. No more percentage calculation.
      const finalEffectivePrice =
        isSale && salePrice > 0 ? salePrice : originalPrice;

      // --- CALCULATE TOTALS ---
      subtotalBeforeDiscount += originalPrice * quantity;

      const itemSubtotalAfterDiscount = finalEffectivePrice * quantity;
      subtotalAfterDiscount += itemSubtotalAfterDiscount;

      const totalDiscountForItem =
        (originalPrice - finalEffectivePrice) * quantity;
      totalDiscount += totalDiscountForItem;

      const itemTax = itemSubtotalAfterDiscount * taxRate;
      totalTax += itemTax;
    });

    const finalTotal = subtotalAfterDiscount + totalTax + shipping;

    return {
      subtotalBeforeDiscount: Math.round(subtotalBeforeDiscount),
      totalDiscount: Math.round(totalDiscount),
      subtotalAfterDiscount: Math.round(subtotalAfterDiscount),
      totalTax: Math.round(totalTax),
      shipping,
      finalTotal: Math.round(finalTotal),
    };
  };

  const orderSummary = calculateOrderSummary();

  // Empty cart display
  if (!state.items || state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Looks like you haven't added any plans to your cart yet.
            </p>
            <Link to="/products">
              <Button className="btn-primary px-8 py-3 text-lg">
                Browse House Plans
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Shopping Cart ({state.items.length}{" "}
            {state.items.length === 1 ? "item" : "items"})
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              {state.items.map((item) => {
                // --- Replicate the same simplified logic for display ---
                const originalPrice = item.productId?.price ?? item.price;
                const salePrice = item.productId?.salePrice ?? 0;
                const isSale = item.productId?.isSale ?? false;

                const finalEffectivePrice =
                  isSale && salePrice > 0 ? salePrice : originalPrice;

                const totalDiscountAmount =
                  (originalPrice - finalEffectivePrice) * item.quantity;
                const hasDiscount = finalEffectivePrice < originalPrice;
                const itemKey =
                  typeof item.productId === "object"
                    ? item.productId._id
                    : item.productId;

                return (
                  <div
                    key={itemKey}
                    className="flex flex-col sm:flex-row items-start sm:items-center p-6 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{item.size}</p>

                      {/* Cleaned up details: We only show "On Sale!" if it is */}
                      {isSale && (
                        <p className="text-xs text-red-600 font-semibold mb-4">
                          On Sale!
                        </p>
                      )}

                      <div className="flex items-center justify-between sm:justify-start">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(
                                itemKey,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-2 hover:bg-gray-100 rounded-l-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(itemKey, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(itemKey)}
                          className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right ml-6 w-48">
                      <div className="text-lg font-semibold text-gray-800 mb-2">
                        ₹{Math.round(finalEffectivePrice).toLocaleString()} each
                      </div>
                      {hasDiscount && (
                        <div className="line-through text-gray-500 text-sm mb-1">
                          ₹{originalPrice.toLocaleString()} each
                        </div>
                      )}
                      <div className="text-xl font-bold text-primary">
                        ₹
                        {Math.round(
                          finalEffectivePrice * item.quantity
                        ).toLocaleString()}
                      </div>
                      {hasDiscount && (
                        <div className="text-sm text-green-600 mt-1">
                          Save ₹
                          {Math.round(totalDiscountAmount).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {orderSummary.totalDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Price</span>
                    <span className="font-semibold">
                      ₹{orderSummary.subtotalBeforeDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
                {orderSummary.totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Discount</span>
                    <span className="font-semibold">
                      - ₹{orderSummary.totalDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ₹{orderSummary.subtotalAfterDiscount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">
                    ₹{orderSummary.totalTax.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-primary text-xl">
                      ₹{orderSummary.finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <Link to="/checkout" className="block">
                <Button className="w-full btn-primary py-4 text-lg mb-4">
                  Proceed to Checkout
                </Button>
              </Link>
              {orderSummary.totalDiscount > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium text-center">
                    🎉 You're saving ₹
                    {orderSummary.totalDiscount.toLocaleString()} on this order!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
