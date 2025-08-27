// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const shipping = 5000;
  const tax = Math.round(cartState.total * 0.18);
  const finalTotal = cartState.total + shipping + tax;

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
            console.error(
              "PayPal Client ID is not valid or not configured on the server."
            );
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

  const handleRazorpayPayment = async (order) => {
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
        handler: async (response) => {
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

  const handlePhonePePayment = async (order) => {
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

  const onPaypalApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
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

  const createPaypalOrder = (data, actions) => {
    if (!currentOrder || !currentOrder.totalPrice) {
      toast.error("Order details not available. Please try again.");
      return Promise.reject(new Error("Order details not available"));
    }
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (currentOrder.totalPrice / 82).toFixed(2), // NOTE: Replace 82 with a dynamic exchange rate if possible
            currency_code: "USD",
          },
        },
      ],
    });
  };

  const onSubmit = (data) => {
    const orderData = {
      orderItems: cartState.items,
      shippingAddress: data,
      paymentMethod: paymentMethod,
      itemsPrice: cartState.total,
      shippingPrice: shipping,
      taxPrice: tax,
      totalPrice: finalTotal,
    };

    dispatch(createOrder(orderData)).then((res) => {
      if (createOrder.fulfilled.match(res)) {
        const createdOrder = res.payload;
        if (paymentMethod === "Razorpay") {
          handleRazorpayPayment(createdOrder);
        } else if (paymentMethod === "PhonePe") {
          handlePhonePePayment(createdOrder);
        }
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
                Shipping Information
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
              {cartState.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                  </div>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t my-4"></div>
            <div className="space-y-2 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartState.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
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
                        1. Save Address to Pay
                      </Button>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Address saved. Complete payment below.
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
