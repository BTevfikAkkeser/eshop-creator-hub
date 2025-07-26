import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";

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

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section id="products" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Özel Ürünlerimiz
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            El yapımı amigurumi bebekler ve parti süsleriyle sevdiklerinizi mutlu edin
          </p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Ürünler Yakında!
            </h3>
            <p className="text-muted-foreground">
              En güzel ürünlerimizi sizin için hazırlıyoruz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;