
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 glass shadow-md"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <span className="text-vivo-600 text-2xl font-bold mr-1">Zivo</span>
              <span className="text-mint-600 text-2xl font-bold">Health</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-foreground/80 font-medium hover:text-vivo-600 transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-foreground/80 font-medium hover:text-vivo-600 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-foreground/80 font-medium hover:text-vivo-600 transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-foreground/80 font-medium hover:text-vivo-600 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-foreground/80 font-medium hover:text-vivo-600 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="font-medium">
              Sign In
            </Button>
            <Button className="bg-vivo-600 text-white hover:bg-vivo-700 btn-hover">
              <Link to="/get-started">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X size={24} className="text-foreground" />
            ) : (
              <Menu size={24} className="text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass shadow-lg animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <a
              href="#how-it-works"
              className="block py-2 text-foreground/80 font-medium hover:text-vivo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#features"
              className="block py-2 text-foreground/80 font-medium hover:text-vivo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block py-2 text-foreground/80 font-medium hover:text-vivo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="block py-2 text-foreground/80 font-medium hover:text-vivo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="block py-2 text-foreground/80 font-medium hover:text-vivo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col space-y-2">
              <Button variant="ghost" className="justify-center font-medium">
                Sign In
              </Button>
              <Button className="bg-vivo-600 text-white hover:bg-vivo-700 justify-center">
                <Link to="/get-started">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
