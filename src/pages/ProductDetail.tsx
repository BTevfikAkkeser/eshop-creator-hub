import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import { Loader2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  in_stock: boolean;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndImages = async () => {
      setLoading(true);
      // Ürünü getir
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, name, price, description, in_stock")
        .eq("id", Number(id))
        .single();
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
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Görsel Galerisi */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} className="object-contain w-full h-full transition-all duration-300" />
            ) : (
              <div className="text-gray-400 text-4xl">🎁</div>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            {images.map((img, idx) => (
              <button
                key={img}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-lg border-2 ${selectedImage === img ? 'border-primary' : 'border-gray-200'} overflow-hidden focus:outline-none`}
              >
                <img src={img} alt={`Ürün fotoğrafı ${idx + 1}`} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>
        {/* Ürün Bilgileri */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-foreground mb-2">{product.name}</h2>
          <div className="text-xl font-semibold text-primary mb-2">₺{product.price}</div>
          <div className="text-muted-foreground mb-4">{product.description}</div>
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-white shadow-glow transition-all duration-300 hover:scale-105"
            onClick={() => addToCart({ id: String(product.id), name: product.name, price: product.price, image: selectedImage || undefined, quantity: 1 })}
            disabled={!product.in_stock}
          >
            Sepete Ekle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 