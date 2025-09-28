import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import { RootState, AppDispatch } from "@/lib/store";

const Cart = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const { items, status } = useSelector((state: RootState) => state.cart);

  const calculateOrderSummary = () => {
    const validItems = items.filter((item) => item && item.productId);
    if (validItems.length === 0) {
      return {
        subtotalBeforeDiscount: 0,
        totalDiscount: 0,
        subtotalAfterDiscount: 0,
        totalTax: 0,
        shipping: 0,
        finalTotal: 0,
      };
    }

    let subtotalBeforeDiscount = 0;
    let totalDiscount = 0;
    let subtotalAfterDiscount = 0;
    let totalTax = 0;

    validItems.forEach((item) => {
      // FIX: Price और Tax को सही से पढ़ें
      const regularPrice =
        item.price !== 0 && item.price
          ? item.price
          : (item["Regular price"] ?? 0);
      const salePrice =
        item.salePrice !== 0 && item.salePrice
          ? item.salePrice
          : item["Sale price"];
      const isSale =
        item.isSale ??
        (salePrice != null && salePrice > 0 && salePrice < regularPrice);
      const displayPrice =
        isSale && salePrice != null ? salePrice : regularPrice;

      const taxRate = (item.taxRate || item.productId?.taxRate || 0) / 100;

      const itemSubtotal = displayPrice * item.quantity;
      const originalItemSubtotal = regularPrice * item.quantity;

      subtotalAfterDiscount += itemSubtotal;
      subtotalBeforeDiscount += originalItemSubtotal;
      totalDiscount += originalItemSubtotal - itemSubtotal;
      totalTax += itemSubtotal * taxRate;
    });

    const finalTotal = subtotalAfterDiscount + totalTax;

    return {
      subtotalBeforeDiscount: Math.round(subtotalBeforeDiscount),
      totalDiscount: Math.round(totalDiscount),
      subtotalAfterDiscount: Math.round(subtotalAfterDiscount),
      totalTax: Math.round(totalTax),
      shipping: 0,
      finalTotal: Math.round(finalTotal),
    };
  };

  const orderSummary = calculateOrderSummary();

  if (status === "loading" && items.length === 0) {
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Looks like you haven't added any plans yet.
          </p>
          <Button asChild className="btn-primary px-8 py-3 text-lg">
            <Link to="/products">Browse House Plans</Link>
          </Button>
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
            Shopping Cart ({items.length}{" "}
            {items.length === 1 ? "item" : "items"})
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              {items.map((item) => {
                const itemKey =
                  typeof item.productId === "object" && item.productId !== null
                    ? item.productId._id
                    : item.productId;

                const regularPrice =
                  item.price !== 0 && item.price
                    ? item.price
                    : (item["Regular price"] ?? 0);
                const salePrice =
                  item.salePrice !== 0 && item.salePrice
                    ? item.salePrice
                    : item["Sale price"];
                const isSale =
                  item.isSale ??
                  (salePrice != null &&
                    salePrice > 0 &&
                    salePrice < regularPrice);
                const displayPrice =
                  isSale && salePrice != null ? salePrice : regularPrice;

                const hasDiscount = displayPrice < regularPrice;
                const totalDiscountAmount =
                  (regularPrice - displayPrice) * item.quantity;

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
                      {isSale && (
                        <p className="text-xs text-red-600 font-semibold mb-4">
                          On Sale!
                        </p>
                      )}
                      <div className="flex items-center justify-between sm:justify-start">
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
                        ₹{Math.round(displayPrice).toLocaleString()} each
                      </div>
                      {hasDiscount && (
                        <div className="line-through text-gray-500 text-sm mb-1">
                          ₹{regularPrice.toLocaleString()} each
                        </div>
                      )}
                      <div className="text-xl font-bold text-primary">
                        ₹
                        {Math.round(
                          displayPrice * item.quantity
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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {orderSummary.totalDiscount > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price</span>
                      <span className="font-semibold">
                        ₹{orderSummary.subtotalBeforeDiscount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Total Discount</span>
                      <span className="font-semibold">
                        - ₹{orderSummary.totalDiscount.toLocaleString()}
                      </span>
                    </div>
                  </>
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
