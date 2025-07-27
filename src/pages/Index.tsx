import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import ProductUrun1 from "./ProductUrun1";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProductGrid />
      <div className="mt-8">
        <Link to="/urun1" className="text-blue-600 underline">
          Ürün 1 Detay Sayfası
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
