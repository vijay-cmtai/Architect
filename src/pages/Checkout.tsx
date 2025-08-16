import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = 5000;
  const tax = Math.round(state.total * 0.18);
  const finalTotal = state.total + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearCart();
    setIsProcessing(false);
    
    toast({
      title: "Order Placed Successfully!",
      description: "You will receive a confirmation email shortly.",
    });
    
    navigate('/thank-you');
  };

  if (state.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate('/cart')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-gray">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Billing Information */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-xl font-bold text-primary-gray mb-6">Billing Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main Street" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Mumbai" required />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="400001" required />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-xl font-bold text-primary-gray mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Payment Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <label className="border-2 border-primary rounded-lg p-4 cursor-pointer">
                      <input type="radio" name="payment" value="card" defaultChecked className="sr-only" />
                      <div className="flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary mr-2" />
                        <span className="font-medium">Credit Card</span>
                      </div>
                    </label>
                    <label className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary">
                      <input type="radio" name="payment" value="upi" className="sr-only" />
                      <div className="flex items-center justify-center">
                        <span className="w-6 h-6 bg-primary rounded-full mr-2"></span>
                        <span className="font-medium">UPI</span>
                      </div>
                    </label>
                    <label className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary">
                      <input type="radio" name="payment" value="netbanking" className="sr-only" />
                      <div className="flex items-center justify-center">
                        <span className="w-6 h-6 bg-accent rounded-full mr-2"></span>
                        <span className="font-medium">Net Banking</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input id="cardName" placeholder="John Doe" required />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-xl font-bold text-primary-gray mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-gray">{item.name}</h3>
                      <p className="text-sm text-secondary-gray">{item.size}</p>
                      <p className="text-sm text-secondary-gray">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-4">
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
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-primary-gray">Total</span>
                    <span className="font-bold text-primary text-xl">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full btn-primary py-4 text-lg mt-6"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString()}`}
              </Button>

              {/* Security Info */}
              <div className="mt-4 p-4 bg-soft-teal rounded-xl">
                <div className="flex items-center text-sm text-secondary-gray">
                  <Lock className="w-4 h-4 mr-2" />
                  Your payment information is secure and encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;