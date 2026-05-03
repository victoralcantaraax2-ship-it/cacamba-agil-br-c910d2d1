import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Copy, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getSafeQrValue } from "@/lib/qrPix";
import { useToast } from "@/hooks/use-toast";
import { formatPhone, validatePhone } from "@/lib/phone";

import logoNortex from "@/assets/logo-nortex.png";
import pixLogo from "@/assets/pix-logo.webp";
import lockIcon from "@/assets/lock-icon.webp";
import mercadopagoLogo from "@/assets/mercadopago-logo.webp";

const taxaEntregaMap: Record<string, number> = {
  cacamba_3m: 70, cacamba_4m: 78, cacamba_5m: 85, cacamba_7m: 90, cacamba_10m: 95,
};
const taxaPrioritaria = 30;

const isQrImage = (v: string) => /^(data:image|https?:\/\/)/.test(v);

const formatCurrency = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  const reais = (cents / 100).toFixed(2);
  return reais.replace(".", ",");
};

const parseCurrency = (formatted: string): number => {
  if (!formatted) return 0;
  return parseFloat(formatted.replace(",", ".")) || 0;
};

const Logistica = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Params from checkout redirect
  const paramNome = params.get("nome") || "";
  const paramTelefone = params.get("telefone") || "";
  const paramPlano = params.get("plano") || "";
  const autoGenerate = params.get("auto") === "1";

  // Standalone form
  const [nome, setNome] = useState(paramNome);
  const [telefone, setTelefone] = useState(paramTelefone);
  const [plano, setPlano] = useState(paramPlano || "cacamba_5m");
  const [valorCustom, setValorCustom] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // PIX state
  const [pixCode, setPixCode] = useState("");
  const [pixQr, setPixQr] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "generated" | "confirmed">("idle");
  const [copyToast, setCopyToast] = useState(false);

  const taxaEntrega = taxaEntregaMap[plano] || 80;
  const taxaTotal = useCustom && valorCustom ? parseCurrency(valorCustom) : taxaEntrega + taxaPrioritaria;

  // Auto-generate when coming from checkout
  useEffect(() => {
    if (autoGenerate && paramNome && paramTelefone && status === "idle") {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    const e: Record<string, string> = {};
    if (!nome.trim()) e.nome = "Informe o nome";
    if (!validatePhone(telefone)) e.telefone = "Telefone inválido";
    if (useCustom && (!valorCustom || parseCurrency(valorCustom) <= 0)) e.valor = "Informe um valor válido";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus("loading");
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const finalAmount = useCustom ? parseCurrency(valorCustom) : taxaEntrega + taxaPrioritaria;

      const res = await fetch(`${supabaseUrl}/functions/v1/criar-pix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          nome: nome.trim(),
          telefone: telefone.replace(/\D/g, ""),
          valor_custom: finalAmount,
          descricao_custom: useCustom ? "Cobrança de Logística" : "Taxa Entrega/Retirada + Entrega Prioritária",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar PIX");

      const rawPixCode = String(data.pix_code ?? "").trim();
      const rawQrCode = String(data.qr_code ?? "").trim();
      const qrLooksLikeImage = isQrImage(rawQrCode);
      const finalPixCode = rawPixCode || (!qrLooksLikeImage ? rawQrCode : "");
      const finalQrCode = rawQrCode || finalPixCode;

      if (!finalPixCode && !finalQrCode) throw new Error("PIX retornou sem código válido");

      setPixCode(finalPixCode);
      setPixQr(finalQrCode);
      setTransactionId(data.transaction_id || "");
      setStatus("generated");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Save PIX lead
      supabase.from("pix_leads" as any).insert({
        customer_name: nome.trim(),
        customer_phone: telefone.replace(/\D/g, ""),
        address: null,
        plan_id: useCustom ? null : plano,
        plan_label: useCustom ? "Logística avulsa" : plano.replace("cacamba_", "").replace("m", "m³"),
        amount: finalAmount,
        transaction_id: data.transaction_id || null,
        source: "logistica",
      }).then(() => {});
    } catch (err) {
      console.error("Erro ao gerar PIX logística:", err);
      setStatus("idle");
      toast({ variant: "destructive", title: "Erro ao gerar PIX", description: "Tente novamente." });
    }
  };

  // Poll for payment confirmation
  useEffect(() => {
    if (status !== "generated" || !transactionId) return;

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
          setStatus("confirmed");
          toast({ title: "Taxa confirmada!", description: "Pagamento aprovado com sucesso." });
          setTimeout(() => navigate("/obrigado"), 2000);
        }
      } catch (err) {
        console.error("Erro ao verificar status:", err);
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    const timeout = setTimeout(() => { cancelled = true; clearInterval(interval); }, 15 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); clearTimeout(timeout); };
  }, [status, transactionId, navigate, toast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopyToast(true);
    toast({ title: "Código copiado!" });
    setTimeout(() => setCopyToast(false), 2000);
  };

  const qrDisplay = pixQr || pixCode;
  const qrIsImage = isQrImage(qrDisplay);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md space-y-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <img src={logoNortex} alt="NORTEX Caçambas" className="h-14 w-auto" />
          <h1 className="text-lg font-extrabold text-foreground text-center">Taxa de Logística</h1>
          <p className="text-xs text-muted-foreground text-center">Pagamento obrigatório</p>
        </div>

        {/* Form (only when not generated yet) */}
        {status === "idle" && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="nome" className="text-xs">Nome do cliente</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={`text-sm h-9 ${errors.nome ? "border-destructive" : ""}`}
                />
                {errors.nome && <p className="mt-0.5 text-xs text-destructive">{errors.nome}</p>}
              </div>

              <div>
                <Label htmlFor="telefone" className="text-xs">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(formatPhone(e.target.value))}
                  maxLength={15}
                  inputMode="tel"
                  className={`text-sm h-9 ${errors.telefone ? "border-destructive" : ""}`}
                />
                {errors.telefone && <p className="mt-0.5 text-xs text-destructive">{errors.telefone}</p>}
              </div>

              {!useCustom && (
                <div>
                  <Label className="text-xs">Tamanho da caçamba</Label>
                  <div className="grid grid-cols-5 gap-1.5 mt-1">
                    {Object.entries(taxaEntregaMap).map(([key, val]) => {
                      const label = key.replace("cacamba_", "").replace("m", "m³");
                      const total = val + taxaPrioritaria;
                      return (
                        <button
                          key={key}
                          onClick={() => setPlano(key)}
                          className={`rounded-lg border-2 p-2 text-center transition-all text-xs ${
                            plano === key
                              ? "border-primary bg-primary/10 font-bold"
                              : "border-muted hover:border-primary/50"
                          }`}
                        >
                          <span className="block font-semibold">{label}</span>
                          <span className="block text-[10px] text-muted-foreground">R${total}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {!useCustom && (
                <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
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
                    <span className="text-primary">R$ {(taxaEntrega + taxaPrioritaria).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setUseCustom(!useCustom)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${useCustom ? "bg-primary" : "bg-muted-foreground/30"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${useCustom ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
                <span className="text-xs text-muted-foreground">Valor personalizado</span>
              </div>

              {useCustom && (
                <div>
                  <Label htmlFor="valorCustom" className="text-xs">Valor (R$)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">R$</span>
                    <Input
                      id="valorCustom"
                      type="text"
                      placeholder="0,00"
                      value={valorCustom}
                      onChange={(e) => setValorCustom(formatCurrency(e.target.value))}
                      inputMode="numeric"
                      className={`text-sm h-9 pl-10 ${errors.valor ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.valor && <p className="mt-0.5 text-xs text-destructive">{errors.valor}</p>}
                </div>
              )}

              <Button onClick={handleGenerate} className="w-full text-base font-bold" size="lg">
                Gerar PIX da Taxa
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {status === "loading" && (
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-3 py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Gerando PIX da taxa...</span>
            </CardContent>
          </Card>
        )}

        {/* PIX generated / confirmed */}
        {(status === "generated" || status === "confirmed") && (
          <Card className="border-primary/30">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-1.5 mb-4">
                <img src={pixLogo} alt="Pix" className="h-8 w-8 object-contain" />
                <span className="text-sm font-bold text-foreground">Taxa de Logística</span>
                <span className="text-[10px] text-muted-foreground">Pagamento obrigatório</span>
                <span className="text-lg font-extrabold text-primary">
                  R$ {taxaTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {!useCustom && (
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
                    <span className="text-primary">R$ {(taxaEntrega + taxaPrioritaria).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              )}

              <div className="animate-in fade-in duration-500 space-y-3">
                <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-4">
                  <div className="w-[200px] md:w-[220px] aspect-square flex items-center justify-center rounded-lg bg-white p-3">
                    {qrDisplay ? (
                      qrIsImage ? (
                        <img src={qrDisplay} alt="QR Code Pix" className="w-full h-full object-contain" />
                      ) : (
                        <QRCodeSVG value={getSafeQrValue(qrDisplay, pixCode)} className="w-full h-full" />
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground text-center px-4">QR Code será exibido após geração</span>
                    )}
                  </div>

                  {pixCode && (
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copiar código Pix"
                        className="w-full flex items-center gap-2 rounded-md border border-input bg-muted/50 px-3 py-2.5 text-left cursor-pointer hover:bg-muted transition-colors group"
                      >
                        <span className="flex-1 text-[10px] text-foreground break-all leading-relaxed select-all">{pixCode}</span>
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

                {status === "generated" && (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="relative flex h-5 w-5 items-center justify-center">
                      <div className="absolute h-5 w-5 rounded-full border-2 border-primary/20" />
                      <div className="absolute h-5 w-5 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground animate-pulse">Aguardando confirmação do pagamento…</span>
                  </div>
                )}

                {status === "confirmed" && (
                  <div className="flex items-center justify-center gap-2 py-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-sm font-bold text-accent">Taxa confirmada! Redirecionando...</span>
                  </div>
                )}
              </div>

              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                Atendimento iniciado após confirmação automática do pagamento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default Logistica;
