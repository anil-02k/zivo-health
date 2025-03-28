
import { Facebook, Twitter, Instagram, Github, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-vivo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-vivo-600 text-2xl font-bold mr-1">Vivo</span>
              <span className="text-mint-600 text-2xl font-bold">Health</span>
            </div>
            <p className="text-foreground/70 mb-4">
              Making complex health data simple, actionable, and meaningful.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/60 hover:text-vivo-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-vivo-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-vivo-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-vivo-600 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">Features</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">Testimonials</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">Blog</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">Health Library</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">Guides & Tutorials</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">Careers</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-vivo-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-vivo-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/60 text-sm mb-4 md:mb-0">
              © {currentYear} Vivo Health. All rights reserved.
            </p>
            <div className="flex items-center">
              <a href="mailto:hello@vivohealth.com" className="flex items-center text-foreground/60 hover:text-vivo-600 transition-colors text-sm">
                <Mail size={16} className="mr-2" />
                hello@vivohealth.com
              </a>
              <span className="mx-4 text-foreground/40">|</span>
              <p className="text-foreground/60 text-sm flex items-center">
                Made with <Heart size={14} className="text-red-500 mx-1" /> for better health
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
