import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImageToSupabase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, Trash2, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  "Amigurumi Bebekler",
  "Parti Süsleri",
  "Doğum Günü",
  "Bebek Parti",
  "Oyuncaklar",
  "Dekorasyon"
];

const AddProduct = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImageToSupabase(file);
        uploadedUrls.push(url);
      }
      
      setImageUrls(prev => [...prev, ...uploadedUrls]);
      toast({
        title: "Başarılı",
        description: `${files.length} görsel başarıyla yüklendi!`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Görsel yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || imageUrls.length === 0) {
      toast({ 
        title: "Eksik Bilgi", 
        description: "Lütfen tüm alanları doldurun ve en az bir görsel yükleyin.", 
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    try {
      // Ürünü Supabase veritabanına ekle
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert([
          {
            name,
            price: parseFloat(price),
            category,
            description,
            image_path: imageUrls[0], // Ana görsel
            in_stock: true,
            featured: false,
          },
        ])
        .select()
        .single();

      if (productError) throw productError;

      // Ürün görsellerini ekle
      if (imageUrls.length > 1) {
        const imageData = imageUrls.map((url, index) => ({
          product_id: productData.id,
          image_path: url,
          order: index,
        }));

        const { error: imageError } = await supabase
          .from("product_images")
          .insert(imageData);

        if (imageError) throw imageError;
      }

      toast({ 
        title: "Başarılı", 
        description: "Ürün başarıyla eklendi!" 
      });
      
      // Formu temizle
      setName("");
      setPrice("");
      setCategory(categories[0]);
      setDescription("");
      setImageUrls([]);
      
      // Ana sayfaya yönlendir
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ 
        title: "Hata", 
        description: message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Yeni Ürün Ekle
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ürün Bilgileri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  placeholder="Ürün adını girin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Durumu
                </label>
                <select
                  defaultValue="true"
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                >
                  <option value="true">Stokta</option>
                  <option value="false">Stokta Yok</option>
                </select>
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Açıklaması
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
                placeholder="Ürün açıklamasını girin..."
              />
            </div>

            {/* Görsel Yükleme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Görselleri
              </label>
              
              {/* Görsel Yükleme Alanı */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary transition-all duration-300">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {uploading ? "Yükleniyor..." : "Görselleri seçin veya sürükleyin"}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF (Maksimum 5MB)
                  </p>
                </label>
              </div>

              {/* Yüklenen Görseller */}
              {imageUrls.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Yüklenen Görseller</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Görsel ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Ana Görsel
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Butonlar */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-300 rounded-2xl py-4 font-semibold"
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl py-4 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Ürünü Ekle
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct; 