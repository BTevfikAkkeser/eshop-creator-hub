import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, ShoppingBag, Phone } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const whatsappUrl = "https://wa.me/905551234567?text=Merhaba! Minik Hediyem'den özel bir tasarım talebi yapmak istiyorum.";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MH</span>
            </div>
            <span className="text-xl font-bold text-foreground">Minik Hediyem</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Ana Sayfa
            </a>
            <a href="#products" className="text-foreground hover:text-primary transition-colors">
              Ürünler
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Kategoriler
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Hakkımızda
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              İletişim
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                <ShoppingBag className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-primary hover:opacity-90 text-white"
                onClick={() => window.open(whatsappUrl, '_blank')}
              >
                <Phone className="w-4 h-4 mr-2" />
                İletişim
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-border shadow-soft">
            <nav className="flex flex-col space-y-4 p-4">
              <a 
                href="#" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </a>
              <a 
                href="#products" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ürünler
              </a>
              <a 
                href="#" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Kategoriler
              </a>
              <a 
                href="#" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </a>
              <a 
                href="#" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                İletişim
              </a>
              <div className="flex space-x-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Favoriler
                </Button>
                <Button 
                  size="sm" 
                  className="bg-gradient-primary hover:opacity-90 text-white flex-1"
                  onClick={() => {
                    window.open(whatsappUrl, '_blank');
                    setIsMenuOpen(false);
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  İletişim
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;