import { Link, useNavigate, useLocation } from "react-router";
import { ShoppingCart, Menu, User, X, Search, SendToBack } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/HeaderLogo.png";
import logoName from "../assets/HeaderNameLogo.png";
import { getAllProducts, Product } from "../data/products";

export function Header() {
  const { getTotalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  
  // 1. SPLIT INTO TWO DISTINCT REFS
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  
  const totalItems = getTotalItems();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let mounted = true;
    getAllProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!mounted) return;
      });

    return () => {
      mounted = false;
    };
  }, []);

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

  const closeSearch = () => {
    setSearchBarOpen(false);
    setShowResults(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
      searchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleSelectProduct = (productId: number) => {
    navigate(`/products/${productId}`);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setSearchBarOpen(false);
    setMobileMenuOpen(false);
  };

  // 2. UPDATE THE CLICK OUTSIDE LOGIC TO ACCOMMODATE BOTH REFS
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      const clickedOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(target);
      const clickedOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(target);

      // Only close if the click was outside of BOTH search containers
      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-black/60 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="relative flex h-20 items-center justify-between">

          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src={logo} 
                alt="Tech Store Logo" 
                className="h-13 md:h-16 lg:h-18 w-auto rounded-l-[15%]" 
              />
              <img 
                src={logoName} 
                alt="Tech Store Name" 
                className="h-12 md:h-15 lg:h-17 w-auto rounded-r-[15%]" 
              />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-2">
              {searchBarOpen && (
                // 3. ASSIGN DESKTOP REF HERE
                <div className="relative flex items-center" ref={desktopSearchRef}>
                  <button 
                    type="button"
                    onClick={() => { 
                      setSearchBarOpen(!searchBarOpen); 
                      setMobileMenuOpen(false);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-1 text-black hover:sky transition-colors"
                  >
                    <SendToBack className="h-5 w-5" />
                  </button>

                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    className="h-full md:w-80 lg:w-130 xl:w-200 pl-12 pr-4 bg-white text-gray-900 md:text-xl placeholder:text-gray-500 md:placeholder:text-xl border border-gray-300 rounded-lg shadow-sm"
                  />

                  {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelectProduct(product.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left"
                        >
                          <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-sm text-gray-500 truncate">{product.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchBarOpen(!searchBarOpen);
                setMobileMenuOpen(false);
              }}
              className={`hover:bg-gray-100 rounded-full text-white md:mr-2 ${
                !searchBarOpen ? "" : "md:hidden"
              }`}
            >
              <Search className="h-5 w-5" />
            </Button>

            {!searchBarOpen && (
              <nav className="hidden md:flex items-center gap-4 text-base lg:text-2xl">
                <Link to="/" className="text-white transition-colors font-medium hover:bg-gradient-to-r hover:from-purple-200 hover:to-blue-100 hover:text-gray-800 rounded-t-sm pl-2 pr-2 pb-6 mt-6">
                  Home
                </Link>
                <Link to="/products" className="text-white transition-colors font-medium hover:bg-gradient-to-r hover:from-purple-200 hover:to-blue-100 hover:text-gray-800 rounded-t-sm pl-2 pr-2 pb-6 mt-6">
                  Products
                </Link>
                <Link to="/about" className="text-white transition-colors font-medium hover:bg-gradient-to-r hover:from-purple-200 hover:to-blue-100 hover:text-gray-800 rounded-t-sm pl-2 pr-2 pb-6 mt-6">
                  About
                </Link>
                <Link to="/contact" className="text-white transition-colors font-medium hover:bg-gradient-to-r hover:from-purple-200 hover:to-blue-100 hover:text-gray-800 rounded-t-sm pl-2 pr-2 pb-6 mt-6">
                  Contact
                </Link>
              </nav>
            )}

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full text-white">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <Link to="/account" className="hidden md:flex items-center gap-2 text-white hover:text-sky-400 transition-colors text-xl">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full text-white">
                  <User className="h-5 w-5" />
                </Button>
                <span>{user?.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button className="bg-gradient-to-r from-purple-600 to-sky-600 hover:from-blue-300 hover:to-purple-300 text-white shadow-md hover:shadow-lg transition-all text-sm md:text-base px-4 py-2 rounded-lg md:text-normal lg:text-lg xl:text-xl hover:text-gray-800">
                  Sign In
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100 rounded-full text-white"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setSearchBarOpen(false);
              }}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

          </div>
        </div>
        {searchBarOpen && (
          // 4. ASSIGN MOBILE REF HERE
          <div className="md:hidden mt-2 relative border-t border-gray-200" ref={mobileSearchRef}>
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full h-full pl-4 pr-12 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg shadow-sm mb-2 mt-1"
            />
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left"
                  >
                    <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500 truncate">{product.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {mobileMenuOpen && !searchBarOpen && (
          <nav className="md:hidden py-6 border-t border-gray-200 flex flex-col gap-4">
            <Link to="/" className="text-white hover:text-blue-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="text-white hover:text-blue-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            <Link to="/about" className="text-white hover:text-blue-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-blue-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            {isAuthenticated ? (
              <Link to="/account" className="text-white hover:text-blue-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                {user?.name || "Account"}
              </Link>
            ) : (
              <Link to="/login" className="text-white hover:text-blue-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}