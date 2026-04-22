import { useState, useEffect, useMemo } from "react";
import { firePixCopyConversion } from "@/lib/gtagConversion";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle, Copy, ArrowLeft, Plus, Minus, Loader2, MapPin, XCircle, CreditCard, CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { QRCodeSVG } from "qrcode.react";
import { getSafeQrValue } from "@/lib/qrPix";
import { formatPhone, validatePhone } from "@/lib/phone";
import { captureUtms, type UtmData } from "@/lib/utm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import CardPaymentForm from "@/components/CardPaymentForm";
import DonationSection from "@/components/DonationSection";
import logoAmba from "@/assets/logo-nortex.png";
import lockIcon from "@/assets/lock-icon.webp";
import cacambaImg from "@/assets/cacamba-generica.webp";
import pixLogo from "@/assets/pix-logo.webp";
import mercadopagoLogo from "@/assets/mercadopago-logo.webp";

type Plan = {
  id: string;
  label: string;
  price: number;
};

const plans: Plan[] = [
  { id: "cacamba_3m", label: "Caçamba 3m³", price: 230.00 },
  { id: "cacamba_4m", label: "Caçamba 4m³", price: 300.00 },
  { id: "cacamba_5m", label: "Caçamba 5m³", price: 360.00 },
  { id: "cacamba_7m", label: "Caçamba 7m³", price: 460.00 },
  { id: "cacamba_10m", label: "Caçamba 10m³", price: 620.00 },
];

type FormData = {
  nome: string;
  telefone: string;
};

