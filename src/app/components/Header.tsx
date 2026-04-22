import { Link, useNavigate, useLocation } from "react-router"; // Added useLocation
import { ShoppingCart, Menu, User, X, Search } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/TechStoreLogo-removebg-preview.png";
import { products } from "../data/products";

export function Header() {
  const { getTotalItems } = useCart();
  const { isAuthenticated, user} = useAuth(); // Removed 'user' if not used
  const navigate = useNavigate();
  const { pathname } = useLocation(); // Hook to listen for route changes
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const totalItems = getTotalItems();

  // --- SCROLL TO TOP LOGIC ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); 
  // ---------------------------

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );

    setSearchResults(filtered);
    setShowResults(true);
  };

  const handleSelectProduct = (productId: number) => {
    navigate(`/products/${productId}`);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setMobileMenuOpen(false); // Close menu on selection
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-black/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo - Changed to Link */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity mr-[5%]">
            <img src={logo} alt="Tech Store" className="h-20 w-auto rounded-[15%] shadow-md" />
          </Link>

          {/* Desktop Navigation - Changed to Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white hover:text-blue-600 transition-colors font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/products" className="text-white hover:text-blue-600 transition-colors font-medium relative group">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-white hover:text-blue-600 transition-colors font-medium relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-white hover:text-blue-600 transition-colors font-medium relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 flex-1 mx-8 relative" ref={searchRef}>
            <Search className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowResults(true)}
              className="pl-10 bg-white text-gray-900 placeholder:text-gray-500"
            />
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors text-left"
                  >
                    <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500 truncate">{product.category}</p>
                      <p className="text-sm font-semibold text-blue-600">₱{product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions - Changed to Links */}
          <div className="flex items-center gap-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full text-white">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs flex items-center justify-center font-semibold animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <Link to="/account">
                <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-gray-100 rounded-full text-white">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all">
                  Sign In
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Changed to Links */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-6 border-t flex flex-col gap-4 animate-in slide-in-from-top">
            <Link to="/" className="text-white hover:text-blue-600 transition-colors font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="text-white hover:text-blue-600 transition-colors font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            <Link to="/about" className="text-white hover:text-blue-600 transition-colors font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-blue-600 transition-colors font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            {isAuthenticated ? (
              <Link to="/account" className="text-white hover:text-blue-600 transition-colors font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
                My Account
              </Link>
            ) : (
              <Link to="/login" className="text-white hover:text-blue-600 transition-colors font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}