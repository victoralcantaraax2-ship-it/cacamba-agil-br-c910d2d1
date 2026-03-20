import { useParams, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
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
  "cacamba-sao-paulo": {
    name: "São Paulo",
    title: "Aluguel de Caçamba em São Paulo | AMBA Caçambas",
    description: "Aluguel de caçamba em São Paulo capital com entrega rápida. Caçambas de 3m³ a 26m³. Peça pelo WhatsApp!",
  },
  "cacamba-guarulhos": {
    name: "Guarulhos",
    title: "Aluguel de Caçamba em Guarulhos SP | AMBA Caçambas",
    description: "Caçamba para entulho em Guarulhos/SP. Entrega ágil e preço justo. Peça agora pelo WhatsApp!",
  },
  "cacamba-osasco": {
    name: "Osasco",
    title: "Aluguel de Caçamba em Osasco SP | AMBA Caçambas",
    description: "Aluguel de caçamba em Osasco/SP com entrega rápida. Atendimento direto pelo WhatsApp!",
  },
  "cacamba-santo-andre": {
    name: "Santo André",
    title: "Aluguel de Caçamba em Santo André SP | AMBA Caçambas",
    description: "Caçamba para obra em Santo André/SP. Entrega ágil, preço justo e atendimento pelo WhatsApp!",
  },
  "cacamba-sao-bernardo": {
    name: "São Bernardo do Campo",
    title: "Aluguel de Caçamba em São Bernardo SP | AMBA Caçambas",
    description: "Aluguel de caçamba em São Bernardo do Campo/SP. Entrega rápida pelo WhatsApp!",
  },
  "cacamba-sao-caetano": {
    name: "São Caetano do Sul",
    title: "Aluguel de Caçamba em São Caetano SP | AMBA Caçambas",
    description: "Caçamba para entulho em São Caetano do Sul/SP. Entrega rápida e peça pelo WhatsApp!",
  },
};

const CidadeLanding = () => {
  const { cidade } = useParams<{ cidade: string }>();
  const config = cidade ? cities[cidade] : undefined;

  useEffect(() => {
    if (!config) return;
    document.title = config.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", config.description);
  }, [config]);

  if (!config) return <Navigate to="/" replace />;

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
