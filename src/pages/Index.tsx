import { lazy, Suspense, useEffect, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TamanhosSection from "@/components/TamanhosSection";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { getWhatsAppUrl } from "@/lib/whatsapp";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "NORTEX Caçambas",
  "image": "https://nortexcacambas.com/og-image.png",
  "url": "https://nortexcacambas.com",
  "telephone": "+55-11-98684-7426",
  "email": "atendimento@nortexcacambas.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "addressCountry": "BR"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "06:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "07:00",
      "closes": "18:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "312",
    "reviewCount": "287"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Organization", "name": "Shopping Aricanduva" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Reforma na praça de alimentação e a NORTEX forneceu caçambas durante toda a obra. Logística impecável e equipe muito profissional."
    },
    {
      "@type": "Review",
      "author": { "@type": "Organization", "name": "MRV Engenharia" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "A NORTEX é parceira fixa em nossas obras na Grande São Paulo. Nunca apresentaram falhas."
    },
    {
      "@type": "Review",
      "author": { "@type": "Organization", "name": "Universidade Cruzeiro do Sul" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Reforma no campus Anália Franco. A NORTEX atendeu com caçambas de grande porte e cumpriu todos os prazos."
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Josy Araujo" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Atendimento ágil pelo WhatsApp. Caçamba entregue no mesmo dia. Recomendo fortemente."
    },
    {
      "@type": "Review",
      "author": { "@type": "Organization", "name": "Cond. Parque dos Pássaros" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Contratamos a NORTEX para descarte de entulho da reforma do salão de festas. Entrega pontual e equipe educada."
    }
  ],
  "priceRange": "R$ 175 - R$ 620",
  "description": "Aluguel de caçamba em São Paulo com entrega em até 2 horas. Atendimento imediato, preço justo e empresa confiável.",
  "sameAs": []
};

const Index = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && ["#1", "#whatsapp"].includes(window.location.hash.toLowerCase())) {
      window.location.replace(getWhatsAppUrl());
    }
  }, []);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <HeroSection />
      <RevealSection>
        <TamanhosSection />
      </RevealSection>
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
        <RevealSection delay={50}>
          <RegioesSection />
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
