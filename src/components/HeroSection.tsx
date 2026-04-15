import { useState } from "react";
import { ShieldCheck, Clock, CheckCircle, XCircle, MapPin, Search, Loader2, Zap, Star, Users, Phone } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import heroBg from "@/assets/hero-bg.webp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";
import logoAmba from "@/assets/logo-nortex.png";

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
  const h1Text = cityName
    ? `Locação de Caçamba em ${cityName} — Rápida, Segura e sem Burocracia`
    : "LOCAÇÃO DE CAÇAMBA EM SÃO PAULO";
  const subtitle = cityName
    ? `Entrega em até 2h em ${cityName}. Caçambas para obras, reformas, entulhos e demolições. Solicite agora pelo WhatsApp.`
    : "Entrega em até 2h. Caçambas para obras, reformas, entulhos e demolições. Solicite agora pelo WhatsApp.";

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
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      if (data.erro) { setCepError(true); } else {
        setAddress({ logradouro: data.logradouro, bairro: data.bairro, localidade: data.localidade, uf: data.uf, cep: data.cep });
        setTimeout(() => setCepVisible(true), 30);
      }
    } catch { setCepError(true); }
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
          <div className="absolute inset-0 bg-black/85" />
        </div>

        <div className="container relative z-10 px-4 py-16 text-center md:py-24">
          <img
            src={logoAmba}
            alt="NORTEX Caçambas"
            className="mx-auto mb-6 h-24 w-auto md:h-32 lg:h-36"
            width={320}
            height={160}
            loading="eager"
            fetchPriority="high"
          />

          <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {h1Text}
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base text-white/70 md:text-lg">
            {subtitle}
          </p>


          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() => handleWhatsAppClick()}
              className="inline-flex items-center gap-3 rounded-xl bg-whatsapp px-8 py-4 text-lg font-extrabold uppercase text-white shadow-2xl transition-all hover:scale-105 hover:bg-whatsapp-hover md:px-12 md:py-5 md:text-xl animate-pulse-green"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="h-6 w-6" width={24} height={24} />
              SOLICITAR PELO WHATSAPP
            </button>
            <button
              onClick={() => scrollTo("#tamanhos")}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-white/20 md:px-8 md:py-5 md:text-lg"
            >
              Ver Tamanhos e Preços
            </button>
          </div>

          {/* CEP inline */}
          <div className="mx-auto mt-10 max-w-md">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white/50">
              <MapPin className="mr-1 inline h-4 w-4 text-primary" />
              Verifique a cobertura na sua região
            </p>
            <div className="flex gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur-sm border border-white/10">
              <div className="relative flex-1">
                <input
                  placeholder="Informe seu CEP"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  maxLength={9}
                  inputMode="numeric"
                  className="h-12 w-full rounded-xl bg-white pl-4 pr-3 text-base font-semibold tracking-wider text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  style={{ fontSize: "16px" }}
                />
              </div>
              <button
                onClick={() => { const d = cep.replace(/\D/g, ""); if (d.length === 8) fetchCep(d); }}
                disabled={cep.replace(/\D/g, "").length < 8 || cepLoading}
                className="flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50 shrink-0"
              >
                {cepLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Consultar
              </button>
            </div>

            {cepError && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-red-400 animate-fade-in">
                <XCircle className="h-4 w-4" />
                CEP não localizado. Verifique e tente novamente.
              </div>
            )}

            {address && (
              <div className={`mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4 backdrop-blur-sm transition-all duration-500 ${cepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
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
              <span className="text-sm font-semibold text-secondary-foreground">Avaliação 4,8★ no Google</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-secondary-foreground">+5.000 coletas realizadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-secondary-foreground">Atendimento imediato</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
