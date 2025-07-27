import { Button } from "@/components/ui/button";
// import heroImage from "@/assets/hero-image.jpg";

const HERO_IMAGE_URL = "https://bvbsjfhuclqjzconvqml.supabase.co/storage/v1/object/public/product-images//hero-image.jpg";

const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      
      {/* Hero image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={HERO_IMAGE_URL} 
          alt="Minik Hediyem - El yapımı hediyeler"
          className="w-full h-full object-cover rounded-xl shadow-2xl border-2 border-white/30"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Minik Hediyem ile Özel Anlar
          </h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Parti süsleri ve el yapımı amigurumi bebeklerle sevdiklerinizi mutlu edin. 
            Kişiye özel tasarımlar ve hızlı teslimat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-white shadow-glow transition-all duration-300 hover:scale-105"
              onClick={scrollToProducts}
            >
              Ürünleri İncele
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              WhatsApp İletişim
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default Hero;