import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, ShoppingBag, Phone, User, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "./CartContext";
import Cart from "./Cart";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

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
            {/* Sepet ikonu */}
            <button
              className="relative p-2 rounded-full bg-primary text-white hover:bg-primary/80 transition"
              onClick={() => navigate("/cart")}
              aria-label="Sepeti Aç"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </button>
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
              {/* Kullanıcı hesabı/giriş */}
              {user ? (
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary" onClick={signOut}>
                  <User className="w-4 h-4 mr-1" /> Çıkış Yap
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary" onClick={() => setAuthModal(true)}>
                  <User className="w-4 h-4 mr-1" /> Giriş Yap
                </Button>
              )}
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

        {/* Mobile Navigation ve diğer modallar */}
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
                {/* Mobil kullanıcı hesabı/giriş */}
                {user ? (
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary flex-1" onClick={signOut}>
                    <User className="w-4 h-4 mr-1" /> Çıkış Yap
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary flex-1" onClick={() => { setAuthModal(true); setIsMenuOpen(false); }}>
                    <User className="w-4 h-4 mr-1" /> Giriş Yap
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
        {/* Sepet Modalı */}
        {cartOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setCartOpen(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-white rounded shadow-lg">
              <Cart onClose={() => setCartOpen(false)} />
            </div>
          </div>
        )}
        {/* Giriş/Kayıt Modalı */}
        {authModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setAuthModal(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-white rounded shadow-lg p-6 min-w-[320px]">
              {/* Giriş/Kayıt formu buraya eklenecek */}
              {/* <AuthForm onClose={() => setAuthModal(false)} /> */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;