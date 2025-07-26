import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <XCircle className="w-16 h-16 text-orange-500" />
          </div>
          <CardTitle className="text-2xl text-orange-600">
            Ödeme İptal Edildi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Ödeme işlemi iptal edildi. Tekrar denemek isterseniz ürün sayfasına dönebilirsiniz.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Ürünlere Geri Dön
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('https://wa.me/905551234567', '_blank')}
              className="w-full"
            >
              WhatsApp İle Sipariş Ver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;