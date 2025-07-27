import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import img1 from "../assets/Urun1/1.jpg";

const product = {
  id: 1001,
  name: "Ürün 1 - Özel Tasarım Kupa",
  price: 249.99,
  image_path: img1,
  in_stock: true,
};

const ProductUrun1 = () => {
  const { addToCart } = useCart();

  const handleBuyNow = () => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image_path,
      quantity: 1,
    });
    // Burada ödeme entegrasyonu eklenebilir
    alert("Kredi kartı ile satın alma işlemi başlatıldı (örnek)");
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-sm bg-gradient-card border-border/50 shadow-md">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image_path}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4 flex flex-col gap-3">
          <h3 className="font-semibold text-lg mb-1 text-card-foreground text-center">
            {product.name}
          </h3>
          <div className="flex items-center justify-center mb-2">
            <span className="font-bold text-xl text-primary">₺{product.price}</span>
          </div>
          <Button
            className="w-full bg-gradient-primary hover:opacity-90 text-white transition-all duration-200 hover:shadow-glow"
            disabled={!product.in_stock}
            onClick={handleBuyNow}
          >
            {product.in_stock ? 'Kredi Kartı ile Satın Al' : 'Stokta Yok'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductUrun1; 