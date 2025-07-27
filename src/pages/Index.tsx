import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import ProductUrun1 from "./ProductUrun1";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-pink-50 animate-fade-in">
      <div className="container mx-auto px-2 md:px-4">
        <Header />
        <Hero />
        <ProductGrid />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
