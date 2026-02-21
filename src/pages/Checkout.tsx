import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Copy, ArrowLeft } from "lucide-react";
import { formatCpf, validateCpf } from "@/lib/cpf";
import { formatPhone, validatePhone } from "@/lib/phone";
import { captureUtms, type UtmData } from "@/lib/utm";
import { useNavigate } from "react-router-dom";
import WhatsAppFloat from "@/components/WhatsAppFloat";

type FormData = {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
};

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({ nome: "", cpf: "", email: "", telefone: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [utms, setUtms] = useState<Partial<UtmData>>({});
  const [pixCode, setPixCode] = useState("");
  const [pixQr, setPixQr] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "generated" | "confirmed">("idle");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUtms(captureUtms());
  }, []);

  const progressValue = (step / 3) * 100;

  const goToStep = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 1 validation
  const validateStep1 = () => {
    const e: Partial<FormData> = {};
    if (!form.nome.trim() || form.nome.trim().length < 3) e.nome = "Informe seu nome completo";
    if (!validateCpf(form.cpf)) e.cpf = "CPF inválido";
    setErrors(e);
    if (Object.keys(e).length === 0) goToStep(2);
  };

  // Step 2 validation
  const validateStep2 = () => {
    const e: Partial<FormData> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) e.email = "Email inválido";
    if (!validatePhone(form.telefone)) e.telefone = "Telefone inválido";
    setErrors(e);
    if (Object.keys(e).length === 0) {
      // Dispatch InitiateCheckout pixel
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "InitiateCheckout");
      }
      goToStep(3);
    }
  };

  const handleGeneratePix = async () => {
    setPaymentStatus("loading");

    // TODO: Integrate with PIX payment gateway API
    // The payload should include: form data + utms
    // const payload = { ...form, cpf: form.cpf.replace(/\D/g, ""), telefone: form.telefone.replace(/\D/g, ""), ...utms };

    // Simulating PIX generation for now
    setTimeout(() => {
      setPixCode("00020126580014br.gov.bcb.pix0136exemplo-pix-code-amba-central-cacambas5204000053039865802BR5925AMBA CENTRAL DE CACAMBA6009SAO PAULO62070503***6304ABCD");
      setPixQr(""); // Will be a real QR code URL from the gateway
      setPaymentStatus("generated");
    }, 1500);

    // TODO: Start polling payment status
    // When confirmed:
    // if (typeof window !== "undefined" && (window as any).fbq) {
    //   (window as any).fbq("track", "Purchase");
    // }
    // navigate("/obrigado");
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate payment confirmation (for demo)
  const simulateConfirmation = () => {
    setPaymentStatus("confirmed");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase");
    }
    setTimeout(() => navigate("/obrigado"), 1500);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary py-4">
        <div className="container px-4">
          <h1 className="text-center text-lg font-bold text-secondary-foreground">
            AMBA Central de Caçambas
          </h1>
        </div>
      </div>

      {/* Progress */}
      <div className="container max-w-lg px-4 pt-6">
        <div className="mb-2 flex justify-between text-xs font-medium text-muted-foreground">
          <span className={step >= 1 ? "text-primary font-bold" : ""}>1. Identificação</span>
          <span className={step >= 2 ? "text-primary font-bold" : ""}>2. Contato</span>
          <span className={step >= 3 ? "text-primary font-bold" : ""}>3. Finalização</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      <div className="container max-w-lg px-4 py-8">
        {/* Step 1 */}
        {step === 1 && (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CardContent className="pt-6">
              <h2 className="mb-6 text-xl font-bold text-foreground">Informe seus dados para continuar</h2>
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
                <Button onClick={validateStep1} className="w-full text-base font-bold" size="lg">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CardContent className="pt-6">
              <button onClick={() => goToStep(1)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
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
                <Button onClick={validateStep2} className="w-full text-base font-bold" size="lg">
                  Ir para finalização
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CardContent className="pt-6">
              <button onClick={() => goToStep(2)} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>

              <div className="mb-6 flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>Atendimento iniciado após confirmação automática do pagamento.</span>
              </div>

              <h2 className="mb-4 text-xl font-bold text-foreground">Resumo da solicitação</h2>
              <div className="mb-6 space-y-2 rounded-lg bg-muted p-4 text-sm">
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
                  Gerando PIX...
                </Button>
              )}

              {(paymentStatus === "generated" || paymentStatus === "confirmed") && (
                <div className="space-y-4">
                  {/* QR Code placeholder */}
                  <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6">
                    <h3 className="font-bold text-foreground">Pague com PIX</h3>
                    <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                      {pixQr ? (
                        <img src={pixQr} alt="QR Code PIX" className="h-full w-full" />
                      ) : (
                        <span className="text-center px-4">QR Code será exibido após integração com gateway</span>
                      )}
                    </div>

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
                  </div>

                  {paymentStatus === "generated" && (
                    <div className="text-center">
                      <p className="mb-2 text-sm text-muted-foreground">Aguardando confirmação do pagamento...</p>
                      {/* Demo button - remove in production */}
                      <Button variant="outline" size="sm" onClick={simulateConfirmation} className="text-xs">
                        (Demo) Simular confirmação
                      </Button>
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
            </CardContent>
          </Card>
        )}
      </div>

      <WhatsAppFloat />
    </main>
  );
};

export default Checkout;
