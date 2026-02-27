import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CepSection from "@/components/CepSection";
import AboutSection from "@/components/AboutSection";
import DifferentialsSection from "@/components/DifferentialsSection";
import SocialProof from "@/components/SocialProof";
import GallerySection from "@/components/GallerySection";

import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  useEffect(() => {
    // Google tag (gtag.js) — apenas na página inicial
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=AW-17975915134";
    script.async = true;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", "AW-17975915134");

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <main>
      <HeroSection />
      <CepSection />
      <AboutSection />
      <DifferentialsSection />
      <SocialProof />
      <GallerySection />
      
      <Footer />
      <WhatsAppFloat />
    </main>
  );
};

export default Index;
