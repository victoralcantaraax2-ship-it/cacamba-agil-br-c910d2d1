import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format, addDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle, Copy, Loader2, MapPin, XCircle, ShieldCheck, Lock,
  CalendarIcon, ChevronRight, CreditCard,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { firePixCopyConversion } from "@/lib/gtagConversion";
import { formatPhone, validatePhone } from "@/lib/phone";
import { getSafeQrValue } from "@/lib/qrPix";
import { captureUtms, type UtmData } from "@/lib/utm";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { formatCpf } from "@/lib/cpf";
import CardPaymentForm from "@/components/CardPaymentForm";

import logoNortex from "@/assets/logo-nortex.png";
import pixLogo from "@/assets/pix-logo.webp";

type Plan = { id: string; label: string; short: string; price: number; periodo: string; uso: string; popular?: boolean };
const plans: Plan[] = [
  { id: "cacamba_3m", label: "Caçamba 3m³", short: "3m³", price: 175.0, periodo: "2 a 7 dias", uso: "Pequena reforma", popular: true },
  { id: "cacamba_4m", label: "Caçamba 4m³", short: "4m³", price: 240.0, periodo: "2 a 7 dias", uso: "Reforma residencial" },
  { id: "cacamba_5m", label: "Caçamba 5m³", short: "5m³", price: 360.0, periodo: "3 a 7 dias", uso: "Obra média" },
  { id: "cacamba_7m", label: "Caçamba 7m³", short: "7m³", price: 450.0, periodo: "3 a 7 dias", uso: "Obra grande" },
  { id: "cacamba_10m", label: "Caçamba 10m³", short: "10m³", price: 590.0, periodo: "5 a 7 dias", uso: "Demolição" },
];

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
};

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const isQrImage = (value: string) =>
  /^https?:\/\//i.test(value) || /^data:image\//i.test(value);

