import { useParams, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TamanhosSection from "@/components/TamanhosSection";
import CepSection from "@/components/CepSection";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const SocialProof = lazy(() => import("@/components/SocialProof"));
const ComoFuncionaSection = lazy(() => import("@/components/ComoFuncionaSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionFallback = () => <div className="py-16" />;

type CityConfig = {
  name: string;
  title: string;
  description: string;
};

const cities: Record<string, CityConfig> = {
  "cacamba-joinville": {
    name: "Joinville",
    title: "Aluguel de Caçamba em Joinville | AMBA Locação",
    description: "Aluguel de caçamba em Joinville/SC com entrega rápida. Caçambas de 3m³ a 26m³. Solicite pelo WhatsApp!",
  },
  "cacamba-sao-jose": {
    name: "São José",
    title: "Aluguel de Caçamba em São José SC | AMBA Locação",
    description: "Caçamba para entulho em São José/SC. Entrega ágil e preço justo. Solicite agora pelo WhatsApp!",
  },
  "cacamba-palhoca": {
    name: "Palhoça",
    title: "Aluguel de Caçamba em Palhoça SC | AMBA Locação",
    description: "Aluguel de caçamba em Palhoça/SC com entrega rápida. Atendimento direto pelo WhatsApp!",
  },
  "cacamba-itapema": {
    name: "Itapema",
    title: "Aluguel de Caçamba em Itapema SC | AMBA Locação",
    description: "Caçamba para obra em Itapema/SC. Entrega ágil, preço justo e atendimento pelo WhatsApp!",
  },
  "cacamba-navegantes": {
    name: "Navegantes",
    title: "Aluguel de Caçamba em Navegantes SC | AMBA Locação",
    description: "Aluguel de caçamba em Navegantes/SC. Entrega rápida e atendimento direto pelo WhatsApp!",
  },
  "cacamba-jaragua-do-sul": {
    name: "Jaraguá do Sul",
    title: "Aluguel de Caçamba em Jaraguá do Sul SC | AMBA Locação",
    description: "Caçamba para entulho em Jaraguá do Sul/SC. Entrega rápida e solicite pelo WhatsApp!",
  },
};

const CidadeLanding = () => {
  const { cidade } = useParams<{ cidade: string }>();
  const config = cidade ? cities[cidade] : undefined;

  // Update document title and meta for SEO
  if (typeof document !== "undefined") {
    document.title = config.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", config.description);
  }

  return (
    <main>
      <Header />
      <HeroSection cityName={config.name} />
      <TamanhosSection />
      <CepSection />
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
    </main>
  );
};

export default CidadeLanding;
