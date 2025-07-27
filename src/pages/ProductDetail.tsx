import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import { Loader2, ArrowLeft, Heart, Share2, Star, Truck, Shield, RotateCcw } from "lucide-react";
import img1 from "../assets/Urun1/1.jpg";
import img2 from "../assets/Urun1/2.jpg";
import img3 from "../assets/Urun1/3.jpg";
import img4 from "../assets/Urun1/4.jpg";
import img5 from "../assets/Urun1/5.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ShoppingCart, CheckCircle, XCircle, MessageCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  in_stock: boolean;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductAndImages = async () => {
      setLoading(true);
      // Ürünü getir
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, name, price, description, in_stock")
        .eq("id", Number(id))
        .single();
      if ((productError || !productData) && id === "1001") {
        // Statik Ürün 1 fallback
        setProduct({
          id: 1001,
          name: "Sevimli Ay Çocuk Amigurumi",
          price: 249.99,
          description: "Bu sevimli ay amigurumi, yumuşak ipliklerle el yapımı olarak üretilmiştir. Çocukların odasında harika bir dekorasyon öğesi olacak ve onlara güvenli bir oyun arkadaşı olacaktır. %100 pamuk iplik kullanılarak, alerji riski olmadan üretilmiştir.",
          in_stock: true,
        });
        const urun1Images = [img1, img2, img3, img4, img5];
        setImages(urun1Images);
        setSelectedImage(urun1Images[0]);
        setLoading(false);
        return;
      }
      if (productError || !productData) {
        setLoading(false);
        return;
      }
      setProduct(productData);
      // Görselleri getir
      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .select("image_path")
        .eq("product_id", Number(id))
        .order("id", { ascending: true });
      const imageUrls = (imageData || []).map((img: { image_path: string }) => img.image_path);
      setImages(imageUrls);
      setSelectedImage(imageUrls[0] || null);
      setLoading(false);
    };
    if (id) fetchProductAndImages();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: images[0] || undefined,
      quantity: quantity,
    });
  };

  const handleBuyNow = async () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        {/* Geri Butonu */}
        <button
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-lg hover:shadow-xl hover:scale-105"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Geri</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Sol Taraf - Görseller */}
          <div className="space-y-6">
            {/* Ana Görsel */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((img, idx) => (
                    <CarouselItem key={img} className="flex items-center justify-center">
                      <div className="relative group">
                        <img
                          src={img}
                          alt={`Ürün fotoğrafı ${idx + 1}`}
                          className="w-full h-96 md:h-[500px] object-cover transition-all duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white/90 hover:bg-white shadow-lg" />
                <CarouselNext className="bg-white/90 hover:bg-white shadow-lg" />
              </Carousel>
            </div>

            {/* Thumbnail Galeri */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
                      selectedImage === img ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sağ Taraf - Ürün Bilgileri */}
          <div className="space-y-8 animate-fade-in-up delay-200">
            {/* Başlık ve Fiyat */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(24 değerlendirme)</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">₺{product.price}</span>
                {product.in_stock ? (
                  <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                    <CheckCircle className="w-5 h-5" /> Stokta
                  </span>
                ) : (
                  <span className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                    <XCircle className="w-5 h-5" /> Stokta Yok
                  </span>
                )}
              </div>
            </div>

            {/* Miktar Seçimi */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Miktar</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full"
                >
                  <span className="text-lg">-</span>
                </Button>
                <span className="w-16 text-center text-lg font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full"
                >
                  <span className="text-lg">+</span>
                </Button>
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-xl transition-all duration-300 hover:scale-105 text-lg py-6 rounded-2xl font-semibold"
                  onClick={handleBuyNow}
                  disabled={!product.in_stock}
                >
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Hemen Satın Al
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-12 h-12 rounded-2xl border-2"
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                >
                  <Heart className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-12 h-12 rounded-2xl border-2"
                >
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 text-lg py-6 rounded-2xl font-semibold"
                onClick={() => window.open(`https://wa.me/905551234567?text=Merhaba! ${product.name} ürününü satın almak istiyorum.`, '_blank')}
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                WhatsApp İle Sipariş Ver
              </Button>
            </div>

            {/* Özellikler */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/80 rounded-2xl">
                <Truck className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-semibold">Ücretsiz Kargo</div>
                  <div className="text-sm text-gray-600">2-3 iş günü</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/80 rounded-2xl">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-semibold">Güvenli Ödeme</div>
                  <div className="text-sm text-gray-600">SSL korumalı</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/80 rounded-2xl">
                <RotateCcw className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-semibold">Kolay İade</div>
                  <div className="text-sm text-gray-600">14 gün içinde</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/80 rounded-2xl">
                <CheckCircle className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-semibold">Kalite Garantisi</div>
                  <div className="text-sm text-gray-600">%100 el yapımı</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ürün Açıklaması */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 animate-fade-in-up delay-300">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Ürün Açıklaması</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-lg mb-6">{product.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Özellikler</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      %100 pamuk iplik
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      El yapımı
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Çocuk güvenliği
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Yıkanabilir
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Bakım</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Soğuk suda yıkayın
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Düşük ısıda ütüleyin
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Direkt güneş ışığından koruyun
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Kuru temizleme önerilmez
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 