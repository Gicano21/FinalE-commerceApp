import { Link, useLocation } from "react-router"; 
import { useEffect } from "react";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";
import images from "../assets/one.jpg";

export function Footer() {
  const { pathname } = useLocation();

  // Reset scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-white text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TechStore
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your one-stop shop for premium electronics and tech accessories.
            </p>
            {/* Social Icons - Optional but nice to have since you imported them */}
            <div className="flex gap-4 pt-2">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-blue-400 transition-colors" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-blue-400 transition-colors" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-pink-400 transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Home Page", path: "/" },
                { name: "Shop All Products", path: "/products" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "User Agreement", path: "/useragreement" },
                { name: "Privacy Policy", path: "/privacy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="hover:text-white transition-all hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="hover:text-white transition-all hover:translate-x-1 inline-block">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-all hover:translate-x-1 inline-block">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-all hover:translate-x-1 inline-block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Image Section - Fixed Tailwind Classes */}
          <div className="flex justify-center md:justify-end">
            <img 
              src={images} 
              alt="Promotion"
              className="w-full max-w-[300px] h-auto rounded-xl shadow-2xl object-cover border border-gray-700" 
            />
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TechStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}