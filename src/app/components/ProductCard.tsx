import { Link, useNavigate } from "react-router";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "../data/products";
import { Button } from "./ui/button";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Show toast notification and redirect to login
      toast.error("Please sign in to add items to your cart", {
        description: "You need to be logged in to shop with us",
      style: {
        fontSize: "20px",
      }
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: {
        fontSize: "20px",
      }
    });
  };

  return (
    <Link to={`/products/${product.id}`} className="group block h-full">
  {/* 1. Added 'flex flex-col' to the main card container */}
  <div className="h-full w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-200 hover:-translate-y-1 flex flex-col">
    
    {/* Image */}
    <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative shrink-0">
      <ImageWithFallback
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {product.originalPrice && (
        <span className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          SALE
        </span>
      )}
    </div>

    {/* Content */}
    {/* 2. Added 'flex-1 flex flex-col' here to make this container claim all remaining space */}
    <div className="p-5 flex-1 flex flex-col">
      {/* Category */}
      <p className="text-xs text-blue-600 uppercase tracking-wider mb-2 font-semibold">
        {product.category}
      </p>

      {/* Name */}
      <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-lg">
        {product.name.substring(0, 15) + (product.name.length > 15 ? "..." : "")}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold">{product.rating}</span>
        <span className="text-xs text-gray-500">({product.reviews})</span>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ₱{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
               ₱{product.originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart Button Wrapper */}
      {/* 3. Added 'mt-auto pt-2' to drop this layout block to the absolute bottom */}
      <div className="flex justify-center w-full mt-auto pt-2">
        <Button
          className="text-xs md:text-lg sm:w-[80%] md:w-[100%] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-xl transition-all group/btn"
          onClick={(e) => {
            e.preventDefault(); // Stop navigation to product details page
            handleAddToCart(e);
          }}
          disabled={product.inStock <= 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:animate-bounce" />
          {product.inStock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>

    </div>
  </div>
</Link>
  );
}