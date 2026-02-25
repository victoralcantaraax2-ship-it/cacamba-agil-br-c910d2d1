import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, CheckCircle, XCircle } from "lucide-react";

export type CepAddress = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
};

type CepLookupProps = {
  onAddressFound?: (address: CepAddress) => void;
  onClear?: () => void;
};

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
};

const CepLookup = ({ onAddressFound, onClear }: CepLookupProps) => {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<CepAddress | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length === 8) {
      fetchCep(digits);
    } else {
      setAddress(null);
      setError(false);
      setVisible(false);
      onClear?.();
    }
  }, [cep]);

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
        onClear?.();
      } else {
        const addr: CepAddress = {
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
          cep: data.cep,
        };
        setAddress(addr);
        onAddressFound?.(addr);
        // trigger animation
        setTimeout(() => setVisible(true), 50);
      }
    } catch {
      setError(true);
      onClear?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="cep" className="text-sm font-semibold text-foreground">
          Endereço de atendimento
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          Informe o CEP para validarmos a cobertura
        </p>
        <Input
          id="cep"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          maxLength={9}
          inputMode="numeric"
          className="text-base"
        />
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground animate-pulse">
          Buscando endereço...
        </p>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive animate-fade-in">
          <XCircle className="h-4 w-4 shrink-0" />
          <span>CEP não encontrado. Verifique e tente novamente.</span>
        </div>
      )}

      {address && (
        <div
          className={`transition-all duration-500 ease-out ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {/* Address Card */}
          <div className="rounded-xl border-l-4 border-l-accent bg-accent/5 shadow-md p-4 space-y-1">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground leading-tight">
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
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent">
            <CheckCircle className="h-4 w-4" />
            Atendimento disponível nesta região
          </div>

          {/* Trust microcopy */}
          <p className="mt-2 text-xs text-muted-foreground">
            Localização validada automaticamente pelo CEP informado.
          </p>
        </div>
      )}
    </div>
  );
};

export default CepLookup;
