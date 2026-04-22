import { Link } from "react-router";
import { useEffect, useRef } from "react";
import { ArrowRight, Truck, Shield, Award, Zap, Star, TrendingUp } from "lucide-react";
import { products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";

export function Home() {
  const featuredProducts = products.filter((p) => p.featured);
  const carouselProducts = products.filter((product) => product.featured).slice(0, 8);
  const carouselItems = [...carouselProducts, ...carouselProducts, ...carouselProducts];
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || carouselItems.length === 0) return;

    const copyWidth = carousel.scrollWidth / 3;
    carousel.scrollLeft = copyWidth;

    const interval = window.setInterval(() => {
      carousel.scrollBy({
        left: carousel.clientWidth * 0.05,
        behavior: "smooth",
      });
    }, 2500);

    return () => window.clearInterval(interval);
  }, [carouselItems.length]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.75;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const carousel = carouselRef.current;
    const copyWidth = carousel.scrollWidth / 3;

    if (carousel.scrollLeft <= 0) {
      carousel.scrollLeft += copyWidth;
    } else if (carousel.scrollLeft >= copyWidth * 2) {
      carousel.scrollLeft -= copyWidth;
    }
  };

  return (
    <div>
      {/* Product Advertisement Carousel */}
      <section className="py-12 md:py-16 bg-white"> {/* Reduced py for mobile */}
  <div className="container mx-auto px-4">
    {/* Reduced p-4 for mobile, p-8 for desktop */}
    <div className="bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 shadow-xl border border-slate-200">
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
        <div>
          <span className="inline-block mb-2 text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-blue-600 font-bold">
            Sponsored Picks
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-slate-950">
            Discover Our Latest Home Page Deals
          </h1>
        </div>
      </div>

      <div
        ref={carouselRef}
        onScroll={handleCarouselScroll}
        /* Adjusted gap: gap-4 for mobile, gap-6 for desktop */
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory hide-scrollbar"
      >
        {carouselItems.map((product, index) => (
          <div 
            key={`${product.id}-${index}`} 
            /* Mobile: w-[240px] (Slightly smaller, allows 'peek' of next card)
               Desktop: min-w-[280px] max-w-[320px] 
            */
            className="w-[240px] md:min-w-[280px] md:max-w-[320px] flex-shrink-0 snap-start"
          >
            <ProductCard product={product}/>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-8 md:mb-12">
      {/* Smaller badge on mobile */}
      <div className="inline-block mb-3 md:mb-4 px-3 py-1 md:px-4 md:py-2 bg-blue-100 text-blue-600 rounded-full text-xs md:text-sm font-semibold">
        <TrendingUp className="inline h-3 w-3 md:h-4 md:w-4 mr-1" />
        Trending Now
      </div>
      
      {/* Adjusted text sizes: 3xl on mobile to 5xl on desktop */}
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Featured Products
      </h2>
      
      {/* Slightly smaller text for better readability on small screens */}
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
        Check out our handpicked selection of top products
      </p>
    </div>

    {/* Optimized Grid: 
       - gap-4 on mobile (less wasted space)
       - gap-8 on large screens
    */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
      {featuredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>

    <div className="text-center">
      <Link to="/products">
        {/* Full width button on very small screens, auto width on larger ones */}
        <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all px-8 group">
          View All Products
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  </div>
</section>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Truck className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Free Shipping</h3>
                <p className="text-gray-600">
                  On orders over ₱50. Fast delivery worldwide.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure Payment</h3>
                <p className="text-gray-600">
                  100% secure with advanced encryption.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                <p className="text-gray-600">
                  Only the best from trusted brands.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-yellow-200 hover:-translate-y-2">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Fast Support</h3>
                <p className="text-gray-600">
                  24/7 customer support available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}