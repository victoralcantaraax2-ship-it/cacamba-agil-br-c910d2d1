import { useState } from "react";
import { ShieldCheck, Clock, CheckCircle, XCircle, MapPin, Search, Loader2, Zap, Star, Users, Phone } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import heroBg from "@/assets/hero-bg.webp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";
import logoAmba from "@/assets/logo-nortex-full.webp";

const badges = [
  { icon: Users, label: "+5.000 coletas realizadas" },
  { icon: ShieldCheck, label: "Desde 2021 em SP" },
  { icon: ShieldCheck, label: "Empresa regularizada" },
];

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const HeroSection = ({ cityName }: { cityName?: string }) => {
  const subtitle = "Solicite em menos de 1 minuto pelo WhatsApp. Sem burocracia, sem cadastro.";

  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<{ logradouro: string; bairro: string; localidade: string; uf: string; cep: string } | null>(null);
  const [cepError, setCepError] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepVisible, setCepVisible] = useState(false);

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
  };

  const fetchCep = async (digits: string) => {
    setCepLoading(true);
    setCepError(false);
    setAddress(null);
    setCepVisible(false);
    const startedAt = Date.now();
    const minDelay = 3000 + Math.random() * 2000; // 3-5s simulated lookup
    const waitMinDelay = async () => {
      const elapsed = Date.now() - startedAt;
      if (elapsed < minDelay) await new Promise((r) => setTimeout(r, minDelay - elapsed));
    };
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      await waitMinDelay();
      if (data.erro) { setCepError(true); } else {
        setAddress({ logradouro: data.logradouro, bairro: data.bairro, localidade: data.localidade, uf: data.uf, cep: data.cep });
        setTimeout(() => setCepVisible(true), 30);
      }
    } catch {
      await waitMinDelay();
      setCepError(true);
    }
    setCepLoading(false);
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 8) fetchCep(digits);
    else { setAddress(null); setCepError(false); setCepVisible(false); }
  };

  const handleCepWhatsApp = () => {
    if (!address) return;
    handleWhatsAppClick(`Olá! Tenho interesse na locação de uma caçamba. Meu CEP é ${address.cep}. Endereço: ${address.logradouro}, ${address.bairro} – ${address.localidade}/${address.uf}. Poderiam informar disponibilidade e valores?`);
  };

  return (
    <>
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden pt-16 md:min-h-screen">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Caçamba estacionária posicionada em obra para descarte de resíduos"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/84" />
        </div>

        <div className="container relative z-10 px-4 py-16 text-center md:py-24">

          <img
            src={logoAmba}
            alt="NORTEX Caçambas"
            className="mx-auto mb-10 h-28 w-auto opacity-95 md:mb-12 md:h-36"
            width={400}
            height={140}
            fetchPriority="high"
            decoding="async"
          />

          <h1 className="mb-6 text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:mb-7 md:text-5xl lg:text-[3.4rem]">
            Alugue sua caçamba em São Paulo e receba em até <span className="font-extrabold text-white">2 horas</span>.
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base text-white/75 md:mb-12 md:text-lg">
            {subtitle}
          </p>


          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() => handleWhatsAppClick()}
              className="inline-flex items-center gap-3 rounded-xl bg-whatsapp px-8 py-4 text-lg font-extrabold uppercase text-white shadow-2xl transition-all hover:scale-[1.02] hover:bg-whatsapp-hover md:px-12 md:py-5 md:text-xl"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="h-6 w-6" width={24} height={24} />
              FALAR NO WHATSAPP
            </button>
            <button
              onClick={() => scrollTo("#tamanhos")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 underline-offset-4 transition-all hover:text-white hover:underline md:text-base"
            >
              Ver tamanhos e preços
            </button>
          </div>

          {/* CEP inline */}
          <div className="mx-auto mt-10 max-w-md">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white/50">
              <MapPin className="mr-1 inline h-4 w-4 text-primary" />
              Consulte disponibilidade na sua região
            </p>
            <div className="rounded-2xl border-2 border-white/15 bg-white/10 p-2 shadow-lg">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none" />
                <input
                  placeholder="Informe seu CEP"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  maxLength={9}
                  inputMode="numeric"
                  className="h-14 w-full rounded-xl bg-white pl-12 pr-12 text-base font-semibold tracking-wider text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  style={{ fontSize: "16px" }}
                />
                {cepLoading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>

            {cepError && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-red-400 animate-fade-in">
                <XCircle className="h-4 w-4" />
                CEP não localizado. Verifique e tente novamente.
              </div>
            )}

            {address && (
              <div className={`mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4 transition-all duration-500 ${cepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-black uppercase tracking-wide text-green-400">Região atendida</span>
                </div>
                <p className="text-sm text-white/80">
                  {address.logradouro && `${address.logradouro}, `}{address.bairro && `${address.bairro} – `}{address.localidade}/{address.uf}
                </p>
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                  <Zap className="h-3.5 w-3.5" />
                  Entrega disponível em até 2 horas
                </div>
                <button
                  onClick={handleCepWhatsApp}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
                >
                  <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
                  Solicitar caçamba agora
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-secondary border-t border-white/10">
        <div className="container px-4 py-5">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-star fill-star" />
              <span className="text-sm font-semibold text-secondary-foreground">Nota 4,8★ no Google</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-secondary-foreground">Clientes recorrentes</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-secondary-foreground">Atendimento rápido</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
