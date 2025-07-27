import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImageToSupabase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Amigurumi Bebekler",
  "Parti Süsleri",
  "Doğum Günü",
  "Bebek Parti"
];

const AddProduct = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !image) {
      toast({ title: "Eksik Bilgi", description: "Tüm alanları doldurun.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Görseli Supabase Storage'a yükle
      const imageUrl = await uploadImageToSupabase(image);
      // Ürünü Supabase veritabanına ekle
      const { error } = await supabase.from("products").insert([
        {
          name,
          price: parseFloat(price),
          category,
          image_path: imageUrl,
          in_stock: true,
        },
      ]);
      if (error) throw error;
      toast({ title: "Başarılı", description: "Ürün eklendi!" });
      setName("");
      setPrice("");
      setCategory(categories[0]);
      setImage(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ title: "Hata", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Ürün Ekle</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ürün Adı"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="number"
          placeholder="Fiyat"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Ekleniyor..." : "Ürün Ekle"}</Button>
      </form>
    </div>
  );
};

export default AddProduct; 