import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TamanhosSection from "@/components/TamanhosSection";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ExitIntentPopup from "@/components/ExitIntentPopup";


const DiferenciaisSection = lazy(() => import("@/components/DiferenciaisSection"));
const RegioesSection = lazy(() => import("@/components/RegioesSection"));
const SocialProof = lazy(() => import("@/components/SocialProof"));
const ComoFuncionaSection = lazy(() => import("@/components/ComoFuncionaSection"));
const UrgenciaSection = lazy(() => import("@/components/UrgenciaSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionFallback = () => <div className="py-16" />;

const Index = () => {
  return (
    <main className="snap-container">
      <Header />
      <div className="snap-section">
        <HeroSection />
      </div>
      <div className="snap-section">
        <TamanhosSection />
      </div>
      <Suspense fallback={<SectionFallback />}>
        <div className="snap-section">
          <RegioesSection />
        </div>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <div className="snap-section">
          <SocialProof />
        </div>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <div className="snap-section">
          <ComoFuncionaSection />
        </div>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <div className="snap-section">
          <FAQSection />
        </div>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <div className="snap-section">
          <AboutSection />
        </div>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
      <WhatsAppFloat />
      <ExitIntentPopup />
    </main>
  );
};

export default Index;
