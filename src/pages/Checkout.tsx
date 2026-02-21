import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Copy, ArrowLeft, Plus, Minus, Loader2 } from "lucide-react";
import { formatCpf, validateCpf } from "@/lib/cpf";
import { formatPhone, validatePhone } from "@/lib/phone";
import { captureUtms, type UtmData } from "@/lib/utm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import logoAmba from "@/assets/logo-amba.png";

type Plan = {
  id: string;
  label: string;
  price: number;
};

const plans: Plan[] = [
  { id: "cacamba_3m", label: "Caçamba 3m³", price: 179.99 },
  { id: "cacamba_5m", label: "Caçamba 5m³", price: 259.99 },
  { id: "cacamba_6m", label: "Caçamba 6m³", price: 289.99 },
  { id: "cacamba_8m", label: "Caçamba 8m³", price: 339.99 },
  { id: "cacamba_10m", label: "Caçamba 10m³", price: 389.00 },
];

type FormData = {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
};

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState<FormData>({ nome: "", cpf: "", email: "", telefone: "" });
  const [errors, setErrors] = useState<Partial<FormData & { plan: string }>>({});
  const [utms, setUtms] = useState<Partial<UtmData>>({});
  const [pixCode, setPixCode] = useState("");
  const [pixQr, setPixQr] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "generated" | "confirmed">("idle");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setUtms(captureUtms());
  }, []);

  const totalSteps = 4;
  const progressValue = (step / totalSteps) * 100;

  const goToStep = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentPlan = plans.find((p) => p.id === selectedPlan);
  const totalPrice = currentPlan ? currentPlan.price * quantity : 0;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Step 1 — select plan
  const validateStep1 = () => {
    if (!selectedPlan) {
      setErrors({ plan: "Selecione um tamanho de caçamba" });
      return;
    }
    setErrors({});
    goToStep(2);
  };

  // Step 2 — name + cpf
  const validateStep2 = () => {
    const e: Partial<FormData> = {};
    if (!form.nome.trim() || form.nome.trim().length < 3) e.nome = "Informe seu nome completo";
    if (!validateCpf(form.cpf)) e.cpf = "CPF inválido";
    setErrors(e);
    if (Object.keys(e).length === 0) goToStep(3);
  };

  // Step 3 — email + phone
  const validateStep3 = () => {
    const e: Partial<FormData> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) e.email = "Email inválido";
    if (!validatePhone(form.telefone)) e.telefone = "Telefone inválido";
    setErrors(e);
    if (Object.keys(e).length === 0) {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "InitiateCheckout");
      }
      goToStep(4);
    }
  };

  const handleGeneratePix = async () => {
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
          cpf: form.cpf,
          email: form.email,
          telefone: form.telefone,
          plano: selectedPlan,
          quantidade: quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar PIX");
      }

      setPixCode(data.pix_code || "");
      setPixQr(data.qr_code || "");
      setTransactionId(data.transaction_id || "");
      setPaymentStatus("generated");
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

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast({ title: "Código PIX copiado!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary py-4">
        <div className="container flex flex-col items-center px-4">
          <img src={logoAmba} alt="AMBA Caçambas" className="h-16 w-auto md:h-20" />
          <p className="mt-1 text-xs font-medium text-secondary-foreground/60">
            Atendimento rápido e seguro
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="container max-w-lg px-4 pt-6">
        <div className="mb-2 flex justify-between text-xs font-medium text-muted-foreground">
          <span className={step >= 1 ? "text-primary font-bold" : ""}>1. Caçamba</span>
          <span className={step >= 2 ? "text-primary font-bold" : ""}>2. Identificação</span>
          <span className={step >= 3 ? "text-primary font-bold" : ""}>3. Contato</span>
          <span className={step >= 4 ? "text-primary font-bold" : ""}>4. Pagamento</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      <div className="container max-w-lg px-4 py-8">
        {/* Step 1 — Plan Selection */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Escolha sua caçamba</h2>
            {errors.plan && <p className="text-sm text-destructive">{errors.plan}</p>}

            <div className="space-y-3">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "ring-2 ring-primary border-primary bg-primary/5"
                        : "hover:border-primary/40"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-bold text-foreground">{plan.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(plan.price)} / unidade
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <div className="flex items-center gap-2 mr-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuantity((q) => Math.max(1, q - 1));
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-6 text-center font-bold text-foreground">
                              {quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuantity((q) => Math.min(10, q + 1));
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {isSelected ? (
                          <CheckCircle className="h-6 w-6 text-primary" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedPlan && (
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">Total estimado</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
                <p className="text-xs text-muted-foreground">
                  {quantity}x {currentPlan?.label}
                </p>
              </div>
            )}

            <Button onClick={validateStep1} className="w-full text-base font-bold" size="lg">
              Continuar
            </Button>
          </div>
        )}

        {/* Step 2 — Name + CPF */}
        {step === 2 && (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CardContent className="pt-6">
              <button onClick={() => goToStep(1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <h2 className="mb-6 text-xl font-bold text-foreground">Informe seus dados</h2>
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
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: formatCpf(e.target.value) })}
                    maxLength={14}
                    className={errors.cpf ? "border-destructive" : ""}
                  />
                  {errors.cpf && <p className="mt-1 text-sm text-destructive">{errors.cpf}</p>}
                </div>
                <Button onClick={validateStep2} className="w-full text-base font-bold" size="lg">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Email + Phone */}
        {step === 3 && (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CardContent className="pt-6">
              <button onClick={() => goToStep(2)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <h2 className="mb-6 text-xl font-bold text-foreground">Como podemos falar com você?</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: formatPhone(e.target.value) })}
                    maxLength={15}
                    className={errors.telefone ? "border-destructive" : ""}
                  />
                  {errors.telefone && <p className="mt-1 text-sm text-destructive">{errors.telefone}</p>}
                </div>
                <Button onClick={validateStep3} className="w-full text-base font-bold" size="lg">
                  Gerar PIX
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4 — PIX Payment */}
        {step === 4 && (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CardContent className="pt-6">
              <button onClick={() => goToStep(3)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>

              <div className="mb-6 flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>Atendimento iniciado após confirmação automática do pagamento.</span>
              </div>

              <h2 className="mb-4 text-xl font-bold text-foreground">Resumo da solicitação</h2>
              <div className="mb-6 space-y-2 rounded-lg bg-muted p-4 text-sm">
                <p><strong>Serviço:</strong> {currentPlan?.label}</p>
                <p><strong>Quantidade:</strong> {quantity}</p>
                <p><strong>Total:</strong> {formatCurrency(totalPrice)}</p>
                <hr className="my-2 border-border" />
                <p><strong>Nome:</strong> {form.nome}</p>
                <p><strong>CPF:</strong> {form.cpf}</p>
                <p><strong>Email:</strong> {form.email}</p>
                <p><strong>Telefone:</strong> {form.telefone}</p>
              </div>

              {paymentStatus === "idle" && (
                <Button onClick={handleGeneratePix} className="w-full text-base font-bold" size="lg">
                  Gerar PIX
                </Button>
              )}

              {paymentStatus === "loading" && (
                <Button disabled className="w-full text-base font-bold" size="lg">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando PIX...
                </Button>
              )}

              {(paymentStatus === "generated" || paymentStatus === "confirmed") && (
                <div className="animate-in fade-in duration-500 space-y-4">
                  <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6">
                    <h3 className="font-bold text-foreground">Pague com PIX</h3>
                    <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                      {pixQr ? (
                        <img src={pixQr} alt="QR Code PIX" className="h-full w-full" />
                      ) : (
                        <span className="text-center px-4">QR Code será exibido após geração</span>
                      )}
                    </div>

                    {pixCode && (
                      <div className="w-full">
                        <Label className="text-xs text-muted-foreground">Código PIX Copia e Cola</Label>
                        <div className="mt-1 flex gap-2">
                          <Input value={pixCode} readOnly className="text-xs" />
                          <Button variant="outline" size="icon" onClick={handleCopyPix} title="Copiar">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        {copied && <p className="mt-1 text-xs text-accent">Copiado!</p>}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      🔒 Pagamento seguro via PIX.
                    </p>
                  </div>

                  {paymentStatus === "generated" && (
                    <p className="text-center text-sm text-muted-foreground">
                      Aguardando confirmação do pagamento...
                    </p>
                  )}

                  {paymentStatus === "confirmed" && (
                    <div className="flex items-center justify-center gap-2 text-accent">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-bold">Pagamento confirmado! Redirecionando...</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <WhatsAppFloat />
    </main>
  );
};

export default Checkout;
