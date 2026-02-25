import { useState } from "react";
import { MapPin, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
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

const WHATSAPP_NUMBER = "5511969795930";

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

  const fetchCep = async (digits: string) => {
    setLoading(true);
    setError(false);
    setAddress(null);
    setVisible(false);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
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
    <section className="bg-background py-12 md:py-16">
      <div className="container max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black text-foreground sm:text-3xl">
            Atendemos na sua região
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Digite seu CEP para verificar disponibilidade e confirmar o endereço de entrega da caçamba.
          </p>
        </div>

        {/* CEP Input */}
        <div className="mx-auto max-w-sm">
          <label htmlFor="cep-home" className="mb-1.5 block text-sm font-semibold text-foreground">
            CEP
          </label>
          <Input
            id="cep-home"
            placeholder="Digite seu CEP"
            value={cep}
            onChange={(e) => handleCepChange(e.target.value)}
            maxLength={9}
            inputMode="numeric"
            className="text-center text-lg font-medium tracking-wider"
          />
        </div>

        {/* Loading */}
        {loading && (
          <p className="mt-4 text-center text-sm text-muted-foreground animate-pulse">
            Carregando endereço…
          </p>
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
    </section>
  );
};

export default CepSection;
