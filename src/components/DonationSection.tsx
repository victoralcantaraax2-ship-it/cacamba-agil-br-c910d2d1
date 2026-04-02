import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, X } from "lucide-react";
import ongDogImg from "@/assets/ong-dog.jpg";

interface DonationSectionProps {
  donationAmount: number;
  onDonationChange: (amount: number) => void;
}

const quickValues = [10, 20, 50, 100, 200];

const DonationSection = ({ donationAmount, onDonationChange }: DonationSectionProps) => {
  const [customValue, setCustomValue] = useState("");
  const [selectedQuick, setSelectedQuick] = useState<number | null>(null);
  const [error, setError] = useState("");
  const isActive = donationAmount > 0;

  const handleQuickSelect = (value: number) => {
    setSelectedQuick(value);
    setCustomValue("");
    setError("");
    onDonationChange(value);
  };

  const handleCustomChange = (raw: string) => {
    // Allow only digits and comma
    const cleaned = raw.replace(/[^\d,]/g, "");
    setCustomValue(cleaned);
    setSelectedQuick(null);
    setError("");

    const parsed = parseFloat(cleaned.replace(",", "."));
    if (isNaN(parsed) || parsed <= 0) {
      onDonationChange(0);
      return;
    }
    if (parsed > 200) {
      setError("A doação máxima permitida é de R$ 200,00");
      onDonationChange(0);
      return;
    }
    if (parsed < 1) {
      onDonationChange(0);
      return;
    }
    onDonationChange(Math.round(parsed * 100) / 100);
  };

  const handleRemove = () => {
    setSelectedQuick(null);
    setCustomValue("");
    setError("");
    onDonationChange(0);
  };

  return (
    <Card className={`overflow-hidden border-2 transition-all ${isActive ? "border-pink-400/60 shadow-md shadow-pink-500/10" : "border-border"}`}>
      <CardContent className="p-0">
        {/* Image banner */}
        <div className="relative h-36 overflow-hidden">
          <img
            src={ongDogImg}
            alt="Animal resgatado precisando de ajuda"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="bg-pink-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Doação opcional
              </span>
            </div>
            <h3 className="text-white text-base font-bold leading-tight drop-shadow-lg">
              Ajude um animal resgatado
            </h3>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Adicione uma doação opcional ao seu pedido e contribua com uma ONG parceira que ajuda animais em situação de sofrimento e abandono.
          </p>

          {/* Quick value buttons */}
          <div className="grid grid-cols-5 gap-1.5">
            {quickValues.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleQuickSelect(v)}
                className={`rounded-lg border-2 py-2 text-center transition-all text-sm font-semibold ${
                  selectedQuick === v
                    ? "border-pink-500 bg-pink-500/10 text-pink-600"
                    : "border-muted hover:border-pink-400/50 text-foreground"
                }`}
              >
                R${v}
              </button>
            ))}
          </div>

          {/* Custom value */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">R$</span>
            <Input
              placeholder="Outro valor"
              value={customValue}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="pl-9 h-9 text-sm"
              inputMode="decimal"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}

          {/* Active donation indicator */}
          {isActive && (
            <div className="flex items-center justify-between rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 px-3 py-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                <span className="text-sm font-semibold text-pink-700 dark:text-pink-300">
                  Doação: R$ {donationAmount.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                aria-label="Remover doação"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationSection;
