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
    <main>
      <Header />
      <HeroSection />
      <TamanhosSection />
      <Suspense fallback={<SectionFallback />}>
        <UrgenciaSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DiferenciaisSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <RegioesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <SocialProof />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ComoFuncionaSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FAQSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AboutSection />
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
