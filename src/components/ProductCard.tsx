import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  image_path?: string;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  in_stock?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const discount = product.original_price && product.original_price > product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const whatsappMessage = `Merhaba! ${product.name} ürününü satın almak istiyorum.`;
  const whatsappUrl = `https://wa.me/905427956344?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToCart = () => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image_path,
      quantity: 1,
    });
    toast({
      title: "Sepete Eklendi",
      description: `${product.name} sepete eklendi!`,
    });
  };

  const handleBuyNow = async () => {
    handleAddToCart();
    // Sepete ekledikten sonra ödeme işlemini başlat
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          productId: product.id,
          productName: product.name,
          price: product.price
        }
      });
      if (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Hata",
          description: "Ödeme sayfası açılırken bir hata oluştu.",
          variant: "destructive",
        });
        return;
      }
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Hata",
        description: "Ödeme işlemi başlatılırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className="group overflow-hidden bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={e => {
        // Butonlara tıklanırsa yönlendirme olmasın
        if ((e.target as HTMLElement).closest('button')) return;
        navigate(`/product/${product.id}`);
      }}
    >
      <div className="relative aspect-square overflow-hidden">
        {product.image_path ? (
          <img 
            src={product.image_path} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <span className="text-4xl">🎁</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              Öne Çıkan
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground text-xs">
              %{discount} İndirim
            </Badge>
          )}
        </div>
        
        {/* Wishlist button */}
        <button className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-soft transition-all duration-200 hover:scale-110">
          <Heart className="w-4 h-4 text-muted-foreground hover:text-primary" />
        </button>
        
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Stokta Yok
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-2 text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating!) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews || 0})
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-primary">
              ₺{product.price}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₺{product.original_price}
              </span>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="space-y-2">
          <Button 
            className="w-full bg-gradient-primary hover:opacity-90 text-white transition-all duration-200 hover:shadow-glow"
            disabled={!product.in_stock}
            onClick={handleBuyNow}
          >
            {product.in_stock ? 'Kredi Kartı ile Satın Al' : 'Stokta Yok'}
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            disabled={!product.in_stock}
            onClick={handleAddToCart}
          >
            Sepete Ekle
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            disabled={!product.in_stock}
            onClick={() => window.open(whatsappUrl, '_blank')}
          >
            WhatsApp İle Sipariş
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;