import { useCart } from "./CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash, Plus, Minus, ShoppingCart, BadgeCheck, Package, X, CreditCard } from "lucide-react";
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
      <div className="mb-4 p-8 border-2 border-dashed border-gray-200 rounded-3xl bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center min-w-[380px] shadow-xl animate-fade-in">
        {/* Modern SVG illüstrasyon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
            <ShoppingCart className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-xs font-bold">0</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-700 mb-2">Sepetiniz boş</div>
        <div className="text-gray-500 mb-6 text-center">Alışverişe başlamak için ürün ekleyin.</div>
        <Button 
          onClick={() => navigate("/")} 
          className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl px-8 py-3 text-base font-semibold"
        >
          Alışverişe Başla
        </Button>
      </div>
    );
  }

  return (
    <div className="relative mb-4 p-0 border-2 border-gray-100 rounded-3xl bg-white/95 backdrop-blur-sm min-w-[400px] shadow-2xl overflow-hidden animate-fade-in-up">
      <div className="flex justify-between items-center px-6 pt-6 pb-4 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-2xl tracking-tight text-gray-800">Sepetim</h4>
          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">
            {cart.length}
          </span>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
      
      <ul className="divide-y divide-gray-100 px-4 max-h-[400px] overflow-y-auto">
        {cart.map((item, idx) => (
          <li 
            key={item.id} 
            className="flex items-center gap-4 py-4 group hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-2xl transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Ürün görseli */}
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-lg group-hover:shadow-xl transition-all duration-300">
              {item.image ? (
                <img src={item.image} alt={item.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <Package className="w-10 h-10 text-gray-400" />
              )}
            </div>
            
            {/* Ürün bilgileri */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-800 truncate text-base group-hover:text-primary transition-colors">{item.name}</span>
                <span className="bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary text-xs px-3 py-1 rounded-full font-medium">Kategori</span>
                <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                  <BadgeCheck className="w-3 h-3" />Stokta
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary">₺{item.price}</span>
                <span className="text-xs text-gray-400">x</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDecrease(item)} 
                    disabled={item.quantity === 1} 
                    className="h-8 w-8 p-0 border-gray-300 hover:border-primary hover:bg-primary/10 transition-all duration-300 rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-base font-semibold text-gray-700 min-w-[2rem] text-center">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleIncrease(item)} 
                    className="h-8 w-8 p-0 border-gray-300 hover:border-primary hover:bg-primary/10 transition-all duration-300 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Toplam ve sil */}
            <div className="flex flex-col items-end gap-3 min-w-[80px]">
              <span className="text-lg font-bold text-primary">₺{item.price * item.quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemove(item)} 
                className="text-red-500 opacity-70 hover:opacity-100 hover:bg-red-50 transition-all duration-300 rounded-full w-8 h-8"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      
      {/* Sabit alt panel */}
      <div className="sticky bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/95 to-white/80 px-6 py-6 border-t border-gray-100 flex flex-col gap-4 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Toplam:</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">₺{total}</span>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={clearCart} 
            size="sm" 
            className="rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all duration-300 flex-1"
          >
            Sepeti Temizle
          </Button>
          <Button 
            variant="default" 
            onClick={handleCartCheckout} 
            size="sm" 
            className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl flex-1 text-base font-semibold flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Satın Al
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 