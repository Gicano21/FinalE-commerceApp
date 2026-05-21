import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { checkoutCart, getProductById } from "../utils/myDatabase";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";

export function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const totalPrice = getTotalPrice();

  const buttonDisabled = !selectedPaymentMethod || isProcessing;

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please choose a payment method before checkout", {
        description: "Select a payment option so we can process your order.",
      });
      return;
    }

    if (!user) {
      toast.error("Sign in required", {
        description: "Please sign in before completing your purchase.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const latestProducts = await Promise.all(
        items.map((item) => getProductById(item.id))
      );

      const unavailableItem = latestProducts.find(
        (product) => !product || product.inStock <= 0
      );

      if (unavailableItem) {
        toast.error("Checkout blocked: item unavailable", {
          description:
            "One or more products in your cart are out of stock. Remove unavailable items before proceeding.",
        });
        setIsProcessing(false);
        return;
      }

      await checkoutCart(user.id, items);
      await clearCart();

      toast.success("Checkout successful!", {
        description:
          "Your order was placed and stock has been updated. Thank you for shopping with us.",
      });
      navigate("/products");
    } catch (error: any) {
      toast.error("Checkout failed", {
        description:
          error?.message ||
          "Unable to complete checkout right now. Please try again later.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-32 w-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-blue-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all px-8 group">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 flex gap-6 border border-gray-100 grid grid-cols-1 md:grid-cols-3"
              >
                {/* Image */}
                <Link
                  to={`/products/${item.id}`}
                  className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 hover:scale-105 transition-transform"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1">
                  <Link to={`/products/${item.id}`}>
                    <h3 className="font-bold text-lg mb-1 hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                     ₱{item.price}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between mt-[-25%] md:mt-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-6 py-2 border-x-2 border-gray-200 min-w-[4rem] text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900"> ₱{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {totalPrice > 50 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      " ₱9.99"
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold text-gray-900">
                     ₱{(totalPrice * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between text-2xl">
                    <span className="font-bold">Total</span>
                    <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                       ₱
                      {(
                        totalPrice +
                        (totalPrice > 50 ? 0 : 9.99) +
                        totalPrice * 0.1
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {totalPrice < 50 && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800 font-semibold">
                    Add  ₱{(50 - totalPrice).toFixed(2)} more to get free shipping!
                  </p>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-lg p-8 top-24 border border-gray-100 flex flex-col gap-4 mb-6">
  <h3 className="font-bold text-gray-800 mb-2">Payment Methods</h3>
  <h4 className="text-sm text-gray-500 mb-4">We accept the following secure payment methods:</h4>

  {/* Cash On Delivery */}
  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200 group">
    <div className="flex items-center">
      <input 
        name="payment" 
        type="radio" 
        value="Cash On Delivery"
        checked={selectedPaymentMethod === "Cash On Delivery"}
        onChange={() => setSelectedPaymentMethod("Cash On Delivery")}
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        Cash On Delivery
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://github.com/Gicano21/FinalE-commerceServer/blob/main/TechStore_assets/payment_logos/CashOnDeleivery.png?raw=true"
        alt="CashOnDelivery Logo"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  </label>

  {/* PayMaya */}
  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200 group">
    <div className="flex items-center">
      <input 
        name="payment" 
        type="radio" 
        value="PayMaya"
        checked={selectedPaymentMethod === "PayMaya"}
        onChange={() => setSelectedPaymentMethod("PayMaya")}
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        PayMaya
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://github.com/Gicano21/FinalE-commerceServer/blob/main/TechStore_assets/payment_logos/PayMayya.png?raw=true"
        alt="PayMaya Logo"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  </label>

  {/* GCash */}
  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200 group">
    <div className="flex items-center">
      <input 
        name="payment" 
        type="radio" 
        value="GCash"
        checked={selectedPaymentMethod === "GCash"}
        onChange={() => setSelectedPaymentMethod("GCash")}
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        GCash
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://github.com/Gicano21/FinalE-commerceServer/blob/main/TechStore_assets/payment_logos/Gcash.png?raw=true"
        alt="GCash Logo"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  </label>

  {/* Grab Pay */}
  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200 group">
    <div className="flex items-center">
      <input 
        name="payment" 
        type="radio" 
        value="Grab Pay"
        checked={selectedPaymentMethod === "Grab Pay"}
        onChange={() => setSelectedPaymentMethod("Grab Pay")}
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        Grab Pay
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://github.com/Gicano21/FinalE-commerceServer/blob/main/TechStore_assets/payment_logos/GrabPay.png?raw=true"
        alt="Grab Pay Logo"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  </label>

  {/* PayPal */}
  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200 group">
    <div className="flex items-center">
      <input 
        name="payment" 
        type="radio" 
        value="PayPal"
        checked={selectedPaymentMethod === "PayPal"}
        onChange={() => setSelectedPaymentMethod("PayPal")}
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        PayPal
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://github.com/Gicano21/FinalE-commerceServer/blob/main/TechStore_assets/payment_logos/Paypal.png?raw=true"
        alt="PayPal Logo"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  </label>

  {/* Visa */}
  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200 group">
    <div className="flex items-center">
      <input 
        name="payment" 
        type="radio" 
        value="Visa"
        checked={selectedPaymentMethod === "Visa"}
        onChange={() => setSelectedPaymentMethod("Visa")}
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        Visa
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://github.com/Gicano21/FinalE-commerceServer/blob/main/TechStore_assets/payment_logos/Visa.png?raw=true"
        alt="Visa Logo"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  </label>

  {/* Mastercard */}
  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200 group">
    <div className="flex items-center">
      <input 
        name="payment" 
        type="radio" 
        value="Mastercard"
        checked={selectedPaymentMethod === "Mastercard"}
        onChange={() => setSelectedPaymentMethod("Mastercard")}
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        Mastercard
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://github.com/Gicano21/FinalE-commerceServer/blob/main/TechStore_assets/payment_logos/MasterCard.png?raw=true"
        alt="Mastercard Logo"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  </label>
</div>

              <Button
                disabled={buttonDisabled}
                onClick={handleCheckout}
                className={`w-full mb-3 py-6 text-lg transition-all ${buttonDisabled ? "bg-gray-300 text-gray-700 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"}`}
              >
                {isProcessing ? "Processing..." : "Proceed to Checkout"}
              </Button>

              <Link to="/products">
                <Button variant="outline" className="w-full hover:border-blue-600 hover:text-blue-600 py-6">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}