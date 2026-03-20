import { useState } from "react";
import { MapPin, CheckCircle, XCircle, Search, Loader2, Zap } from "lucide-react";
import phoneIcon from "@/assets/phone-icon.webp";
import { Button } from "@/components/ui/button";
import { handleWhatsAppClick } from "@/lib/whatsapp";

type Address = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
};

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
};

const WHATSAPP_NUMBER = "5547999033028";

const CepSection = () => {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<Address | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 8) {
      fetchCep(digits);
    } else {
      setAddress(null);
      setError(false);
      setVisible(false);
    }
  };

  const handleVerify = () => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length === 8) fetchCep(digits);
  };

  const fetchCep = async (digits: string) => {
    setLoading(true);
    setError(false);
    setAddress(null);
    setVisible(false);

    const startTime = Date.now();
    const maxRetries = 2;
    let lastError = false;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
          signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();

        if (data.erro) {
          lastError = true;
          break;
        }

        const elapsed = Date.now() - startTime;
        const minDelay = 2000 + Math.random() * 1000;
        const remaining = Math.max(minDelay - elapsed, 0);
        await new Promise((r) => setTimeout(r, remaining));

        setAddress({
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
          cep: data.cep,
        });
        setTimeout(() => setVisible(true), 50);
        setLoading(false);
        return;
      } catch {
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 800));
          continue;
        }
        lastError = true;
      }
    }

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(2000 - elapsed, 0);
    await new Promise((r) => setTimeout(r, remaining));
    setError(lastError);
    setLoading(false);
  };

  const handleWhatsApp = () => {
    if (!address) return;
    const msg = `Olá! Tenho interesse em alugar uma caçamba. Meu CEP é ${address.cep}. Endereço: ${address.logradouro}, ${address.bairro} – ${address.localidade}/${address.uf}. Podem informar disponibilidade e valores?`;
    handleWhatsAppClick(msg);
  };

  return (
    <section className="bg-muted/40 py-8 md:py-10">
      <div className="container px-4">
        <div className="mx-auto max-w-2xl">

          <h2 className="mb-3 text-center text-lg font-extrabold text-foreground md:text-xl">
            Verifique se atendemos sua área
          </h2>

          <div className="mx-auto max-w-md">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="cep-home"
                  placeholder="Digite o seu CEP"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  maxLength={9}
                  inputMode="numeric"
                  className="flex h-11 w-full rounded-lg border-2 border-input bg-background pl-9 pr-3 text-base font-medium tracking-wider text-foreground ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 transition-colors"
                  style={{ fontSize: "16px" }}
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={cep.replace(/\D/g, "").length < 8 || loading}
                className="h-11 gap-1.5 text-sm font-bold shrink-0 px-5"
              >
                <Search className="h-4 w-4" />
                Verificar
              </Button>
            </div>
          </div>

          {loading && (
            <div className="mx-auto mt-4 max-w-md animate-fade-in text-center">
              <div className="flex items-center justify-center gap-2 py-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <span className="text-sm font-medium text-muted-foreground">
                  Checando cobertura…
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto mt-3 max-w-md animate-fade-in">
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-sm text-destructive">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>CEP não localizado. Confira e tente novamente.</span>
              </div>
            </div>
          )}

          {address && (
            <div
              className={`mx-auto mt-4 max-w-md transition-all duration-500 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm font-black uppercase tracking-wide text-accent">
                    Área atendida
                  </span>
                </div>
                <div className="pl-7 space-y-0.5">
                  {address.logradouro && (
                    <p className="text-sm font-semibold text-foreground">
                      {address.logradouro}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {address.bairro && `${address.bairro} – `}{address.localidade}/{address.uf}
                  </p>
                </div>

                <div className="mt-3 pl-7">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary animate-[glow-breathe_3s_ease-in-out_infinite]">
                    <Zap className="h-3.5 w-3.5" />
                    Chegamos em até 1 hora
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleWhatsApp}
                  size="lg"
                  className="gap-2 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp-hover text-sm font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  <img src={phoneIcon} alt="WhatsApp" className="h-5 w-5" />
                  Solicitar caçamba agora
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default CepSection;
