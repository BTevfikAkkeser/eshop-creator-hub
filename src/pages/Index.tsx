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
      <Footer />
    </div>
  );
};

export default Index;
