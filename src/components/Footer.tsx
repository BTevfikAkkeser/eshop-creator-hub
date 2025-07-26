import { Heart, Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const whatsappUrl = "https://wa.me/905551234567?text=Merhaba! Minik Hediyem'den özel bir tasarım talebi yapmak istiyorum.";

  return (
    <footer className="bg-gradient-hero border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MH</span>
              </div>
              <span className="text-xl font-bold text-foreground">Minik Hediyem</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              El yapımı amigurumi bebekler ve parti süsleriyle sevdiklerinizi mutlu edin. 
              Kişiye özel tasarımlar ve kaliteli hizmet.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Facebook className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="#products" className="text-muted-foreground hover:text-primary transition-colors">
                  Ürünler
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Kategoriler
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Hakkımızda
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Kategoriler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Amigurumi Bebekler
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Parti Süsleri
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Doğum Günü
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Bebek Parti
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">İletişim</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+90 555 123 45 67</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@minikhediyem.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-primary hover:opacity-90 text-white mt-4"
              onClick={() => window.open(whatsappUrl, '_blank')}
            >
              WhatsApp İletişim
            </Button>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            © 2024 Minik Hediyem. Tüm hakları saklıdır. 
            <Heart className="w-4 h-4 text-primary fill-current" />
            ile yapıldı.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;