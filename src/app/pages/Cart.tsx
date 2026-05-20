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
        src="https://scontent.fmnl13-1.fna.fbcdn.net/v/t1.15752-9/669998879_962122376506849_8100807698182038355_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFFgBN08ahBx9vUwMLNpAUt28vlxYqK6t7by-XFiorq3qRyuMxPr3wuTFH9ZHQKlzkUis-mWNA403F2kCP9PH4o&_nc_ohc=7UEjOuAwv9sQ7kNvwEP1B1F&_nc_oc=AdoFTE8-w2CNKwdpknqfo__u3ZmeXr-qlMjJCwDYEsncdDtfHRVY6dO-LqV2d8uzj6w&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_ss=7b2a8&oh=03_Q7cD5QEcbhoippfnDUmbqaOtc5maUape6NP4CSZEAzizvfBuKg&oe=6A2E43CB"
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
        src="https://scontent.fmnl13-1.fna.fbcdn.net/v/t1.15752-9/696216711_946715898235972_2242282161791577892_n.png?_nc_cat=103&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGotfaDsRJEQ4U8alpQFiJC-x1hw4byVKD7HWHDhvJUoAH_5yw81doGbR3Kat6qPBYzPGBCVRBe8pWsw7TnM4oR&_nc_ohc=XDTDNummWcQQ7kNvwFnlRSn&_nc_oc=AdpJtH1boG6NhmKloNUI3Ma1lC0FJq273rm8TNOdcxggsfzXPFQtcuj8WR2LicDFQTQ&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_ss=7b2a8&oh=03_Q7cD5QGHHPIr1oFk8Xunyh62o4StNHbFp7Oh4BHc6rVKPiodWw&oe=6A2E33FC"
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
        src="https://scontent.fmnl13-3.fna.fbcdn.net/v/t1.15752-9/664381030_2706017119797220_1272751606968200683_n.png?_nc_cat=105&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeH4u4YHm3YuzUO2FXd6lEj5HaFVt9BZfIsdoVW30Fl8iw0N5BuNQ9jOJVyYnm8dhXWbBdPqwyr5m7FAt4ecfPKW&_nc_ohc=4DXWhrlwa94Q7kNvwFeaTX_&_nc_oc=AdolGr3FUCwtrrLQmWOVAjrv-hr9GfN8sL95oVnLjCaWb8cOlFRJSzDi_DHb3r6sqpE&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_ss=7b2a8&oh=03_Q7cD5QHlsmKZ1TVQKESbEsULEuj8lqrP3XuvIPNY_u04zoGlLg&oe=6A2E15FD"
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
        src="https://scontent.fmnl13-2.fna.fbcdn.net/v/t1.15752-9/541380548_1397979567968778_1924487651891689134_n.png?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFJm9gS0xlb6_vYYqsA2nYkbyxBEU98WoFvLEERT3xagdd__XGIOtn2DkkwIaGgIJpWNuv1v3ZbzVa9tuWlNyJL&_nc_ohc=S2F_ws6aBqAQ7kNvwHZahXa&_nc_oc=AdqUoJoiVwa7dwx5jnw-vmilAQBkvUYPi0Y4pACXYLhhJi70-0kKK48xOCsWq-myJBQ&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_ss=7b2a8&oh=03_Q7cD5QH9zbzytzUb3bBXl15O577xtRCctzy-ML8fS4QNn02WXg&oe=6A2E2F7F"
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
        src="https://scontent.fmnl13-2.fna.fbcdn.net/v/t1.15752-9/506133154_1931441584375829_1201656780302697758_n.png?_nc_cat=111&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGibX3t2q-peucMv8x-RUdrUjEAz0QR0KpSMQDPRBHQqg3NDxAACgBHzA46jIIlOiFxU5sIswfZ8mJgUcYKPRW2&_nc_ohc=HpOcWGOT_AAQ7kNvwHV4YB0&_nc_oc=AdrV-voT_YiXl7jGeYMnKXeqZxh4fJhQaWq1BMUO0_z5x5gdzjEz3dxz_dnnDT-gqWM&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_ss=7b2a8&oh=03_Q7cD5QH2GkkopgYF_O0uyYxje8IZGID8yNDhG_XmeKHJN5wIhw&oe=6A2E26B9"
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
        src="https://scontent.fmnl13-4.fna.fbcdn.net/v/t1.15752-9/668144182_1425314206035755_3614466334890763590_n.png?_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEALyfBzkWKhxbasnihGHuIj_iOrZGxhc-P-I6tkbGFz08I3ds9wX8vmbOkxC07ilFHUXICnLoX79RxtQy-71TU&_nc_ohc=mfBv4BwoDDAQ7kNvwGjpBvn&_nc_oc=AdoXmbDOk7z_ICSefYjLZW54ekP23r6_mCtdmTcs7u_EvfvWFQm1T9wp6F27fyHL9FE&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_ss=7b2a8&oh=03_Q7cD5QG67Cz_EPQa5Nc0Gqvn0xbvPEDKhO_pjQDWuC3AoAt0qQ&oe=6A2E2638"
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
        src="https://scontent.fmnl13-3.fna.fbcdn.net/v/t1.15752-9/536492682_695939696823200_4436953454742316969_n.png?_nc_cat=101&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEgbw1yzCfpRNVfe7BDaAm5D4F8lEuC97MPgXyUS4L3s9k0lLOXNsbBumpBcZmQs-blnfsBk69_jxv26rJaYUfg&_nc_ohc=ghK0NVxUNEUQ7kNvwFGNswX&_nc_oc=Adr6pRBs_v-dnUIWhYaizCtC_EzuQFUHOmW7FOYwG-bp3jxWdAeaSXXBQxuYBaKn6NY&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_ss=7b2a8&oh=03_Q7cD5QHVwKdWjcO958pLc7b1uFp66lkpJVf1SxZb1wMHV7QTVQ&oe=6A2E3C80"
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