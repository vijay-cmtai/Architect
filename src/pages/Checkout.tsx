import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { RootState, AppDispatch } from "@/lib/store";
import { useCart } from "@/contexts/CartContext";
import {
  createOrder,
  payOrderWithPaypal,
  resetCurrentOrder,
} from "@/lib/features/orders/orderSlice";
import { clearCartDB } from "@/lib/features/cart/cartSlice";
import useExternalScripts from "@/hooks/usePaymentGateway";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const { loaded: isRazorpayLoaded } = useExternalScripts([
    "https://checkout.razorpay.com/v1/checkout.js",
  ]);

  const { state: cartState, clearCart } = useCart();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const {
    currentOrder,
    status: orderStatus,
    error: orderError,
  } = useSelector((state: RootState) => state.orders);

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [paypalClientId, setPaypalClientId] = useState("");
  const [isPaypalSdkReady, setIsPaypalSdkReady] = useState(false);

  const orderSummary = useMemo(() => {
    if (!cartState.items || cartState.items.length === 0) {
      return {
        subtotalBeforeDiscount: 0,
        subtotal: 0,
        totalDiscount: 0,
        totalTax: 0,
        shipping: 0,
        finalTotal: 0,
      };
    }

    let subtotalBeforeDiscount = 0;
    let totalDiscount = 0;
    let subtotalAfterDiscount = 0;
    let totalTax = 0;
    const shipping = 0;

    cartState.items.forEach((item) => {
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

    const finalTotal = subtotalAfterDiscount + totalTax + shipping;

    return {
      subtotalBeforeDiscount: Math.round(subtotalBeforeDiscount),
      subtotal: Math.round(subtotalAfterDiscount),
      totalDiscount: Math.round(totalDiscount),
      totalTax: Math.round(totalTax),
      shipping,
      finalTotal: Math.round(finalTotal),
    };
  }, [cartState.items]);

  useEffect(() => {
    const fetchPaypalId = async () => {
      if (userInfo) {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/orders/paypal/client-id`,
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
          );
          if (data.clientId && data.clientId !== "your_paypal_client_id") {
            setPaypalClientId(data.clientId);
            setIsPaypalSdkReady(true);
          } else {
            console.error("PayPal Client ID not configured on the server.");
            toast.error("PayPal is currently unavailable.");
          }
        } catch (error) {
          console.error("Could not fetch PayPal Client ID", error);
          toast.error("Failed to load PayPal configuration.");
        }
      }
    };

    if (!userInfo) {
      navigate("/login?redirect=/checkout");
    } else {
      fetchPaypalId();
    }

    if (cartState.items.length === 0 && !cartState.loading) {
      navigate("/cart");
    }
    dispatch(resetCurrentOrder());
  }, [userInfo, navigate, cartState.items.length, dispatch]);

  useEffect(() => {
    if (paymentMethod !== "PayPal" && currentOrder) {
      dispatch(resetCurrentOrder());
    }
  }, [paymentMethod, currentOrder, dispatch]);

  const handlePaymentSuccess = () => {
    toast.success("Payment successful! Your order is confirmed.");
    dispatch(clearCartDB());
    clearCart();
    navigate("/dashboard/orders");
  };

  const handleRazorpayPayment = async (order: any) => {
    if (!isRazorpayLoaded) {
      toast.error("Razorpay is not ready. Please wait.");
      return;
    }
    try {
      const { data: razorpayOrderData } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}/create-razorpay-order`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: "ArchHome",
        order_id: razorpayOrderData.orderId,
        handler: async (response: any) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}/verify-payment`,
              response,
              { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            handlePaymentSuccess();
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phone,
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error("Failed to start Razorpay payment.");
    }
  };

  const handlePhonePePayment = async (order: any) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}/pay-with-phonepe`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error("Could not get PhonePe payment URL.");
      }
    } catch (err) {
      toast.error("Failed to start PhonePe payment.");
    }
  };

  const onPaypalApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      dispatch(
        payOrderWithPaypal({
          orderId: currentOrder._id,
          paymentResult: details,
        })
      ).then((result) => {
        if (payOrderWithPaypal.fulfilled.match(result)) {
          handlePaymentSuccess();
        } else {
          toast.error("PayPal payment failed.");
        }
      });
    });
  };

  const createPaypalOrder = (data: any, actions: any) => {
    if (!currentOrder || !currentOrder.totalPrice) {
      toast.error("Order details not available. Please try again.");
      return Promise.reject(new Error("Order details not available"));
    }
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (currentOrder.totalPrice / 82).toFixed(2),
            currency_code: "USD",
          },
        },
      ],
    });
  };

  const onSubmit = (data: any) => {
    const orderData = {
      orderItems: cartState.items.map((item) => {
        const itemKey =
          typeof item.productId === "object"
            ? item.productId._id
            : item.productId;
        return { ...item, productId: itemKey };
      }),
      shippingAddress: data,
      paymentMethod: paymentMethod,
      itemsPrice: orderSummary.subtotal,
      taxPrice: orderSummary.totalTax,
      shippingPrice: orderSummary.shipping,
      totalPrice: orderSummary.finalTotal,
    };

    dispatch(createOrder(orderData)).then((res) => {
      if (createOrder.fulfilled.match(res)) {
        const createdOrder = res.payload;
        if (paymentMethod === "Razorpay") handleRazorpayPayment(createdOrder);
        else if (paymentMethod === "PhonePe")
          handlePhonePePayment(createdOrder);
      } else {
        toast.error(String(orderError) || "Could not create order.");
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/cart")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
        </Button>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Billing Information
              </h2>
              <form
                id="shipping-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: true })}
                    defaultValue={userInfo?.name}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: true })}
                    defaultValue={userInfo?.email}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone", { required: true })}
                    defaultValue={userInfo?.phone}
                  />
                </div>
              </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-2">
                {["Razorpay", "PayPal", "PhonePe"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${paymentMethod === method ? "border-primary bg-primary/5" : "hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>
            <div className="space-y-2">
              {cartState.items.map((item) => {
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
                const itemKey =
                  typeof item.productId === "object"
                    ? item.productId._id
                    : item.productId;
                return (
                  <div
                    key={itemKey}
                    className="flex justify-between items-center text-sm py-2"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <span className="block">{item.name}</span>
                        <span className="text-gray-500">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {hasDiscount && (
                        <div className="line-through text-gray-500 text-xs">
                          ₹{(regularPrice * item.quantity).toLocaleString()}
                        </div>
                      )}
                      <div className="font-semibold">
                        ₹{(displayPrice * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t my-4"></div>
            <div className="space-y-2 font-medium">
              {orderSummary.totalDiscount > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Original Price</span>
                    <span>
                      ₹{orderSummary.subtotalBeforeDiscount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Total Discount</span>
                    <span>
                      - ₹{orderSummary.totalDiscount.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{orderSummary.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {orderSummary.shipping === 0
                    ? "FREE"
                    : `₹${orderSummary.shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{orderSummary.totalTax.toLocaleString()}</span>
              </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{orderSummary.finalTotal.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-6">
              {paymentMethod === "PayPal" ? (
                isPaypalSdkReady ? (
                  <PayPalScriptProvider
                    options={{ "client-id": paypalClientId, currency: "USD" }}
                  >
                    {!currentOrder ? (
                      <Button
                        type="submit"
                        form="shipping-form"
                        disabled={orderStatus === "loading"}
                        className="w-full mb-2"
                      >
                        {orderStatus === "loading" && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        1. Save Information to Pay
                      </Button>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Info saved. Complete payment below.
                        </p>
                        <PayPalButtons
                          style={{ layout: "vertical" }}
                          createOrder={createPaypalOrder}
                          onApprove={onPaypalApprove}
                          onError={(err) => {
                            toast.error("PayPal encountered an error.");
                            console.error("PayPal Button Error:", err);
                          }}
                        />
                      </div>
                    )}
                  </PayPalScriptProvider>
                ) : (
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    <p className="text-sm mt-2">Loading PayPal...</p>
                  </div>
                )
              ) : (
                <Button
                  type="submit"
                  form="shipping-form"
                  className="w-full btn-primary py-3 text-lg"
                  disabled={
                    orderStatus === "loading" ||
                    (paymentMethod === "Razorpay" && !isRazorpayLoaded)
                  }
                >
                  {orderStatus === "loading" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Pay with {paymentMethod}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
