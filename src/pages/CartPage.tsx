import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

const CartPage = () => {
  const { cart, clearCart, removeFromCart } = useCart();
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [loading, setLoading] = useState(false);

  const handleCartCheckout = async () => {
    if (cart.length === 0) return;
    if (!address || !name || !phone) {
      toast({ title: "Eksik Bilgi", description: "Lütfen tüm alanları doldurun.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total,
          address,
          name,
          phone,
        }
      });
      if (error) {
        toast({ title: "Hata", description: "Ödeme sayfası açılırken bir hata oluştu.", variant: "destructive" });
        return;
      }
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({ title: "Hata", description: "Ödeme işlemi başlatılırken bir hata oluştu.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Sepetiniz Boş</h2>
        <p className="text-muted-foreground mb-4">Alışverişe devam etmek için ürünleri inceleyebilirsiniz.</p>
        <Button href="/" asChild>Alışverişe Başla</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Sepetim</h2>
      <div className="flex flex-col gap-4 mb-6">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center bg-white rounded-lg shadow p-4 gap-4 relative">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md border" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-lg">{item.name}</div>
              <div className="text-muted-foreground text-sm">Adet: {item.quantity}</div>
              <div className="font-bold text-primary mt-1">₺{item.price * item.quantity}</div>
            </div>
            <button
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
              onClick={() => removeFromCart(item.id)}
              title="Ürünü sepetten çıkar"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center font-semibold text-xl mb-6 border-t pt-4">
        <span>Toplam:</span>
        <span className="text-primary">₺{total}</span>
      </div>
      <form className="space-y-4 mb-6" onSubmit={e => { e.preventDefault(); handleCartCheckout(); }}>
        <input
          type="text"
          placeholder="Ad Soyad"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-4 py-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="tel"
          placeholder="Telefon Numarası"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border px-4 py-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <textarea
          placeholder="Adres Bilgisi"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="border px-4 py-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <Button type="submit" className="w-full text-lg py-3" disabled={loading}>{loading ? "İşleniyor..." : "Sepetteki Ürünleri Satın Al"}</Button>
      </form>
      <Button variant="destructive" onClick={clearCart} size="sm" className="w-full">Sepeti Temizle</Button>
    </div>
  );
};

export default CartPage; 