import { useCart } from "./CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash, Plus, Minus, ShoppingCart, BadgeCheck, Package } from "lucide-react";
import type { CartItem } from "./CartContext";
import { useNavigate } from "react-router-dom";

const Cart = ({ onClose }: { onClose?: () => void }) => {
  const { cart, clearCart, addToCart } = useCart();
  const { toast } = useToast();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const handleCartCheckout = async () => {
    if (cart.length === 0) return;
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
        }
      });
      if (error) {
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
      toast({
        title: "Hata",
        description: "Ödeme işlemi başlatılırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleIncrease = (item: CartItem) => {
    addToCart({ ...item, quantity: 1 });
  };
  const handleDecrease = (item: CartItem) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: -1 });
    }
  };
  const handleRemove = (item: CartItem) => {
    addToCart({ ...item, quantity: -item.quantity });
  };

  if (cart.length === 0) {
    return (
      <div className="mb-4 p-8 border rounded-xl bg-white flex flex-col items-center min-w-[340px] shadow-lg">
        {/* Modern SVG illüstrasyon */}
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 animate-bounce">
          <rect x="20" y="40" width="80" height="50" rx="12" fill="#f3f4f6" />
          <rect x="30" y="50" width="60" height="30" rx="8" fill="#e0e7ef" />
          <rect x="45" y="65" width="30" height="8" rx="4" fill="#cbd5e1" />
          <circle cx="40" cy="95" r="7" fill="#a5b4fc" />
          <circle cx="80" cy="95" r="7" fill="#a5b4fc" />
        </svg>
        <div className="text-xl font-bold text-gray-700 mb-1">Sepetiniz boş</div>
        <div className="text-sm text-gray-500 mb-4">Alışverişe başlamak için ürün ekleyin.</div>
        <Button onClick={() => navigate("/")} variant="default" className="rounded-full px-6 py-2 text-base shadow-md">Alışverişe Başla</Button>
      </div>
    );
  }

  return (
    <div className="relative mb-4 p-0 border rounded-xl bg-white min-w-[360px] shadow-lg overflow-hidden">
      <div className="flex justify-between items-center px-6 pt-6 pb-2">
        <h4 className="font-bold text-2xl tracking-tight">Sepetim</h4>
        {onClose && (
          <button onClick={onClose} className="text-2xl font-bold text-gray-400 hover:text-gray-700 transition">×</button>
        )}
      </div>
      <ul className="divide-y divide-gray-200 px-2 max-h-[340px] overflow-y-auto">
        {cart.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4 group hover:bg-gray-50 rounded-lg transition">
            {/* Ürün görseli */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
              {item.image ? (
                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
              ) : (
                <Package className="w-10 h-10 text-gray-300" />
              )}
            </div>
            {/* Ürün bilgileri */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800 truncate text-base">{item.name}</span>
                {/* Kategori badge örnek */}
                <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium">Kategori</span>
                {/* Stok durumu örnek */}
                <span className="flex items-center gap-1 text-green-500 text-xs"><BadgeCheck className="w-3 h-3" />Stokta</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-indigo-600">₺{item.price}</span>
                <span className="text-xs text-gray-400">x</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" onClick={() => handleDecrease(item)} disabled={item.quantity === 1} className="h-7 w-7 p-0 border-gray-300"><Minus className="w-4 h-4" /></Button>
                  <span className="px-2 text-base font-semibold text-gray-700">{item.quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => handleIncrease(item)} className="h-7 w-7 p-0 border-gray-300"><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
            {/* Toplam ve sil */}
            <div className="flex flex-col items-end gap-2 min-w-[60px]">
              <span className="text-base font-bold text-gray-700">₺{item.price * item.quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => handleRemove(item)} className="text-destructive opacity-70 hover:opacity-100 hover:bg-red-50 transition"><Trash className="w-5 h-5" /></Button>
            </div>
          </li>
        ))}
      </ul>
      {/* Sabit alt panel */}
      <div className="sticky bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/90 to-white/60 px-6 py-4 border-t flex flex-col gap-2 shadow-[0_-2px_16px_-8px_rgba(0,0,0,0.06)]">
        <div className="flex justify-between items-center mb-1">
          <span className="text-lg font-semibold text-gray-700">Toplam:</span>
          <span className="text-2xl font-bold text-indigo-700">₺{total}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={clearCart} size="sm" className="rounded-full">Sepeti Temizle</Button>
          <Button variant="default" onClick={handleCartCheckout} size="sm" className="rounded-full flex-1 text-base font-semibold shadow-md">Satın Al</Button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 