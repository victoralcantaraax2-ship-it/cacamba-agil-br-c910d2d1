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
  numero: string;
  complemento: string;
  referencia: string;
};

type CepLookupProps = {
  onAddressFound?: (address: CepAddress) => void;
  onClear?: () => void;
  address: CepAddress | null;
  onFieldChange?: (field: keyof CepAddress, value: string) => void;
  errors?: Partial<Record<"cep" | "numero", string>>;
};

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
};

const CepLookup = ({ onAddressFound, onClear, address, onFieldChange, errors }: CepLookupProps) => {
  const [cep, setCep] = useState(address?.cep || "");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(!!address?.logradouro);

  useEffect(() => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length === 8) {
      fetchCep(digits);
    } else {
      setError(false);
      setVisible(false);
      onClear?.();
    }
  }, [cep]);

  const fetchCep = async (digits: string) => {
    setLoading(true);
    setError(false);
    setVisible(false);
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
          signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();
        if (data.erro) {
          setError(true);
          onClear?.();
          setLoading(false);
          return;
        }
        const addr: CepAddress = {
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
          cep: data.cep,
          numero: address?.numero || "",
          complemento: address?.complemento || "",
          referencia: address?.referencia || "",
        };
        onAddressFound?.(addr);
        setTimeout(() => setVisible(true), 50);
        setLoading(false);
        return;
      } catch {
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 800));
          continue;
        }
        setError(true);
        onClear?.();
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="cep" className="text-sm font-semibold text-foreground">
          CEP <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cep"
          placeholder="Informe o seu CEP"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          maxLength={9}
          inputMode="numeric"
          className={`text-base ${errors?.cep ? "border-destructive" : ""}`}
        />
        {errors?.cep && <p className="mt-1 text-sm text-destructive">{errors.cep}</p>}
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

      {address && address.logradouro && (
        <div
          className={`transition-all duration-500 ease-out space-y-3 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
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
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent">
            <CheckCircle className="h-4 w-4" />
            Atendimento disponível nesta região
          </div>

          {/* Número + Complemento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="numero" className="text-sm font-semibold text-foreground">
                Número <span className="text-destructive">*</span>
              </Label>
              <Input
                id="numero"
                placeholder="Nº"
                value={address.numero}
                onChange={(e) => onFieldChange?.("numero", e.target.value)}
                className={`text-base ${errors?.numero ? "border-destructive" : ""}`}
              />
              {errors?.numero && <p className="mt-1 text-sm text-destructive">{errors.numero}</p>}
            </div>
            <div>
              <Label htmlFor="complemento" className="text-sm text-foreground">
                Complemento
              </Label>
              <Input
                id="complemento"
                placeholder="Apto, Bloco..."
                value={address.complemento}
                onChange={(e) => onFieldChange?.("complemento", e.target.value)}
                className="text-base"
              />
            </div>
          </div>

          {/* Ponto de referência */}
          <div>
            <Label htmlFor="referencia" className="text-sm text-foreground">
              Ponto de referência
            </Label>
            <Input
              id="referencia"
              placeholder="Próximo ao..."
              value={address.referencia}
              onChange={(e) => onFieldChange?.("referencia", e.target.value)}
              className="text-base"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CepLookup;
