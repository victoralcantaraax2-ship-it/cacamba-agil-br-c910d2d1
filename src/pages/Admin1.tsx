import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { formatPhone, validatePhone } from "@/lib/phone";
import { useToast } from "@/hooks/use-toast";
import logoAmba from "@/assets/logo-amba-nova.webp";

const Admin1 = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState("");
  const [pixQr, setPixQr] = useState("");
  const [valorFinal, setValorFinal] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const isQrImage = (value: string) => /^https?:\/\//i.test(value) || /^data:image\//i.test(value);

  const handleGenerate = async () => {
    if (!nome.trim() || nome.trim().length < 3) {
      toast({ variant: "destructive", title: "Informe o nome do cliente" });
      return;
    }
    if (!validatePhone(telefone)) {
      toast({ variant: "destructive", title: "Informe um telefone válido" });
      return;
    }
    const parsedValor = parseFloat(valor.replace(",", "."));
    if (!parsedValor || parsedValor < 1) {
      toast({ variant: "destructive", title: "Informe um valor válido (mínimo R$1,00)" });
      return;
    }

    setLoading(true);
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
          nome: nome.trim(),
          telefone,
          valor_custom: parsedValor,
          descricao_custom: descricao.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar PIX");

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
      setValorFinal(data.valor_final / 100);
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Erro", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = pixCode;
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const handleReset = () => {
    setPixCode("");
    setPixQr("");
    setValorFinal(0);
    setNome("");
    setTelefone("");
    setValor("");
    setDescricao("");
  };

  const qrDisplayValue = pixQr || pixCode;
  const qrIsImage = isQrImage(qrDisplayValue);

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-secondary py-4">
        <div className="container flex flex-col items-center px-4">
          <img src={logoAmba} alt="AMBA" className="h-14 w-auto" />
          <p className="mt-1 text-xs font-semibold text-destructive">PAINEL INTERNO</p>
        </div>
      </div>

      <div className="container max-w-md px-4 py-8">
        {!pixCode ? (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Gerar cobrança PIX</h2>

              <div>
                <Label htmlFor="nome">Nome do cliente</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 9XXXX-XXXX"
                  value={telefone}
                  onChange={(e) => setTelefone(formatPhone(e.target.value))}
                  maxLength={15}
                  inputMode="tel"
                />
              </div>

              <div>
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  placeholder="Ex: 150.00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  inputMode="decimal"
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição (opcional)</Label>
                <Input
                  id="descricao"
                  placeholder="Ex: Diferença de valor caçamba 5m³"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full text-base font-bold"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Gerando PIX...
                  </>
                ) : (
                  "Gerar PIX"
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Pagamento seguro</span>
                <img
                  src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/badge-icon-v2.png"
                  alt="Mercado Pago"
                  className="h-5"
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="text-center">
                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                <h2 className="text-lg font-bold text-foreground">PIX gerado!</h2>
                <p className="text-2xl font-bold text-primary mt-1">
                  {formatCurrency(valorFinal)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Cliente: {nome}
                </p>
              </div>

              {qrDisplayValue && (
                <div className="flex justify-center">
                  {qrIsImage ? (
                    <img
                      src={qrDisplayValue}
                      alt="QR Code Pix para pagamento"
                      className="h-[200px] w-[200px] object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <QRCodeSVG value={qrDisplayValue} size={200} />
                  )}
                </div>
              )}

              {pixCode && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium text-center">
                    Código PIX copia e cola — clique para copiar
                  </p>
                  <div className="relative">
                    <div
                      onClick={handleCopy}
                      className="bg-muted rounded-lg p-3 text-xs break-all font-mono text-foreground max-h-24 overflow-y-auto cursor-pointer hover:bg-muted/80 transition-colors"
                    >
                      {pixCode}
                    </div>
                    {copied && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-lg animate-fade-in">
                        Copiado com Sucesso
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button onClick={handleReset} className="w-full" variant="secondary">
                Gerar nova cobrança
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default Admin1;
