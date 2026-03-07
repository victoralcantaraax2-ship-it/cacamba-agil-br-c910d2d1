import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CepSection from "@/components/CepSection";
import TamanhosSection from "@/components/TamanhosSection";
import SocialProof from "@/components/SocialProof";
import ComoFuncionaSection from "@/components/ComoFuncionaSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <main>
      <Header />
      <HeroSection />
      <TamanhosSection />
      <CepSection />
      <SocialProof />
      <ComoFuncionaSection />
      <FAQSection />
      <AboutSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
};

export default Index;
