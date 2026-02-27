import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TamanhosSection from "@/components/TamanhosSection";
import ComoFuncionaSection from "@/components/ComoFuncionaSection";
import SocialProof from "@/components/SocialProof";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  useEffect(() => {
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
      <Header />
      <HeroSection />
      <TamanhosSection />
      <ComoFuncionaSection />
      <SocialProof />
      <AboutSection />
      <FAQSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
};

export default Index;
