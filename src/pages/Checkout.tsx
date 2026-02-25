import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Copy, ArrowLeft, Plus, Minus, Loader2, MapPin, XCircle, ChevronDown } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
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
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setUtms(captureUtms());
  }, []);

  const totalSteps = 3;
  const progressValue = (step / totalSteps) * 100;

  const goToStep = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentPlan = plans.find((p) => p.id === selectedPlan);
  const totalPrice = currentPlan ? currentPlan.price * quantity : 0;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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

  const fullAddress = `${address.logradouro}${address.numero ? `, ${address.numero}` : ""}${address.complemento ? ` – ${address.complemento}` : ""}${address.bairro ? ` – ${address.bairro}` : ""}, ${address.localidade}/${address.uf}`;

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
          <span className={step >= 3 ? "text-primary font-bold" : ""}>3. Pagamento</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      <div className="container max-w-lg px-4 py-8">

        {/* ========== STEP 1 — CAÇAMBA ========== */}
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

        {/* ========== STEP 2 — IDENTIFICAÇÃO ========== */}
        {step === 2 && (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CardContent className="pt-6">
              <button onClick={() => goToStep(1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <h2 className="mb-1 text-xl font-bold text-foreground">Identificação</h2>
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

                <Button onClick={validateStep2} className="w-full text-base font-bold" size="lg">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========== STEP 3 — PAGAMENTO ========== */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <button onClick={() => goToStep(2)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>

            {/* --- Endereço de entrega --- */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-1 text-lg font-bold text-foreground">Onde vamos entregar a caçamba</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Endereço usado exclusivamente para a entrega da caçamba.
                </p>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="cep">CEP <span className="text-destructive">*</span></Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={address.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      maxLength={9}
                      inputMode="numeric"
                      className={`text-base ${errors.cep ? "border-destructive" : ""}`}
                    />
                    {errors.cep && <p className="mt-1 text-sm text-destructive">{errors.cep}</p>}
                  </div>

                  {cepLoading && (
                    <p className="text-sm text-muted-foreground animate-pulse">Buscando endereço...</p>
                  )}

                  {cepError && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive animate-fade-in">
                      <XCircle className="h-4 w-4 shrink-0" />
                      <span>CEP não encontrado. Verifique e tente novamente.</span>
                    </div>
                  )}

                  {cepFound && (
                    <div className="animate-fade-in space-y-3">
                      <div className="rounded-xl border-l-4 border-l-accent bg-accent/5 p-3 flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground text-sm leading-tight">
                            {address.logradouro || "Endereço"}{address.bairro ? ` – ${address.bairro}` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground">{address.localidade} – {address.uf}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="numero">Número <span className="text-destructive">*</span></Label>
                          <Input
                            id="numero"
                            placeholder="Nº"
                            value={address.numero}
                            onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                            className={errors.numero ? "border-destructive" : ""}
                          />
                          {errors.numero && <p className="mt-1 text-sm text-destructive">{errors.numero}</p>}
                        </div>
                        <div>
                          <Label htmlFor="complemento">Complemento</Label>
                          <Input
                            id="complemento"
                            placeholder="Apto, bloco, referência (opcional)"
                            value={address.complemento}
                            onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* --- Resumo do Pedido --- */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-4 text-lg font-bold text-foreground">Resumo do pedido</h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Serviço:</strong> {currentPlan?.label}</p>
                  <p><strong>Quantidade:</strong> {quantity}</p>
                  <hr className="my-2 border-border" />
                  <p><strong>Nome:</strong> {form.nome}</p>
                  <p><strong>Telefone:</strong> {form.telefone}</p>
                  {cepFound && (
                    <>
                      <hr className="my-2 border-border" />
                      <p><strong>Entrega:</strong> {fullAddress}</p>
                    </>
                  )}
                  <hr className="my-2 border-border" />
                  <p className="text-lg font-bold text-primary">
                    Total: {formatCurrency(totalPrice)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* --- Pagamento PIX --- */}
            <Card>
              <CardContent className="pt-6">
                {paymentStatus === "idle" && (
                  <Button onClick={handleGeneratePix} className="w-full text-base font-bold" size="lg">
                    Pagar com Pix
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
                      <h3 className="font-bold text-foreground text-sm">Pague com PIX</h3>
                      <div className="flex w-[65%] max-w-[192px] aspect-square items-center justify-center rounded-lg bg-muted">
                        {pixCode ? (
                          <QRCodeSVG value={pixCode} className="w-full h-full p-1" />
                        ) : (
                          <span className="text-xs text-muted-foreground text-center px-4">QR Code será exibido após geração</span>
                        )}
                      </div>

                      {pixCode && (
                        <div className="w-full">
                          <div className="flex gap-2">
                            <Input value={pixCode} readOnly className="text-[10px] h-8" />
                            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={handleCopyPix} title="Copiar">
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          {copied && <p className="mt-1 text-xs text-accent">Copiado!</p>}
                        </div>
                      )}

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="como-pagar" className="border-none">
                          <AccordionTrigger className="text-sm font-semibold text-foreground py-2 hover:no-underline">
                            Como pagar com Pix
                          </AccordionTrigger>
                          <AccordionContent className="pb-2">
                            <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                              <li>Abra o app do seu banco</li>
                              <li>Selecione a opção <strong className="text-foreground">PIX</strong></li>
                              <li>Escaneie o QR Code ou copie o código</li>
                              <li>Confirme o pagamento</li>
                            </ol>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <p className="text-[10px] text-muted-foreground text-center">
                        🔒 Pagamento seguro via PIX.
                      </p>
                    </div>

                    {paymentStatus === "generated" && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>Aguardando confirmação automática do pagamento pelo Pix…</span>
                      </div>
                    )}

                    {paymentStatus === "confirmed" && (
                      <div className="flex items-center justify-center gap-2 text-accent">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-bold">Pagamento confirmado! Redirecionando...</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span>Atendimento iniciado após confirmação automática do pagamento.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <WhatsAppFloat />
    </main>
  );
};

export default Checkout;
