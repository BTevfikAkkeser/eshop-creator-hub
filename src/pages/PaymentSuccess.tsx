import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Log successful payment for analytics
    if (sessionId) {
      console.log('Payment successful:', sessionId);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Ödeme Başarılı!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Siparişiniz başarıyla alınmıştır. Kısa süre içinde WhatsApp üzerinden size ulaşacağız.
          </p>
          {sessionId && (
            <p className="text-xs text-muted-foreground">
              İşlem No: {sessionId}
            </p>
          )}
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Ana Sayfaya Dön
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('https://wa.me/905551234567', '_blank')}
              className="w-full"
            >
              WhatsApp İle İletişim
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;