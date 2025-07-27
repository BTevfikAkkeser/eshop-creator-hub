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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-lg animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-sm">MH</span>
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Minik Hediyem</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-medium">
              Ana Sayfa
            </a>
            <a href="#products" className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-medium">
              Ürünler
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-medium">
              Kategoriler
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-medium">
              Hakkımızda
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105 font-medium">
              İletişim
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Sepet ikonu */}
            <button
              className="relative p-3 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white hover:from-primary/90 hover:to-blue-500/90 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
              onClick={() => navigate("/cart")}
              aria-label="Sepeti Aç"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold animate-pulse shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-full">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-full">
                <ShoppingBag className="w-5 h-5" />
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full px-4"
                onClick={() => window.open(whatsappUrl, '_blank')}
              >
                <Phone className="w-4 h-4 mr-2" />
                İletişim
              </Button>
              {/* Kullanıcı hesabı/giriş */}
              {user ? (
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-full" onClick={signOut}>
                  <User className="w-4 h-4 mr-2" /> Çıkış Yap
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-full" onClick={() => setAuthModal(true)}>
                  <User className="w-4 h-4 mr-2" /> Giriş Yap
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-foreground hover:text-primary transition-all duration-300 hover:scale-110 rounded-full hover:bg-primary/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation ve diğer modallar */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-xl animate-fade-in-down">
            <nav className="flex flex-col space-y-2 p-6">
              <a 
                href="#" 
                className="text-foreground hover:text-primary transition-all duration-300 py-3 px-4 rounded-xl hover:bg-primary/10 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </a>
              <a 
                href="#products" 
                className="text-foreground hover:text-primary transition-all duration-300 py-3 px-4 rounded-xl hover:bg-primary/10 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Ürünler
              </a>
              <a 
                href="#" 
                className="text-foreground hover:text-primary transition-all duration-300 py-3 px-4 rounded-xl hover:bg-primary/10 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Kategoriler
              </a>
              <a 
                href="#" 
                className="text-foreground hover:text-primary transition-all duration-300 py-3 px-4 rounded-xl hover:bg-primary/10 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </a>
              <a 
                href="#" 
                className="text-foreground hover:text-primary transition-all duration-300 py-3 px-4 rounded-xl hover:bg-primary/10 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                İletişim
              </a>
              <div className="flex space-x-3 pt-4 border-t border-border/50">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-xl flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Favoriler
                </Button>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl flex-1"
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
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-xl flex-1" onClick={signOut}>
                    <User className="w-4 h-4 mr-2" /> Çıkış Yap
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-xl flex-1" onClick={() => { setAuthModal(true); setIsMenuOpen(false); }}>
                    <User className="w-4 h-4 mr-2" /> Giriş Yap
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
        
        {/* Sepet Modalı */}
        {cartOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-fade-in" onClick={() => setCartOpen(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl animate-fade-in-up">
              <Cart onClose={() => setCartOpen(false)} />
            </div>
          </div>
        )}
        
        {/* Giriş/Kayıt Modalı */}
        {authModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-fade-in" onClick={() => setAuthModal(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-8 min-w-[400px] animate-fade-in-up">
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