import { lazy, Suspense, useEffect, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TamanhosSection from "@/components/TamanhosSection";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ExitIntentPopup from "@/components/ExitIntentPopup";

const ConfiancaSection = lazy(() => import("@/components/ConfiancaSection"));
const RegioesSection = lazy(() => import("@/components/RegioesSection"));
const SocialProof = lazy(() => import("@/components/SocialProof"));
const ComoFuncionaSection = lazy(() => import("@/components/ComoFuncionaSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionFallback = () => <div className="py-16" />;

const RevealSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("revealed"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="reveal-section">
      {children}
    </div>
  );
};

const Index = () => {
  return (
    <main>
      <Header />
      <HeroSection />
      <RevealSection>
        <TamanhosSection />
      </RevealSection>
      <Suspense fallback={<SectionFallback />}>
        <RevealSection delay={50}>
          <RegioesSection />
        </RevealSection>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <RevealSection delay={50}>
          <SocialProof />
        </RevealSection>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <RevealSection delay={50}>
          <ComoFuncionaSection />
        </RevealSection>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <RevealSection delay={50}>
          <FAQSection />
        </RevealSection>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <RevealSection delay={50}>
          <AboutSection />
        </RevealSection>
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
