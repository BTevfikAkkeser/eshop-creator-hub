import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Minus, ShoppingCart, Trash2, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "@/components/CartContext";

const CartPage = () => {
  const { cart, clearCart, removeFromCart, addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
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
            image: item.image, // Görsel bağlantısını ekle
            description: `${item.name} - El yapımı amigurumi ürün`
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

  const handleIncreaseQuantity = (item: CartItem) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: -1 });
    } else {
      removeFromCart(item.id);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">🛒</div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Sepetiniz Boş</h2>
          <p className="text-muted-foreground mb-8 text-lg">Alışverişe devam etmek için ürünleri inceleyebilirsiniz.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-xl transition-all duration-300 hover:scale-105 text-lg py-4 px-8 rounded-2xl font-semibold"
          >
            Alışverişe Başla
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-foreground bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Sepetim
        </h2>
        <p className="text-muted-foreground text-lg">Siparişinizi tamamlamak için bilgilerinizi girin</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sepet Ürünleri */}
        <div className="lg:col-span-2">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              Sepet Ürünleri ({cart.length})
            </h3>
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="flex items-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 gap-4 relative border border-gray-200/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-md" 
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-foreground">{item.name}</div>
                    <div className="text-muted-foreground text-sm mb-2">Birim Fiyat: ₺{item.price}</div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecreaseQuantity(item)}
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-bold text-primary min-w-[2rem] text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleIncreaseQuantity(item)}
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-primary">₺{item.price * item.quantity}</div>
                    <button
                      className="mt-2 p-2 rounded-full hover:bg-red-100 transition-colors"
                      onClick={() => removeFromCart(item.id)}
                      title="Ürünü sepetten çıkar"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ödeme Formu */}
        <div className="lg:col-span-1">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 animate-fade-in-up delay-200">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              Sipariş Bilgileri
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Ara Toplam:</span>
                  <span className="font-semibold">₺{total}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Kargo:</span>
                  <span className="font-semibold text-green-600">Ücretsiz</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-bold text-lg">Toplam:</span>
                  <span className="font-bold text-2xl text-primary">₺{total}</span>
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleCartCheckout(); }}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ad Soyad</label>
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Telefon Numarası</label>
                <input
                  type="tel"
                  placeholder="Telefon Numarası"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Adres Bilgisi</label>
                <textarea
                  placeholder="Adres Bilgisi"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
                  rows={3}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-xl transition-all duration-300 hover:scale-105 text-lg py-4 rounded-2xl font-semibold" 
                disabled={loading}
              >
                {loading ? "İşleniyor..." : "Siparişi Tamamla"}
              </Button>
            </form>
            
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
            
            {/* Alışverişe Devam Et Butonu */}
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full mt-4 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-2xl py-4 font-semibold"
            >
              ← Alışverişe Devam Et
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 