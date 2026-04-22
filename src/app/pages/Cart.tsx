import { Link } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

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
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        Cash On Delivery
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://scontent.fmnl13-1.fna.fbcdn.net/v/t1.15752-9/669998879_962122376506849_8100807698182038355_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFFgBN08ahBx9vUwMLNpAUt28vlxYqK6t7by-XFiorq3qRyuMxPr3wuTFH9ZHQKlzkUis-mWNA403F2kCP9PH4o&_nc_ohc=Afa7RMezBiIQ7kNvwEsg049&_nc_oc=Ado_WLl80_dmO4k6Pi6UweQddQb5gj8g-6foDlVr-4MsCX6rttZNwPjlCMHCIWsG6Zc&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_ss=7a3a8&oh=03_Q7cD5AGq-hRJTE-TnLEhsBE3E4cCOhd-aj9ebmvV5ysM3IdUsw&oe=6A052D0Bhttps://scontent.fmnl13-1.fna.fbcdn.net/v/t1.15752-9/669998879_962122376506849_8100807698182038355_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFFgBN08ahBx9vUwMLNpAUt28vlxYqK6t7by-XFiorq3qRyuMxPr3wuTFH9ZHQKlzkUis-mWNA403F2kCP9PH4o&_nc_ohc=Afa7RMezBiIQ7kNvwEsg049&_nc_oc=Ado_WLl80_dmO4k6Pi6UweQddQb5gj8g-6foDlVr-4MsCX6rttZNwPjlCMHCIWsG6Zc&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_ss=7a3a8&oh=03_Q7cD5AGq-hRJTE-TnLEhsBE3E4cCOhd-aj9ebmvV5ysM3IdUsw&oe=6A052D0B"
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
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        PayMaya
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://scontent.fmnl13-2.fna.fbcdn.net/v/t1.15752-9/394412113_1308820656428165_1676501382224114953_n.png?stp=dst-png_s2048x2048&_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEDguWP43Y_5RwlQ7LrsMVS-HxfZeFkY7z4fF9l4WRjvFch_8aGLX-e5xp2BBy1HPwo0nhB4aa5W6wmC7gipgNE&_nc_ohc=GZIxCUMwdssQ7kNvwHCFMy2&_nc_oc=AdrXmPlF4s8PsO5YY0fqIWHigzCPy7CHCET3qlBgf0sJYDPmSioZaLukiOSx76aZIuc&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_ss=7a3a8&oh=03_Q7cD5AGiiFv0uyxKOoS9VBfJYYU9Ab_lpWr_w8l2edDp96W0qA&oe=6A053926"
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
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        GCash
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://scontent.fmnl13-3.fna.fbcdn.net/v/t1.15752-9/664381030_2706017119797220_1272751606968200683_n.png?_nc_cat=105&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeH4u4YHm3YuzUO2FXd6lEj5HaFVt9BZfIsdoVW30Fl8iw0N5BuNQ9jOJVyYnm8dhXWbBdPqwyr5m7FAt4ecfPKW&_nc_ohc=KeWdDISutb0Q7kNvwE39lsz&_nc_oc=AdqvhdThHj3IHUW5fB1xJeI2j58SiQOX8YsRAV0FN7Le1-7FBDe5bROEmi2skEe86JQ&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_ss=7a3a8&oh=03_Q7cD5AESXmq9LEkpZC8Rlv34hcv7dn2ukOaDpxpQycMWL28MiA&oe=6A05377D"
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
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        Grab Pay
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://scontent.fmnl13-2.fna.fbcdn.net/v/t1.15752-9/541380548_1397979567968778_1924487651891689134_n.png?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFJm9gS0xlb6_vYYqsA2nYkbyxBEU98WoFvLEERT3xagdd__XGIOtn2DkkwIaGgIJpWNuv1v3ZbzVa9tuWlNyJL&_nc_ohc=ipM-EiGQx5YQ7kNvwGNjCPB&_nc_oc=Ado-knd_9_CFxw3kCWMm28_roTJdCrPGc4TwkxNndB4Pzasop29DWm_WG5wCdfUrrG4HOwbKzuy5BltFMT8yBrxv&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_ss=7a3a8&oh=03_Q7cD5AGq4EE4DLbvtHM87dU4UQGFxrw3Jl1N7LkWktmFedXupA&oe=6A0550FF"
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
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        PayPal
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://scontent.fmnl13-2.fna.fbcdn.net/v/t1.15752-9/506133154_1931441584375829_1201656780302697758_n.png?_nc_cat=111&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGibX3t2q-peucMv8x-RUdrUjEAz0QR0KpSMQDPRBHQqg3NDxAACgBHzA46jIIlOiFxU5sIswfZ8mJgUcYKPRW2&_nc_ohc=rQPR7WQOorMQ7kNvwFlqNNl&_nc_oc=AdoIQ90-aEHjRBSDHxH42HoEvqaMbf5eLKK-dzAF-r33gwyPOeEUevZGIJKnYlGeq0eGYILk6ADBLyEN_RuDg7iz&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_ss=7a3a8&oh=03_Q7cD5AGSmGI4yja2j10Z_93NQ45R62E18GYaQzfI2d0BGYPmZg&oe=6A054839"
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
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        Visa
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://scontent.fmnl13-4.fna.fbcdn.net/v/t1.15752-9/668144182_1425314206035755_3614466334890763590_n.png?_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEALyfBzkWKhxbasnihGHuIj_iOrZGxhc-P-I6tkbGFz08I3ds9wX8vmbOkxC07ilFHUXICnLoX79RxtQy-71TU&_nc_ohc=wh6IIfJOapcQ7kNvwHkbSjq&_nc_oc=AdrDKwh82OBdDXVEkrEglo90sDtWl8R9u8Rq0O6qMeiuWZNAyTZk6l-HI4Q0aMIat9sJQ3JlnhxwcX-ghE-o7geb&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_ss=7a3a8&oh=03_Q7cD5AF3mXHjH6UBw97KWi2xUCJL7RBeYO35JGmoqt5Ou7yKWA&oe=6A0547B8"
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
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
      <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-700">
        Mastercard
      </span>
    </div>
    <div className="h-8 w-16 flex items-center justify-end">
      <ImageWithFallback
        src="https://scontent.fmnl13-3.fna.fbcdn.net/v/t1.15752-9/536492682_695939696823200_4436953454742316969_n.png?_nc_cat=101&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEgbw1yzCfpRNVfe7BDaAm5D4F8lEuC97MPgXyUS4L3s9k0lLOXNsbBumpBcZmQs-blnfsBk69_jxv26rJaYUfg&_nc_ohc=EZ-UqxWGXNoQ7kNvwFACXGw&_nc_oc=AdpIn-SOR1fo3vSiSO7I3I96Is4ylojnrUGEIziIR8uvcDCoyRqUDqeAEVekjc00m5oRegoawpMZbOc_FgQTFHvd&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_ss=7a3a8&oh=03_Q7cD5AHzJFt9vwXEZVZkfYggAcjtdO_2QWnq6tcg3X9FqsgepQ&oe=6A055E00"
        alt="Mastercard Logo"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  </label>
</div>

              <Button className="w-full mb-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg">
                Proceed to Checkout
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