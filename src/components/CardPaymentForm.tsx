import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCpf, validateCpf } from "@/lib/cpf";
import { formatCardNumber, formatExpiry, detectBrand, validateLuhn } from "@/lib/card";
import CardPreview from "@/components/CardPreview";
import ThreeDSModal from "@/components/ThreeDSModal";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard } from "lucide-react";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [show3DS, setShow3DS] = useState(false);
  const [threeDSResult, setThreeDSResult] = useState<"success" | "failure" | null>(null);

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

  const handleSubmit = () => {
    if (!validate()) return;
    setShow3DS(true);
  };

  const saveTransaction = async (status: string) => {
    const digits = cardNumber.replace(/\D/g, "");
    const token = `tok_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;

    const { error } = await supabase.from("card_transactions" as any).insert({
      token,
      holder_name: holderName.trim(),
      cpf: cpf.replace(/\D/g, ""),
      card_brand: brand,
      card_last4: digits.slice(-4),
      card_expiry: expiry,
      plan_id: planId,
      plan_label: planLabel,
      quantity,
      amount: totalPrice,
      coupon: coupon || null,
      customer_name: customerName,
      customer_phone: customerPhone,
      address: address || null,
      status,
    });

    if (error) console.error("Erro ao salvar transação:", error);
  };

  const handle3DSComplete = async (approved: boolean) => {
    setShow3DS(false);
    setLoading(true);

    await saveTransaction(approved ? "pending" : "rejected");

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
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Pagamento em análise</h3>
        <p className="text-sm text-muted-foreground">
          Sua transação foi recebida e está sendo processada. Você receberá a confirmação em breve.
        </p>
        <p className="text-xs text-muted-foreground">Token: <code className="bg-muted px-1.5 py-0.5 rounded">{`tok_****`}</code></p>
      </div>
    );
  }

  if (threeDSResult === "failure") {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Pagamento não aprovado</h3>
        <p className="text-sm text-muted-foreground">
          O pagamento não foi aprovado pelo seu banco emissor. Tente novamente ou utilize o Pix.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={onSwitchToPix} className="w-full text-base font-bold" size="lg">
            Pagar com Pix
          </Button>
          <Button variant="outline" onClick={() => setThreeDSResult(null)} className="w-full">
            Tentar novamente com cartão
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CardPreview
        number={formatCardNumber(cardNumber)}
        name={holderName}
        expiry={expiry}
        brand={brand}
        cpf={formatCpf(cpf)}
      />

      <div className="space-y-3">
        <div>
          <Label htmlFor="holderName" className="text-xs">Nome do titular</Label>
          <Input
            id="holderName"
            placeholder="Nome como está no cartão"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value.toUpperCase())}
            className={`text-sm h-9 ${errors.holderName ? "border-destructive" : ""}`}
          />
          {errors.holderName && <p className="mt-0.5 text-xs text-destructive">{errors.holderName}</p>}
        </div>

        <div>
          <Label htmlFor="cpfCard" className="text-xs">CPF do titular</Label>
          <Input
            id="cpfCard"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            maxLength={14}
            inputMode="numeric"
            className={`text-sm h-9 ${errors.cpf ? "border-destructive" : ""}`}
          />
          {errors.cpf && <p className="mt-0.5 text-xs text-destructive">{errors.cpf}</p>}
        </div>

        <div>
          <Label htmlFor="cardNumber" className="text-xs">Número do cartão</Label>
          <Input
            id="cardNumber"
            placeholder="0000 0000 0000 0000"
            value={formatCardNumber(cardNumber)}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
            maxLength={19}
            inputMode="numeric"
            className={`text-sm h-9 ${errors.cardNumber ? "border-destructive" : ""}`}
          />
          {errors.cardNumber && <p className="mt-0.5 text-xs text-destructive">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="expiry" className="text-xs">Validade</Label>
            <Input
              id="expiry"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              maxLength={5}
              inputMode="numeric"
              className={`text-sm h-9 ${errors.expiry ? "border-destructive" : ""}`}
            />
            {errors.expiry && <p className="mt-0.5 text-xs text-destructive">{errors.expiry}</p>}
          </div>
          <div>
            <Label htmlFor="cvv" className="text-xs">CVV</Label>
            <Input
              id="cvv"
              placeholder="000"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
              inputMode="numeric"
              type="password"
              className={`text-sm h-9 ${errors.cvv ? "border-destructive" : ""}`}
            />
            {errors.cvv && <p className="mt-0.5 text-xs text-destructive">{errors.cvv}</p>}
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full text-base font-bold"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          `Pagar com Cartão • ${formatCurrency(totalPrice)}`
        )}
      </Button>

      <ThreeDSModal open={show3DS} onComplete={handle3DSComplete} />
    </div>
  );
};

export default CardPaymentForm;
