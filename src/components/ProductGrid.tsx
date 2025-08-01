import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";
import Cart from "./Cart";
import { ShoppingCart } from "lucide-react";
import img1 from "../assets/Urun1/1.jpg";

const categories = [
  "Tümü",
  "Amigurumi Bebekler",
  "Parti Süsleri",
  "Doğum Günü",
  "Bebek Parti"
];

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
  category?: string;
}

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(100);
        if (error) throw error;
        // Statik Ürün 1'i ekle
        const urun1 = {
          id: 1001,
          name: "Ürün 1 - Özel Tasarım Kupa",
          price: 249.99,
          image_path: img1,
          in_stock: true,
          category: "Parti Süsleri",
        };
        setProducts([...(data || []), urun1]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Tümü" || product.category === category;
    return matchesSearch && matchesCategory;
  });

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
        {/* Sepet ikonu ve modalı kaldırıldı */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/3 focus:ring-2 focus:ring-primary transition-all duration-300 shadow-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full border ${category === cat ? 'bg-primary text-white' : 'bg-white text-primary border-primary'} transition-all duration-300 hover:scale-105 shadow-sm`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight animate-fade-in">
            Özel Ürünlerimiz
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-100">
            El yapımı amigurumi bebekler ve parti süsleriyle sevdiklerinizi mutlu edin
          </p>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Ürün bulunamadı!
            </h3>
            <p className="text-muted-foreground">
              Aramanıza veya filtreye uygun ürün bulunamadı.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;