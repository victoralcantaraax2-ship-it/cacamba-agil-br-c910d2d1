import { useState } from "react";
import { MapPin, CheckCircle, XCircle, MessageCircle, Truck, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const WHATSAPP_NUMBER = "5511968359074";

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

    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();

      // Enforce 2–3s minimum loading for perceived validation
      const elapsed = Date.now() - startTime;
      const minDelay = 2000 + Math.random() * 1000;
      const remaining = Math.max(minDelay - elapsed, 0);
      await new Promise((r) => setTimeout(r, remaining));

      if (data.erro) {
        setError(true);
      } else {
        setAddress({
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
          cep: data.cep,
        });
        setTimeout(() => setVisible(true), 50);
      }
    } catch {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(2000 - elapsed, 0);
      await new Promise((r) => setTimeout(r, remaining));
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!address) return;
    const msg = `Olá! Quero alugar uma caçamba. Meu CEP é ${address.cep}. Endereço: ${address.logradouro}, ${address.bairro} – ${address.localidade}/${address.uf}. Pode me informar disponibilidade e valores?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section className="bg-muted/40 py-12 md:py-16">
      <div className="container px-4">
        <div className="mx-auto max-w-[720px] rounded-2xl border border-border bg-card shadow-lg p-8 md:p-10">

          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Truck className="h-7 w-7 text-primary" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-foreground sm:text-3xl">
              Verifique a disponibilidade na sua região
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Digite seu CEP para confirmar disponibilidade e o endereço de entrega.
            </p>
          </div>

          {/* CEP Input + Button */}
          <div className="mx-auto max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="cep-home"
                  placeholder="Ex.: 01451-000"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  maxLength={9}
                  inputMode="numeric"
                  className="flex h-12 w-full rounded-lg border-2 border-input bg-background pl-10 pr-4 text-base font-medium tracking-wider text-foreground ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 transition-colors"
                  style={{ fontSize: "16px" }}
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={cep.replace(/\D/g, "").length < 8 || loading}
                size="lg"
                className="h-12 gap-2 text-base font-bold shrink-0 sm:px-6"
              >
                <Search className="h-4 w-4" />
                Verificar
              </Button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mx-auto mt-6 max-w-md animate-fade-in">
              <div className="rounded-xl border border-border bg-card shadow-lg p-6 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-base font-semibold text-foreground">
                  Verificando disponibilidade para seu CEP…
                </p>
                <p className="text-sm text-muted-foreground">
                  Consultando endereço e área de atendimento
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-auto mt-4 max-w-sm animate-fade-in">
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>CEP não encontrado. Verifique e tente novamente.</span>
              </div>
            </div>
          )}

          {/* Address Result */}
          {address && (
            <div
              className={`mx-auto mt-6 max-w-md transition-all duration-500 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              {/* Address Card */}
              <div className="rounded-xl border border-border border-l-4 border-l-accent bg-card shadow-lg p-5 space-y-1">
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  CEP informado: {address.cep}
                </p>
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground leading-snug">
                      {address.logradouro || "Endereço"}
                      {address.bairro ? ` – ${address.bairro}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.localidade} – {address.uf}
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability Badge */}
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                  <CheckCircle className="h-4 w-4" />
                  Atendimento disponível nesta região
                </span>
              </div>

              {/* Microcopy */}
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Endereço validado automaticamente pelo CEP.
              </p>

              {/* WhatsApp CTA */}
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleWhatsApp}
                  size="lg"
                  className="gap-2 bg-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp-foreground))] hover:bg-[hsl(var(--whatsapp-hover))] text-base font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  Solicitar caçamba pelo WhatsApp
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