const Agendar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const initialPlan = searchParams.get("plan") || "cacamba_3m";
  const [selectedPlan, setSelectedPlan] = useState<string>(
    plans.find((p) => p.id === initialPlan)?.id || "cacamba_3m"
  );

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [uf, setUf] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cepFound, setCepFound] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState(false);

  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledSlot, setScheduledSlot] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const minDate = startOfDay(new Date());
  const maxDate = addDays(startOfDay(new Date()), 30);
  const slotDefs: { label: string; startHour: number; endHour: number }[] = [
    { label: "08h – 10h", startHour: 8, endHour: 10 },
    { label: "10h – 12h", startHour: 10, endHour: 12 },
    { label: "13h – 15h", startHour: 13, endHour: 15 },
    { label: "15h – 17h", startHour: 15, endHour: 17 },
    { label: "17h – 19h", startHour: 17, endHour: 19 },
  ];
  const isSlotDisabled = (startHour: number, endHour: number = startHour + 2): boolean => {
    if (!scheduledDate) return false;
    const today = new Date();
    if (scheduledDate.toDateString() !== today.toDateString()) return false;
    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    return endHour * 60 <= nowMinutes;
  };

  const [nfEnabled, setNfEnabled] = useState(false);
  const [nfDocType, setNfDocType] = useState<"cpf" | "cnpj">("cpf");
  const [nfDoc, setNfDoc] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao">("pix");
  const [pixCode, setPixCode] = useState("");
  const [pixQr, setPixQr] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "loading" | "generated" | "confirmed"
  >("idle");
  const [copyToast, setCopyToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, setUtms] = useState<Partial<UtmData>>({});

  useEffect(() => { setUtms(captureUtms()); }, []);

  const currentPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlan)!,
    [selectedPlan]
  );
  const CARD_FEE_RATE = 0.05;
  const basePrice = currentPlan.price;
  const cardPrice = Math.round(basePrice * (1 + CARD_FEE_RATE));
  const totalPrice = paymentMethod === "cartao" ? cardPrice : basePrice;

  const fullAddress = `${logradouro}${numero ? `, ${numero}` : ""}${complemento ? ` – ${complemento}` : ""}${bairro ? ` – ${bairro}` : ""}, ${localidade}/${uf}`;

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
        setLogradouro(data.logradouro || "");
        setBairro(data.bairro || "");
        setLocalidade(data.localidade || "");
        setUf(data.uf || "");
        setCepFound(true);
      }
    } catch {
      setCepError(true);
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (value: string) => {
    const f = formatCep(value);
    setCep(f);
    setCepError(false);
    const digits = f.replace(/\D/g, "");
    if (digits.length === 8) fetchCep(digits);
    else { setCepFound(false); setLogradouro(""); setBairro(""); setLocalidade(""); setUf(""); }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!nome.trim() || nome.trim().length < 3) e.nome = "Informe seu nome completo";
    if (!validatePhone(telefone)) e.telefone = "Telefone inválido";
    if (!cepFound) e.cep = "Informe um CEP válido";
    if (!numero.trim()) e.numero = "Informe o número";
    if (!scheduledDate) e.data = "Selecione a data";
    if (!scheduledSlot) e.slot = "Selecione o período";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const firstField = document.querySelector(`[data-field="${Object.keys(e)[0]}"]`);
      firstField?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(e).length === 0;
  };

  const handleGeneratePix = async () => {
    if (!validate()) return;
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
          nome, telefone, plano: selectedPlan, quantidade: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar PIX");

      const rawPix = String(data.pix_code ?? "").trim();
      const rawQr = String(data.qr_code ?? "").trim();
      const qrImg = isQrImage(rawQr);
      const finalPix = rawPix || (!qrImg ? rawQr : "");
      const finalQr = rawQr || finalPix;
      if (!finalPix && !finalQr) throw new Error("PIX inválido");

      setPixCode(finalPix);
      setPixQr(finalQr);
      setTransactionId(data.transaction_id || "");
      setPaymentStatus("generated");

      supabase.from("pix_leads" as any).insert({
        customer_name: nome,
        customer_phone: telefone.replace(/\D/g, ""),
        address: fullAddress + ` | Agendado: ${scheduledDate ? format(scheduledDate, "dd/MM/yyyy") : ""} ${scheduledSlot}`,
        plan_id: selectedPlan,
        plan_label: currentPlan.label,
        amount: currentPlan.price,
        transaction_id: data.transaction_id || null,
        source: "agendar",
      }).then(() => {});

      setTimeout(() => {
        document.getElementById("pix-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      console.error("Erro PIX:", err);
      setPaymentStatus("idle");
      toast({
        variant: "destructive",
        title: "Erro ao gerar PIX",
        description: "Tente novamente em alguns segundos.",
      });
    }
  };

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
          toast({ title: "Pagamento confirmado!", description: "Seu PIX foi aprovado." });
        }
      } catch (e) { console.error(e); }
    };
    poll();
    const interval = setInterval(poll, 5000);
    const timeout = setTimeout(() => { cancelled = true; clearInterval(interval); }, 15 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); clearTimeout(timeout); };
  }, [paymentStatus, transactionId, toast]);

  useEffect(() => {
    if (paymentStatus !== "confirmed") return;
    const tel = telefone.replace(/\D/g, "");
    const t = setTimeout(() => {
      navigate(`/logistica?nome=${encodeURIComponent(nome)}&telefone=${encodeURIComponent(tel)}&plano=${encodeURIComponent(selectedPlan)}&auto=1`);
    }, 1500);
    return () => clearTimeout(t);
  }, [paymentStatus, nome, telefone, selectedPlan, navigate]);

  const handleCopyPix = async () => {
    try { await navigator.clipboard.writeText(pixCode); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = pixCode; ta.style.position = "absolute"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 4000);
    firePixCopyConversion();
  };

  const handleCardSuccess = () => setPaymentStatus("confirmed");
  const handleCardFailure = () => {
    toast({
      variant: "destructive",
      title: "Pagamento recusado",
      description: "Seu cartão foi recusado. Recomendamos finalizar via PIX.",
    });
    setPaymentMethod("pix");
  };

  const qrDisplay = pixQr || pixCode;
  const qrIsImg = isQrImage(qrDisplay);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      {copyToast && (
        <div
          role="status"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 rounded-2xl bg-white border border-emerald-200 pl-3 pr-5 py-3 shadow-2xl shadow-emerald-900/20 ring-1 ring-emerald-100 animate-in fade-in zoom-in-95 slide-in-from-top-3 duration-300"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 shadow-md shadow-emerald-600/30">
            <CheckCircle className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold text-gray-900">Seu código foi copiado</p>
            <p className="text-[11px] text-gray-500">Cole no app do seu banco para pagar</p>
          </div>
        </div>
      )}

      <div className="bg-emerald-700 text-white text-[11px] font-medium">
        <div className="container max-w-2xl px-4 py-1.5 flex items-center justify-center gap-3 sm:gap-5">
          <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Pagamento seguro</span>
          <span className="opacity-50">•</span>
          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Empresa verificada</span>
          <span className="opacity-50 hidden sm:inline">•</span>
          <span className="hidden sm:flex items-center gap-1"><MapPin className="h-3 w-3" /> Atendimento local</span>
        </div>
      </div>

      <header className="border-b border-gray-200 bg-white">
        <div className="container max-w-2xl flex items-center justify-between px-4 py-3">
          <img src={logoNortex} alt="NORTEX Caçambas" className="h-9 w-auto" />
          <span className="text-[11px] font-semibold text-gray-500">Agendamento</span>
        </div>
      </header>

      <div className="container max-w-2xl px-4 py-5 sm:py-7 space-y-4">
        <div className="px-1">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
            Agende sua caçamba com entrega rápida
          </h1>
          <p className="text-sm text-gray-500 mt-1">Leva menos de 1 minuto</p>
        </div>

        <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Seu pedido</p>
              <p className="text-base font-bold text-gray-900 mt-1 truncate">
                {currentPlan.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Período de locação: {currentPlan.periodo} úteis</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-gray-500">Total{paymentMethod === "cartao" ? " no PIX" : ""}</p>
              <p className="text-2xl font-black text-emerald-600 leading-none">{formatCurrency(basePrice)}</p>
              {paymentMethod === "cartao" && (
                <p className="text-[10px] text-amber-600 font-medium mt-1">
                  Cartão: {formatCurrency(cardPrice)} (+5%)
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
          <div className="flex items-baseline justify-between mb-1">
            <Label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Tamanho da caçamba
            </Label>
          </div>
          <p className="text-xs text-gray-500 mb-3">Escolha o tamanho ideal para sua necessidade</p>
          <div className="grid grid-cols-5 gap-1.5">
            {plans.map((p) => {
              const active = selectedPlan === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlan(p.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-xl border-2 px-1 py-3 transition-all active:scale-[0.97]",
                    active
                      ? "border-emerald-600 bg-emerald-50 shadow-md shadow-emerald-600/10"
                      : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30"
                  )}
                >
                  {p.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-sm">
                      Mais escolhido
                    </span>
                  )}
                  <span className={cn("text-sm font-black", active ? "text-emerald-700" : "text-gray-900")}>
                    {p.short}
                  </span>
                  <span className={cn("text-[10px] font-semibold mt-0.5", active ? "text-emerald-600" : "text-gray-500")}>
                    {formatCurrency(p.price).replace(",00", "").replace("R$\u00a0", "R$")}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">1</span>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Seus dados</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div data-field="nome">
              <Label className="text-xs font-semibold text-gray-700">Nome completo</Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="mt-1 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-400"
              />
              {errors.nome && <p className="text-xs text-red-600 mt-1">{errors.nome}</p>}
            </div>
            <div data-field="telefone">
              <Label className="text-xs font-semibold text-gray-700">WhatsApp</Label>
              <Input
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                inputMode="tel"
                className="mt-1 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-400"
              />
              {errors.telefone && <p className="text-xs text-red-600 mt-1">{errors.telefone}</p>}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">2</span>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Endereço de entrega</h2>
          </div>
          <div data-field="cep">
            <Label className="text-xs font-semibold text-gray-700">CEP</Label>
            <div className="relative mt-1">
              <Input
                value={cep}
                onChange={(e) => handleCepChange(e.target.value)}
                placeholder="00000-000"
                inputMode="numeric"
                maxLength={9}
                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-400 pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {cepLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                {!cepLoading && cepFound && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                {!cepLoading && cepError && <XCircle className="h-4 w-4 text-red-500" />}
              </div>
            </div>
            {errors.cep && <p className="text-xs text-red-600 mt-1">{errors.cep}</p>}
            {cepError && <p className="text-xs text-red-600 mt-1">CEP não localizado</p>}
          </div>

          {cepFound && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{logradouro}, {bairro} – {localidade}/{uf}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div data-field="numero" className="col-span-1">
                  <Label className="text-xs font-semibold text-gray-700">Número</Label>
                  <Input
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="123"
                    inputMode="numeric"
                    className="mt-1 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-400"
                  />
                  {errors.numero && <p className="text-xs text-red-600 mt-1">{errors.numero}</p>}
                </div>
                <div className="col-span-2">
                  <Label className="text-xs font-semibold text-gray-700">Complemento <span className="font-normal text-gray-400">(opcional)</span></Label>
                  <Input
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    placeholder="Apto, bloco..."
                    className="mt-1 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">3</span>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Agendamento da entrega</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 ml-8">Escolha o melhor horário para receber</p>
          </div>
          <div data-field="data">
            <Label className="text-xs font-semibold text-gray-700">Data</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "mt-1 w-full justify-start text-left font-medium h-12 bg-gray-50 border-gray-200 hover:bg-white hover:border-emerald-400",
                    !scheduledDate && "text-gray-400 font-normal"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                  {scheduledDate ? format(scheduledDate, "PPP", { locale: ptBR }) : "Escolher data de entrega"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={(d) => { setScheduledDate(d); setCalendarOpen(false); }}
                  disabled={(date) => date < minDate || date > maxDate}
                  locale={ptBR}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {errors.data && <p className="text-xs text-red-600 mt-1">{errors.data}</p>}
          </div>
          <div data-field="slot">
            <Label className="text-xs font-semibold text-gray-700">Horário</Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-1">
              {slotDefs.map(({ label, startHour, endHour }) => {
                const active = scheduledSlot === label;
                const disabled = isSlotDisabled(startHour, endHour);
                return (
                  <button
                    key={label}
                    type="button"
                    disabled={disabled}
                    onClick={() => setScheduledSlot(label)}
                    title={disabled ? "Horário indisponível para hoje" : undefined}
                    className={cn(
                      "rounded-lg border-2 px-2 py-2.5 text-[11px] font-bold transition-all active:scale-[0.97]",
                      disabled
                        ? "border-gray-100 bg-gray-50 text-gray-300 line-through cursor-not-allowed"
                        : active
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "border-gray-200 bg-white text-gray-700 hover:border-emerald-400 hover:bg-emerald-50/40"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {scheduledSlot && (
              <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                Horário selecionado: {scheduledSlot}
              </p>
            )}
            {errors.slot && <p className="text-xs text-red-600 mt-1">{errors.slot}</p>}
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gray-900">Precisa de nota fiscal?</p>
              <p className="text-[11px] text-gray-500">Opcional</p>
            </div>
            <Switch checked={nfEnabled} onCheckedChange={setNfEnabled} />
          </div>
          {nfEnabled && (
            <div className="space-y-2 pt-1">
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                {(["cpf", "cnpj"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setNfDocType(t); setNfDoc(""); }}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                      nfDocType === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    )}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
              <Input
                value={nfDoc}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  if (nfDocType === "cpf") {
                    setNfDoc(formatCpf(raw.slice(0, 11)));
                  } else {
                    const d = raw.slice(0, 14);
                    const f = d
                      .replace(/^(\d{2})(\d)/, "$1.$2")
                      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                      .replace(/\.(\d{3})(\d)/, ".$1/$2")
                      .replace(/(\d{4})(\d)/, "$1-$2");
                    setNfDoc(f);
                  }
                }}
                placeholder={nfDocType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
                inputMode="numeric"
                className="bg-gray-50 border-gray-200 max-w-xs"
              />
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 pb-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">4</span>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Forma de pagamento</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all",
                  paymentMethod === "pix"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <img src={pixLogo} alt="" className="h-4 w-4" />
                PIX
                {paymentMethod === "pix" && (
                  <span className="hidden sm:inline ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700">
                    Instantâneo
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("cartao")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all",
                  paymentMethod === "cartao"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <CreditCard className="h-4 w-4" />
                Cartão
                <span className="hidden sm:inline ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-700">
                  +5%
                </span>
              </button>
            </div>
          </div>

          <div className="p-5">
            {paymentMethod === "pix" && paymentStatus === "idle" && (
              <div className="space-y-3">
                <Button
                  onClick={handleGeneratePix}
                  className="w-full h-14 text-base font-extrabold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Finalizar pedido via PIX
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <p className="text-center text-xs text-gray-500 font-medium">
                  Entrega em até 2h após confirmação
                </p>
              </div>
            )}

            {paymentMethod === "pix" && paymentStatus === "loading" && (
              <div className="flex flex-col items-center py-10 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-sm font-semibold text-gray-700">Gerando PIX seguro...</p>
              </div>
            )}

            {paymentMethod === "pix" && paymentStatus === "generated" && (
              <div id="pix-result" className="space-y-4 animate-in fade-in duration-300">
                <div className="flex flex-col items-center bg-gray-50 rounded-xl p-5 border border-gray-200">
                  {qrIsImg ? (
                    <img src={qrDisplay} alt="QR Code PIX" className="h-44 w-44 rounded-lg" />
                  ) : (
                    <div className="bg-white p-3 rounded-lg">
                      <QRCodeSVG value={getSafeQrValue(qrDisplay, pixCode)} size={176} level="M" />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-3">Escaneie com o app do seu banco</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-700">PIX Copia e Cola</Label>
                  <p className="text-[11px] text-gray-500 mt-0.5">Toque no código ou no botão para copiar</p>
                  <div className="mt-1.5 flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="flex-1 min-w-0 text-left bg-gray-50 border border-gray-200 rounded-md px-3 py-2 font-mono text-xs text-gray-700 truncate hover:bg-gray-100 transition-colors"
                      title="Clique para copiar"
                    >
                      {pixCode}
                    </button>
                    <Button
                      onClick={handleCopyPix}
                      variant="outline"
                      className={`shrink-0 transition-all ${
                        copyToast
                          ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-600 hover:text-white"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {copyToast ? (
                        <><CheckCircle className="h-4 w-4 mr-1" /> Código copiado</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-1" /> Copiar</>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Aguardando confirmação automática...
                </div>
              </div>
            )}

            {paymentMethod === "pix" && paymentStatus === "confirmed" && (
              <div className="flex flex-col items-center py-8 gap-3 animate-in fade-in zoom-in duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
                <p className="text-lg font-bold text-gray-900">Pagamento confirmado!</p>
                <p className="text-sm text-gray-500">Redirecionando...</p>
              </div>
            )}

            {paymentMethod === "cartao" && (
              <CardPaymentForm
                totalPrice={totalPrice}
                formatCurrency={formatCurrency}
                customerName={nome}
                customerPhone={telefone}
                planId={selectedPlan}
                planLabel={currentPlan.label}
                quantity={1}
                coupon={null}
                address={fullAddress}
                onSuccess={handleCardSuccess}
                onFailure={handleCardFailure}
                onSwitchToPix={() => setPaymentMethod("pix")}
              />
            )}
          </div>
        </section>

      </div>
    </main>
  );
};

export default Agendar;
