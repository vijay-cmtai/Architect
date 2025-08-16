import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { state, updateQuantity, removeItem } = useCart();

  const shipping = 5000;
  const tax = Math.round(state.total * 0.18); // 18% GST
  const finalTotal = state.total + shipping + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-primary-gray mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-secondary-gray mb-8">
              Looks like you haven't added any house plans to your cart yet.
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
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-gray">
            Shopping Cart ({state.items.length} {state.items.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              {state.items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-6 border-b border-gray-100 last:border-b-0">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-primary-gray mb-2">
                      {item.name}
                    </h3>
                    <p className="text-secondary-gray mb-4">{item.size}</p>
                    
                    {/* Mobile Price */}
                    <div className="text-xl font-bold text-primary mb-4 sm:hidden">
                      ₹{item.price.toLocaleString()}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between sm:justify-start">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 hover:bg-gray-100 rounded-l-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 rounded-r-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Price & Total */}
                  <div className="hidden sm:block text-right ml-6">
                    <div className="text-lg font-semibold text-primary-gray mb-2">
                      ₹{item.price.toLocaleString()}
                    </div>
                    <div className="text-xl font-bold text-primary">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-8">
              <h2 className="text-xl font-bold text-primary-gray mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary-gray">Subtotal</span>
                  <span className="font-semibold">₹{state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-gray">Shipping</span>
                  <span className="font-semibold">₹{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-gray">Tax (GST 18%)</span>
                  <span className="font-semibold">₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-primary-gray">Total</span>
                    <span className="font-bold text-primary text-xl">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/checkout" className="block">
                <Button className="w-full btn-primary py-4 text-lg mb-4">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link to="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-soft-teal rounded-xl">
                <div className="flex items-center text-sm text-secondary-gray">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  Secure checkout powered by SSL encryption
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-primary-gray mb-2">Secure Payment</h3>
            <p className="text-sm text-secondary-gray">Your payment information is encrypted and secure</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-primary-gray mb-2">Fast Delivery</h3>
            <p className="text-sm text-secondary-gray">Digital plans delivered instantly via email</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-primary-gray mb-2">24/7 Support</h3>
            <p className="text-sm text-secondary-gray">Get help whenever you need it</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;