type AddressData = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
  complemento: string;
};

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
};

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState<FormData>({ nome: "", telefone: "" });
  const [address, setAddress] = useState<AddressData>({
    cep: "", logradouro: "", bairro: "", localidade: "", uf: "", numero: "", complemento: "",
  });
  const [cepFound, setCepFound] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [utms, setUtms] = useState<Partial<UtmData>>({});
  const [pixCode, setPixCode] = useState("");
  const [pixQr, setPixQr] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "generated" | "confirmed">("idle");

  // Second charge (taxa)
  const [taxaPixCode, setTaxaPixCode] = useState("");
  const [taxaPixQr, setTaxaPixQr] = useState("");
  const [taxaTransactionId, setTaxaTransactionId] = useState("");
  const [taxaStatus, setTaxaStatus] = useState<"idle" | "loading" | "generated" | "confirmed">("idle");
  const [taxaCopyToast, setTaxaCopyToast] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao">("pix");
  const [donationAmount, setDonationAmount] = useState(0);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledSlot, setScheduledSlot] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const allTimeSlots = ["08h–10h", "10h–12h", "13h–15h", "15h–17h", "17h–19h", "19h–21h"];
  const defaultSlots = ["08h–10h", "10h–12h", "13h–15h", "15h–17h"];
  const minDate = startOfDay(new Date());
  const maxDate = addDays(startOfDay(new Date()), 30);

  const isToday = (d?: Date) => !!d && startOfDay(d).getTime() === startOfDay(new Date()).getTime();
  const availableSlots = (() => {
    if (!scheduledDate) return defaultSlots;
    if (!isToday(scheduledDate)) return defaultSlots;
    // For today, only show slots whose end-hour is still in the future, capped at 21h
    const currentHour = new Date().getHours();
    return allTimeSlots.filter((slot) => {
      const endHour = parseInt(slot.split("–")[1], 10); // "10h" -> 10
      return endHour <= 21 && currentHour < endHour;
    });
  })();
  
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try { return localStorage.getItem("amba_coupon"); } catch { return null; }
  });
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setUtms(captureUtms());
  }, []);

  // Poll Nitro for first PIX payment confirmation
  useEffect(() => {
    if (paymentStatus !== "generated" || !transactionId) return;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/verificar-pix`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: supabaseKey },
          body: JSON.stringify({ transaction_id: transactionId }),
        });
        const data = await res.json();
        if (!cancelled && data.status === "paid") {
          setPaymentStatus("confirmed");
          toast({ title: "Pagamento confirmado!", description: "Seu PIX foi aprovado com sucesso." });
        }
      } catch (err) {
        console.error("Erro ao verificar status PIX:", err);
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    const timeout = setTimeout(() => { cancelled = true; clearInterval(interval); }, 15 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); clearTimeout(timeout); };
  }, [paymentStatus, transactionId, toast]);

  // Taxa entrega/retirada varia por tamanho (robin R$70-95)
  const taxaEntregaMap: Record<string, number> = {
    cacamba_3m: 70, cacamba_4m: 75, cacamba_5m: 80, cacamba_7m: 85, cacamba_10m: 95,
  };
  const taxaEntrega = taxaEntregaMap[selectedPlan] || 80;
  const taxaPrioritaria = 30;
  const taxaTotal = taxaEntrega + taxaPrioritaria;

  // When first payment confirmed → redirect to /logistica
  useEffect(() => {
    if (paymentStatus !== "confirmed" || taxaStatus !== "idle") return;
    setTaxaStatus("loading"); // prevent re-trigger
    const tel = form.telefone.replace(/\D/g, "");
    navigate(`/logistica?nome=${encodeURIComponent(form.nome)}&telefone=${encodeURIComponent(tel)}&plano=${encodeURIComponent(selectedPlan)}&auto=1`);
  }, [paymentStatus, taxaStatus, form.nome, form.telefone, selectedPlan, navigate]);

  const totalSteps = 3;
  const progressValue = (step / totalSteps) * 100;

  const goToStep = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentPlan = plans.find((p) => p.id === selectedPlan);
  const subtotal = currentPlan ? currentPlan.price * quantity : 0;
  const validCoupons: Record<string, number> = { AMBA10: 0.10, AMBA15: 0.15, AMBA20: 0.20, AMBA25: 0.25 };
  const discountRate = appliedCoupon ? (validCoupons[appliedCoupon] || 0) : 0;
  const discountAmount = Math.round(subtotal * discountRate * 100) / 100;
  const cacambaFinal = Math.round((subtotal - discountAmount) * 100) / 100;
  const totalPrice = Math.round((cacambaFinal + donationAmount) * 100) / 100;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const isQrImage = (value: string) => /^https?:\/\//i.test(value) || /^data:image\//i.test(value);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const coupons: Record<string, { rate: number; label: string }> = {
      AMBA10: { rate: 0.10, label: "10% OFF" },
      AMBA15: { rate: 0.15, label: "15% OFF" },
      AMBA20: { rate: 0.20, label: "20% OFF" },
      AMBA25: { rate: 0.25, label: "25% OFF" },
    };
    if (coupons[code]) {
      setAppliedCoupon(code);
      setCouponMsg({ type: "success", text: `Cupom ${code} aplicado: ${coupons[code].label}` });
      try { localStorage.setItem("amba_coupon", code); } catch {}
    } else {
      setCouponMsg({ type: "error", text: "Cupom inválido" });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMsg(null);
    try { localStorage.removeItem("amba_coupon"); } catch {}
  };

  // --- CEP lookup ---
  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setAddress((prev) => ({ ...prev, cep: formatted }));
    setCepError(false);

    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 8) {
      fetchCep(digits);
    } else {
      setCepFound(false);
      setAddress((prev) => ({ ...prev, logradouro: "", bairro: "", localidade: "", uf: "" }));
    }
  };

  const fetchCep = async (digits: string) => {
    setCepLoading(true);
    setCepError(false);
    setCepFound(false);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError(true);
      } else {
        setAddress((prev) => ({
          ...prev,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          localidade: data.localidade || "",
          uf: data.uf || "",
        }));
        setCepFound(true);
      }
    } catch {
      setCepError(true);
    } finally {
      setCepLoading(false);
    }
  };

  // --- Validations ---
  const validateStep1 = () => {
    if (!selectedPlan) {
      setErrors({ plan: "Selecione um tamanho de caçamba" });
      return;
    }
    setErrors({});
    goToStep(2);
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim() || form.nome.trim().length < 3) e.nome = "Informe seu nome completo";
    if (!validatePhone(form.telefone)) e.telefone = "Informe um telefone válido";
    setErrors(e);
    if (Object.keys(e).length === 0) {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "InitiateCheckout");
      }
      goToStep(3);
    }
  };

  const validateAddress = (): boolean => {
    const e: Record<string, string> = {};
    if (!cepFound) e.cep = "Informe um CEP válido";
    if (!address.numero.trim()) e.numero = "Informe o número";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGeneratePix = async () => {
    if (!validateAddress()) return;

    setPaymentStatus("loading");

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const res = await fetch(`${supabaseUrl}/functions/v1/criar-pix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          nome: form.nome,
          telefone: form.telefone,
          plano: selectedPlan,
          quantidade: quantity,
          cupom: appliedCoupon || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar PIX");
      }

      const rawPixCode = String(data.pix_code ?? "").trim();
      const rawQrCode = String(data.qr_code ?? "").trim();
      const qrLooksLikeImage = isQrImage(rawQrCode);
      const finalPixCode = rawPixCode || (!qrLooksLikeImage ? rawQrCode : "");
      const finalQrCode = rawQrCode || finalPixCode;

      if (!finalPixCode && !finalQrCode) {
        throw new Error("PIX retornou sem código válido");
      }

      setPixCode(finalPixCode);
      setPixQr(finalQrCode);
      setTransactionId(data.transaction_id || "");
      setPaymentStatus("generated");

      // Save PIX lead
      const plan = plans.find((p) => p.id === selectedPlan);
      const fullAddress = `${address.logradouro}, ${address.numero}${address.complemento ? ` - ${address.complemento}` : ""}, ${address.bairro}, ${address.localidade}/${address.uf} - CEP ${address.cep}`;
      supabase.from("pix_leads" as any).insert({
        customer_name: form.nome,
        customer_phone: form.telefone.replace(/\D/g, ""),
        address: fullAddress,
        plan_id: selectedPlan,
        plan_label: plan?.label || selectedPlan,
        amount: (plan?.price || 0) * quantity,
        transaction_id: data.transaction_id || null,
        source: "checkout",
      }).then(() => {});
    } catch (err) {
      console.error("Erro ao gerar PIX:", err);
      setPaymentStatus("idle");
      toast({
        variant: "destructive",
        title: "Erro ao gerar PIX",
        description: "Não foi possível gerar o PIX no momento. Tente novamente em alguns segundos.",
      });
    }
  };


  const [copyToastVisible, setCopyToastVisible] = useState(false);


  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = pixCode;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopyToastVisible(true);
    setTimeout(() => setCopyToastVisible(false), 5000);
    firePixCopyConversion();
  };

  const handleCopyTaxaPix = async () => {
    try {
      await navigator.clipboard.writeText(taxaPixCode);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = taxaPixCode;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setTaxaCopyToast(true);
    setTimeout(() => setTaxaCopyToast(false), 5000);
    firePixCopyConversion();
  };

  const fullAddress = `${address.logradouro}${address.numero ? `, ${address.numero}` : ""}${address.complemento ? ` – ${address.complemento}` : ""}${address.bairro ? ` – ${address.bairro}` : ""}, ${address.localidade}/${address.uf}`;
  const qrDisplayValue = pixQr || pixCode;
  const qrIsImage = isQrImage(qrDisplayValue);
  const taxaQrDisplay = taxaPixQr || taxaPixCode;
  const taxaQrIsImage = isQrImage(taxaQrDisplay);

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary via-background to-background relative">
      {/* Toast flutuante de cópia */}
      {copyToastVisible && (
        <div
          role="status"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 rounded-xl bg-green-600 px-5 py-3 shadow-lg shadow-green-900/20 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20">
            <CheckCircle className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-semibold text-white whitespace-nowrap">Código copiado com sucesso</span>
        </div>
      )}
      {taxaCopyToast && (
        <div
          role="status"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 rounded-xl bg-green-600 px-5 py-3 shadow-lg shadow-green-900/20 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20">
            <CheckCircle className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-semibold text-white whitespace-nowrap">Código da taxa copiado</span>
        </div>
      )}

      {/* Header Premium */}
      <div className="bg-secondary py-5 shadow-md">
        <div className="container flex flex-col items-center px-4">
          <img src={logoAmba} alt="NORTEX Caçambas" className="h-14 w-auto md:h-18 drop-shadow-lg" fetchPriority="high" decoding="async" />
        </div>
      </div>

      {/* Progress Premium */}
      <div className="container max-w-lg px-4 sm:px-6 pt-5 sm:pt-6">
        <div className="mb-3 flex justify-between">
          {[
            { n: 1, label: "Caçamba" },
            { n: 2, label: "Identificação" },
            { n: 3, label: "Pagamento" },
          ].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-1.5">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step >= n
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}>
                {step > n ? "✓" : n}
              </span>
              <span className={`text-xs font-medium transition-colors ${
                step >= n ? "text-primary" : "text-muted-foreground"
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <Progress value={progressValue} className="h-1.5 sm:h-1.5" />
      </div>

      <div className="container max-w-lg px-4 sm:px-6 py-6 sm:py-8">

        {/* ========== STEP 1 — CAÇAMBA ========== */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">Escolha sua caçamba</h2>
            {errors.plan && <p className="text-sm text-destructive">{errors.plan}</p>}

            <div className="space-y-2.5">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "ring-2 ring-primary border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "hover:border-primary/40 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img src={cacambaImg} alt={plan.label} className="h-10 w-14 sm:h-12 sm:w-16 object-contain shrink-0" fetchPriority="high" decoding="async" />
                          <div className="min-w-0">
                            <p className="text-sm sm:text-base font-bold text-foreground">{plan.label}</p>
                            <p className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatCurrency(plan.price)} / unidade
                            </p>
                          </div>
                        </div>
                        {isSelected ? (
                          <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                        )}
                      </div>
                      {isSelected && (
                        <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border/50">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuantity((q) => Math.max(1, q - 1));
                            }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-lg font-bold text-foreground">
                            {quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuantity((q) => Math.min(10, q + 1));
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedPlan && (
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 text-center shadow-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total estimado</p>
                <p className="text-3xl font-extrabold text-primary mt-1">{formatCurrency(totalPrice)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {quantity}x {currentPlan?.label}
                </p>
              </div>
            )}

            <Button onClick={validateStep1} className="w-full text-base font-bold h-13 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all" size="lg">
              Continuar
            </Button>
          </div>
        )}

        {/* ========== STEP 2 — IDENTIFICAÇÃO ========== */}
        {step === 2 && (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-300 shadow-lg border-border/50">
            <CardContent className="pt-6 pb-6">
              <button onClick={() => goToStep(1)} className="mb-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Voltar
              </button>
              <h2 className="mb-1 text-xl font-extrabold text-foreground tracking-tight">Identificação</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Precisamos apenas dessas informações para confirmar a entrega.
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className={errors.nome ? "border-destructive" : ""}
                  />
                  {errors.nome && <p className="mt-1 text-sm text-destructive">{errors.nome}</p>}
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 9XXXX-XXXX"
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: formatPhone(e.target.value) })}
                    maxLength={15}
                    inputMode="tel"
                    className={errors.telefone ? "border-destructive" : ""}
                  />
                  {errors.telefone && <p className="mt-1 text-sm text-destructive">{errors.telefone}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Usaremos seu WhatsApp apenas para confirmar a entrega da caçamba.
                  </p>
                </div>

                <Button onClick={validateStep2} className="w-full text-base font-bold rounded-xl shadow-md shadow-primary/20" size="lg">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========== STEP 3 — PAGAMENTO ========== */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
            <button onClick={() => goToStep(2)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar
            </button>

            {/* --- Endereço de entrega --- */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-5 pb-5">
                <h2 className="text-base font-extrabold text-foreground leading-tight">Onde vamos entregar a caçamba</h2>
                <p className="mb-3 text-xs text-muted-foreground">
                  Endereço usado exclusivamente para a entrega da caçamba.
                </p>

                <div className="space-y-2">
                  <div>
                    <Label htmlFor="cep" className="text-xs">CEP <span className="text-destructive">*</span></Label>
                    <Input
                      id="cep"
                      placeholder="Informe o seu CEP"
                      value={address.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      maxLength={9}
                      inputMode="numeric"
                      className={`text-sm h-9 ${errors.cep ? "border-destructive" : ""}`}
                    />
                    {errors.cep && <p className="mt-0.5 text-xs text-destructive">{errors.cep}</p>}
                  </div>

                  {cepLoading && (
                    <p className="text-xs text-muted-foreground animate-pulse">Buscando endereço...</p>
                  )}

                  {cepError && (
                    <div className="flex items-center gap-2 rounded border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>CEP não encontrado. Verifique e tente novamente.</span>
                    </div>
                  )}

                  {cepFound && (
                    <div className="animate-fade-in space-y-2">
                      <div className="rounded-lg border-l-3 border-l-accent bg-accent/5 px-3 py-2 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground text-xs leading-tight">
                            {address.logradouro || "Endereço"}{address.bairro ? ` – ${address.bairro}` : ""}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{address.localidade} – {address.uf}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="numero" className="text-xs">Número <span className="text-destructive">*</span></Label>
                          <Input
                            id="numero"
                            placeholder="Nº"
                            value={address.numero}
                            onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                            className={`h-9 text-sm ${errors.numero ? "border-destructive" : ""}`}
                          />
                          {errors.numero && <p className="mt-0.5 text-xs text-destructive">{errors.numero}</p>}
                        </div>
                        <div>
                          <Label htmlFor="complemento" className="text-xs">Complemento</Label>
                          <Input
                            id="complemento"
                            placeholder="Apto, bloco, referência (opcional)"
                            value={address.complemento}
                            onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Agendamento */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">
                    Agendar entrega
                  </h3>
                  <Switch checked={!!scheduledDate} onCheckedChange={(on) => {
                    if (!on) { setScheduledDate(undefined); setScheduledSlot(""); }
                    else { setScheduledDate(startOfDay(new Date())); setScheduledSlot(""); }
                  }} />
                </div>

                {scheduledDate && (
                  <div className="mt-3 space-y-3">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal text-sm", !scheduledDate && "text-muted-foreground")}>
                          {format(scheduledDate, "dd/MM/yyyy", { locale: ptBR })}
                          {isToday(scheduledDate) && <span className="ml-2 text-xs text-primary font-semibold">(Hoje)</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={(d) => { setScheduledDate(d); setScheduledSlot(""); setCalendarOpen(false); }}
                          disabled={(date) => isBefore(date, minDate) || date > maxDate || date.getDay() === 0}
                          initialFocus
                          locale={ptBR}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>

                    {availableSlots.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        Sem horários disponíveis hoje. Selecione outra data.
                      </p>
                    ) : (
                      <div className={cn("grid gap-1.5", availableSlots.length > 4 ? "grid-cols-3" : "grid-cols-4")}>
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setScheduledSlot(slot)}
                            className={cn(
                              "rounded-lg border px-1.5 py-2 text-xs font-medium transition-all",
                              scheduledSlot === slot
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/40"
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* --- Doação ONG (oculto temporariamente) ---
            <DonationSection
              donationAmount={donationAmount}
              onDonationChange={setDonationAmount}
            />
            */}

            {/* --- Cupom de desconto --- */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-4 pb-4">
                <h2 className="text-base font-bold text-foreground leading-tight mb-3">Cupom de desconto</h2>
                {!appliedCoupon ? (
                  <>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite seu cupom"
                        value={couponInput}
                        maxLength={20}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
                          setCouponInput(val);
                          if (!val) {
                            setCouponMsg(null);
                          } else if (validCoupons[val]) {
                            setCouponMsg({ type: "success", text: `Cupom válido: ${Math.round(validCoupons[val] * 100)}% OFF` });
                          } else {
                            setCouponMsg({ type: "error", text: "Cupom inválido" });
                          }
                        }}
                        className={`h-9 text-sm ${couponInput && couponMsg?.type === "error" ? "border-destructive focus-visible:ring-destructive/30" : ""} ${couponInput && couponMsg?.type === "success" ? "border-accent focus-visible:ring-accent/30" : ""}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 shrink-0"
                        onClick={handleApplyCoupon}
                        disabled={!couponInput || couponMsg?.type === "error"}
                      >
                        Aplicar
                      </Button>
                    </div>
                    {couponInput && couponMsg && (
                      <p className={`mt-2 text-xs font-medium ${couponMsg.type === "error" ? "text-destructive" : "text-accent"}`}>
                        {couponMsg.text}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">Cupom {appliedCoupon} aplicado: {Math.round(discountRate * 100)}% OFF</span>
                    <button onClick={handleRemoveCoupon} className="text-xs text-destructive hover:underline">
                      Remover
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* --- Resumo do Pedido --- */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-5 pb-5">
                <h2 className="mb-4 text-base font-extrabold text-foreground tracking-tight">Resumo do pedido</h2>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Serviço</span>
                    <span className="font-semibold text-foreground">{currentPlan?.label}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Quantidade</span>
                    <span className="font-semibold text-foreground">{quantity}</span>
                  </div>
                  <hr className="border-border/50" />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nome</span>
                    <span className="font-medium text-foreground text-xs text-right max-w-[60%] truncate">{form.nome}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Telefone</span>
                    <span className="font-medium text-foreground">{form.telefone}</span>
                  </div>
                  {cepFound && (
                    <>
                      <hr className="border-border/50" />
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-muted-foreground shrink-0">Entrega</span>
                        <span className="font-medium text-foreground text-xs text-right">{fullAddress}</span>
                      </div>
                    </>
                  )}
                  <hr className="border-border/50" />
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Caçamba</span>
                      <span className="font-semibold">{formatCurrency(subtotal)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-accent">
                        <span>Desconto ({appliedCoupon})</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    {donationAmount > 0 && (
                      <div className="flex justify-between text-pink-600 dark:text-pink-400">
                        <span>Doação para ONG</span>
                        <span>+{formatCurrency(donationAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-lg font-extrabold text-primary pt-2 border-t border-primary/20 mt-2">
                      <span>Total a pagar</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* --- Seleção de método de pagamento --- */}
            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-5 pb-5">
                <h2 className="text-base font-extrabold text-foreground mb-3 tracking-tight">Forma de pagamento</h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setPaymentMethod("pix")}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 p-3.5 transition-all ${
                      paymentMethod === "pix" ? "border-primary bg-primary/5 shadow-sm shadow-primary/10" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <img src={pixLogo} alt="Pix" className="h-5 w-5 object-contain" />
                    <span className="text-sm font-bold text-foreground">Pix</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("cartao")}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 p-3.5 transition-all ${
                      paymentMethod === "cartao" ? "border-primary bg-primary/5 shadow-sm shadow-primary/10" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-foreground" />
                    <span className="text-sm font-bold text-foreground">Cartão</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* --- Pagamento com Cartão --- */}
            {paymentMethod === "cartao" && (
              <Card className="shadow-sm border-border/50">
                <CardContent className="pt-5 pb-5">
                  <CardPaymentForm
                    totalPrice={totalPrice}
                    formatCurrency={formatCurrency}
                    customerName={form.nome}
                    customerPhone={form.telefone}
                    planId={selectedPlan}
                    planLabel={currentPlan?.label || ""}
                    quantity={quantity}
                    coupon={appliedCoupon}
                    address={cepFound ? fullAddress : ""}
                    onSuccess={() => navigate("/obrigado")}
                    onFailure={() => {}}
                    onSwitchToPix={() => setPaymentMethod("pix")}
                  />
                </CardContent>
              </Card>
            )}

            {/* --- Pagamento PIX --- */}
            {paymentMethod === "pix" && (
            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-5 pb-5">
                <div className="flex flex-col items-center gap-1.5 mb-5">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <img src={pixLogo} alt="Pix" className="h-6 w-6 object-contain" />
                  </div>
                  <span className="text-sm font-extrabold text-foreground tracking-tight">Pagamento via Pix</span>
                  <span className="text-[10px] text-muted-foreground">Aprovação instantânea • Sem taxas</span>
                </div>

                {paymentStatus === "idle" && (
                  <Button onClick={handleGeneratePix} className="w-full text-base font-bold rounded-xl shadow-md shadow-primary/20 h-13" size="lg">
                    Pagar com Pix • {formatCurrency(totalPrice)}
                  </Button>
                )}

                {paymentStatus === "loading" && (
                  <Button disabled className="w-full text-base font-bold" size="lg">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando PIX...
                  </Button>
                )}

                {(paymentStatus === "generated" || paymentStatus === "confirmed") && (
                  <div className="animate-in fade-in duration-500 space-y-3">
                    <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-4">
                      <div className="w-[200px] md:w-[220px] aspect-square flex items-center justify-center rounded-lg bg-white p-3">
                        {qrDisplayValue ? (
                          qrIsImage ? (
                            <img
                              src={qrDisplayValue}
                              alt="QR Code Pix para pagamento"
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <QRCodeSVG value={getSafeQrValue(qrDisplayValue, pixCode)} className="w-full h-full" />
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground text-center px-4">QR Code será exibido após geração</span>
                        )}
                      </div>

                      {pixCode && (
                        <div className="w-full">
                          <button
                            type="button"
                            onClick={handleCopyPix}
                            aria-label="Copiar código Pix"
                            className="w-full flex items-center gap-2 rounded-md border border-input bg-muted/50 px-3 py-2.5 text-left cursor-pointer hover:bg-muted transition-colors group"
                          >
                            <span className="flex-1 text-[10px] text-foreground break-all leading-relaxed select-all">{pixCode}</span>
                            <Copy className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                          </button>
                        </div>
                      )}

                      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-3">
                        <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                          Como pagar com Pix
                        </h4>
                        <div className="space-y-3">
                          <div className="flex gap-3 items-start">
                            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">1</span>
                            <p className="text-xs text-muted-foreground">Copie o código que foi gerado</p>
                          </div>
                          <div className="flex gap-3 items-start">
                            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">2</span>
                            <p className="text-xs text-muted-foreground">Abra um aplicativo em que você tenha o Pix habilitado e use a opção <strong className="text-foreground">Pix Copia e Cola</strong></p>
                          </div>
                          <div className="flex gap-3 items-start">
                            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">3</span>
                            <p className="text-xs text-muted-foreground">Cole o código, confirme o valor e faça o pagamento. Ele será confirmado na hora :)</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-muted-foreground text-center inline-flex items-center justify-center gap-1">
                        <img src={lockIcon} alt="Cadeado" className="h-3 w-3 inline-block" />
                        Pagamento seguro via
                        <img src={mercadopagoLogo} alt="Mercado Pago" className="h-3.5 inline-block" />
                      </p>
                    </div>

                    {paymentStatus === "generated" && (
                      <div className="flex items-center justify-center gap-2 py-2">
                        <div className="relative flex h-5 w-5 items-center justify-center">
                          <div className="absolute h-5 w-5 rounded-full border-2 border-primary/20" />
                          <div className="absolute h-5 w-5 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground animate-pulse">Aguardando confirmação do pagamento…</span>
                      </div>
                    )}

                    {paymentStatus === "confirmed" && (
                      <div className="flex items-center justify-center gap-2 py-3">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <span className="text-sm font-bold text-accent">Pagamento confirmado!</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="mt-3 text-center text-[10px] text-muted-foreground">
                  Atendimento iniciado após confirmação automática do pagamento.
                </p>
              </CardContent>
            </Card>
            )}

            {/* === SEGUNDA COBRANÇA: TAXA === */}
            {paymentStatus === "confirmed" && taxaStatus !== "idle" && paymentMethod === "pix" && (
              <Card className="border-primary/30 mt-4">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-1.5 mb-4">
                    <img src={pixLogo} alt="Pix" className="h-8 w-8 object-contain" />
                    <span className="text-sm font-bold text-foreground">Taxa de Logística</span>
                    <span className="text-[10px] text-muted-foreground">Pagamento obrigatório</span>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-3 mb-4 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Taxa entrega/retirada</span>
                      <span className="font-semibold text-foreground">R$ {taxaEntrega.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Taxa entrega prioritária</span>
                      <span className="font-semibold text-foreground">R$ {taxaPrioritaria.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="border-t pt-1 flex justify-between text-sm font-bold">
                      <span>Total</span>
                      <span className="text-primary">R$ {taxaTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>

                  {taxaStatus === "loading" && (
                    <Button disabled className="w-full text-base font-bold" size="lg">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando PIX da taxa...
                    </Button>
                  )}

                  {(taxaStatus === "generated" || taxaStatus === "confirmed") && (
                    <div className="animate-in fade-in duration-500 space-y-3">
                      <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-4">
                        <div className="w-[200px] md:w-[220px] aspect-square flex items-center justify-center rounded-lg bg-white p-3">
                          {taxaQrDisplay ? (
                            taxaQrIsImage ? (
                              <img src={taxaQrDisplay} alt="QR Code Pix taxa" className="w-full h-full object-contain" loading="lazy" />
                            ) : (
                              <QRCodeSVG value={getSafeQrValue(taxaQrDisplay, taxaPixCode)} className="w-full h-full" />
                            )
                          ) : (
                            <span className="text-xs text-muted-foreground text-center px-4">QR Code será exibido após geração</span>
                          )}
                        </div>

                        {taxaPixCode && (
                          <div className="w-full">
                            <button
                              type="button"
                              onClick={handleCopyTaxaPix}
                              aria-label="Copiar código Pix da taxa"
                              className="w-full flex items-center gap-2 rounded-md border border-input bg-muted/50 px-3 py-2.5 text-left cursor-pointer hover:bg-muted transition-colors group"
                            >
                              <span className="flex-1 text-[10px] text-foreground break-all leading-relaxed select-all">{taxaPixCode}</span>
                              <Copy className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                          </div>
                        )}

                        <p className="text-[10px] text-muted-foreground text-center inline-flex items-center justify-center gap-1">
                          <img src={lockIcon} alt="Cadeado" className="h-3 w-3 inline-block" />
                          Pagamento seguro via
                          <img src={mercadopagoLogo} alt="Mercado Pago" className="h-3.5 inline-block" />
                        </p>
                      </div>

                      {taxaStatus === "generated" && (
                        <div className="flex items-center justify-center gap-2 py-2">
                          <div className="relative flex h-5 w-5 items-center justify-center">
                            <div className="absolute h-5 w-5 rounded-full border-2 border-primary/20" />
                            <div className="absolute h-5 w-5 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground animate-pulse">Aguardando confirmação da taxa…</span>
                        </div>
                      )}

                      {taxaStatus === "confirmed" && (
                        <div className="flex items-center justify-center gap-2 py-3">
                          <CheckCircle className="h-5 w-5 text-accent" />
                          <span className="text-sm font-bold text-accent">Taxa confirmada! Redirecionando...</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      
    </main>
  );
};

export default Checkout;
