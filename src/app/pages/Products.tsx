import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { categories, getAllProducts, Product} from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Grid3x3, LayoutGrid, Store, Headset, Glasses, Laptop, Camera, Smartphone, Tablet, RectangleEllipsis} from "lucide-react";

export function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const rawQuery = params.get("q") || "";
  const query = rawQuery.trim().toLowerCase();

  useEffect(() => {
    let mounted = true;
    getAllProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  let filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (query) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600">Loading products…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm md:text-xl font-semibold">
            <Grid3x3 className="inline h-4 w-4 mr-1" />
            Our Collection
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {query ? `Search results for "${rawQuery}"` : "All Products"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Browse our complete collection of premium electronics
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 items-stretch justify-items-stretch">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "text-normal md:text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all p-6"
                    : "text-sm md:text-normal hover:border-blue-600 hover:text-blue-600 transition-all"
                }
              >
                {category}
                {category && (() => {
  switch (category) {
    case "All":
      return <Store className="ml-2 h-4 w-4" />;
    case "Audio":
      return <Headset className="ml-2 h-4 w-4" />;
    case "Wearables":
      return <Glasses className="ml-2 h-4 w-4" />;
    case "Computers":
      return <Laptop className="ml-2 h-4 w-4" />;
    case "Cameras":
      return <Camera className="ml-2 h-4 w-4" />;
    case "Phones":
      return <Smartphone className="ml-2 h-4 w-4" />;
    case "Tablets":
      return <Tablet className="ml-2 h-4 w-4" />;
    default:
      return <RectangleEllipsis className="ml-2 h-4 w-4" />;
  }
})()}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <LayoutGrid className="h-24 w-24 mx-auto mb-6 text-gray-300" />
            <p className="text-gray-500 text-xl">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}