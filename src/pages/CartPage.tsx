import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { cart, clearCart } = useCart();
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
    return <div className="container mx-auto px-4 py-12">Sepetiniz boş.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Sepet</h2>
      <ul className="mb-4">
        {cart.map((item) => (
          <li key={item.id} className="flex justify-between items-center mb-1">
            <span>{item.name} x{item.quantity}</span>
            <span>₺{item.price * item.quantity}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between font-semibold mb-4">
        <span>Toplam:</span>
        <span>₺{total}</span>
      </div>
      <form className="space-y-3 mb-4" onSubmit={e => { e.preventDefault(); handleCartCheckout(); }}>
        <input
          type="text"
          placeholder="Ad Soyad"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="tel"
          placeholder="Telefon Numarası"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <textarea
          placeholder="Adres Bilgisi"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "İşleniyor..." : "Sepetteki Ürünleri Satın Al"}</Button>
      </form>
      <Button variant="destructive" onClick={clearCart} size="sm">Sepeti Temizle</Button>
    </div>
  );
};

export default CartPage; 