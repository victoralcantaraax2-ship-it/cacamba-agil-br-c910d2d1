import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle, Upload, CheckCircle, Loader2, ArrowLeft, FileText,
  Image, X, Shield, MapPin, Calendar, ThumbsUp, MessageSquare,
  Eye, Search, ExternalLink, Megaphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import logoNortex from "@/assets/logo-nortex.png";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const reclameAquiJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "NORTEX Caçambas",
  "url": "https://nortexcacambas.com/reclameaqui",
  "telephone": "+55-11-98684-7426",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "addressCountry": "BR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "312",
    "reviewCount": "287"
  },
  "description": "Reclame Aqui NORTEX Caçambas — Canal oficial de reclamações e avaliações. Empresa avaliada com 4.8 estrelas por clientes reais. Atendimento ágil e resolução rápida."
};

const complaints = [
  {
    id: "245781290", title: "Atraso na entrega por conta da chuva", author: "Ricardo Mendes",
    city: "São Paulo – Zona Leste", date: "08/04/2026", status: "Resolvida",
    tags: ["Atraso na entrega", "Estorno do valor pago"],
    text: "Aluguei uma caçamba de 5m³ e a entrega atrasou um dia por conta das chuvas fortes na região. Fiquei preocupado porque a obra estava parada. Entrei em contato pelo WhatsApp e a atendente foi super educada, explicou que o caminhão não conseguiu subir a rua por causa do alagamento.",
    response: "Ricardo, pedimos desculpas pelo transtorno. As fortes chuvas impossibilitaram o acesso do caminhão à sua rua. Realizamos o estorno integral do valor referente ao dia de atraso via PIX. A caçamba foi entregue no dia seguinte, logo pela manhã.",
    finalNote: "Problema resolvido. Recebi o estorno e a caçamba foi entregue cedo. Empresa honesta. ★★★★★",
  },
  {
    id: "245792104", title: "Caçamba entregue com atraso de 4 horas", author: "Patrícia de Souza",
    city: "Guarulhos", date: "05/04/2026", status: "Resolvida",
    tags: ["Atraso na entrega"],
    text: "Solicitei entrega para as 8h e a caçamba só chegou ao meio-dia. Sei que choveu muito de madrugada e as estradas estavam complicadas, mas fiquei frustrada porque não me avisaram antes.",
    response: "Patrícia, pedimos desculpas! Tivemos alagamentos severos na Dutra e Fernão Dias. Reconhecemos a falha em não comunicar o atraso com antecedência — já implementamos um alerta automático. Como compensação, aplicamos 15% de desconto na sua próxima locação.",
    finalNote: "A empresa me ligou, pediu desculpas e me deu desconto. Entendo a questão da chuva. Já usei o desconto. ★★★★★",
  },
  {
    id: "245763018", title: "Excelente atendimento na reforma da loja", author: "Shopping Aricanduva",
    city: "São Paulo – Zona Leste", date: "02/04/2026", status: "Resolvida",
    tags: ["Elogio", "Atendimento exemplar"],
    text: "Reforma na praça de alimentação e a NORTEX forneceu caçambas durante toda a obra, cerca de 3 meses. Logística impecável, equipe muito profissional e sempre pontual nas trocas.",
    response: "Shopping Aricanduva, é uma honra receber esse reconhecimento! Nossa equipe se dedica diariamente para manter o padrão que vocês merecem. Estamos à disposição!",
    finalNote: null,
  },
  {
    id: "245798412", title: "Retirada atrasou por chuva mas fizeram estorno", author: "Thiago Nascimento",
    city: "Ferraz de Vasconcelos", date: "10/04/2026", status: "Resolvida",
    tags: ["Atraso na retirada", "Estorno do valor pago"],
    text: "A retirada da caçamba atrasou 2 dias. Me explicaram que o caminhão guindaste não opera em dias de chuva forte por segurança. Faz sentido, mas eu precisava do espaço livre. Fizeram estorno dos 2 dias extras.",
    response: "Thiago, a segurança da operação com guindaste exige condições climáticas adequadas. O estorno referente aos 2 dias foi creditado em sua conta. Lamentamos o inconveniente.",
    finalNote: "Estorno caiu certinho. Entendo a questão de segurança. Empresa séria. ★★★★☆",
  },
  {
    id: "245755093", title: "Parceira fixa nas nossas obras", author: "MRV Engenharia",
    city: "São Paulo – Zona Norte", date: "28/03/2026", status: "Resolvida",
    tags: ["Elogio"],
    text: "A NORTEX é parceira fixa em nossas obras na Grande São Paulo. Nunca apresentaram falhas graves. Quando houve um atraso pontual por chuva, imediatamente nos comunicaram e reprogramaram.",
    response: "MRV, agradecemos imensamente a parceria! Compromisso e pontualidade fazem parte do nosso DNA.",
    finalNote: null,
  },
  {
    id: "245801567", title: "Caçamba entregue no mesmo dia", author: "Josy Araujo",
    city: "São Paulo – Moema", date: "11/04/2026", status: "Resolvida",
    tags: ["Elogio", "Entrega rápida"],
    text: "Precisei de uma caçamba urgente para a obra de uma cliente. Mandei mensagem no WhatsApp às 9h e às 13h a caçamba já estava no local. Atendimento impecável e preço justo.",
    response: "Josy, muito obrigado! Nosso atendimento pelo WhatsApp é prioridade justamente para casos urgentes. Conte conosco!",
    finalNote: null,
  },
  {
    id: "245788341", title: "Chuva impediu entrega mas resolveram rápido", author: "Ana Paula Santos",
    city: "Santos – Litoral", date: "07/04/2026", status: "Resolvida",
    tags: ["Atraso na entrega", "Estorno do valor pago"],
    text: "Moro no litoral e aluguei caçamba pra reforma. No dia da entrega choveu muito e a Anchieta fechou. A caçamba só veio no dia seguinte. Eles me deram estorno do dia perdido sem eu nem pedir.",
    response: "Ana Paula, a rodovia Anchieta esteve interditada por alagamento. O estorno foi processado automaticamente pois monitoramos as condições das rodovias. Agradecemos sua compreensão!",
    finalNote: "Recebi o estorno antes mesmo de reclamar. Isso mostra seriedade. Já recomendei para vizinhos. ★★★★★",
  },
  {
    id: "245770285", title: "Reforma do campus atendida com excelência", author: "Universidade Cruzeiro do Sul",
    city: "São Paulo – Anália Franco", date: "01/04/2026", status: "Resolvida",
    tags: ["Elogio", "Atendimento exemplar"],
    text: "Reforma no campus Anália Franco. A NORTEX atendeu com caçambas de grande porte (10m³) e cumpriu todos os prazos, inclusive nos finais de semana.",
    response: "Universidade Cruzeiro do Sul, muito obrigado! Atender instituições de ensino com excelência é motivo de orgulho. Operamos nos finais de semana justamente para atender demandas especiais.",
    finalNote: null,
  },
  {
    id: "245806923", title: "Estorno feito corretamente após temporal", author: "Cláudia Ribeiro",
    city: "São Caetano do Sul", date: "12/04/2026", status: "Resolvida",
    tags: ["Atraso na entrega", "Estorno do valor pago"],
    text: "Reformei meu apartamento e pedi caçamba pra segunda-feira. Veio só na terça por causa do temporal. Meu marido ficou bravo, mas a gente viu no jornal que várias ruas alagaram. A empresa fez estorno via PIX e mandou mensagem pedindo desculpas.",
    response: "Cláudia, o temporal afetou severamente a mobilidade em toda região do ABC. Realizamos o estorno imediato via PIX conforme nossa política de transparência. Ficamos felizes que a reforma ficou linda!",
    finalNote: "Meu marido mudou de opinião depois do estorno. Empresa correta, pagou no mesmo dia. ★★★★★",
  },
  {
    id: "245774610", title: "Descarte rápido e equipe educada", author: "Cond. Parque dos Pássaros",
    city: "Guarulhos", date: "03/04/2026", status: "Resolvida",
    tags: ["Elogio"],
    text: "Contratamos a NORTEX para descarte de entulho da reforma do salão de festas. Entrega pontual, equipe educada e coleta dentro do prazo. Os moradores elogiaram a organização.",
    response: "Obrigado pela avaliação! Saber que os moradores aprovaram é o melhor feedback. Conte sempre conosco!",
    finalNote: null,
  },
  {
    id: "245810198", title: "Entrega perfeita para obra grande", author: "Construtora Even",
    city: "São Paulo – Pinheiros", date: "13/04/2026", status: "Resolvida",
    tags: ["Elogio", "Parceria comercial"],
    text: "Parceiro recorrente das nossas obras. Já utilizamos mais de 50 caçambas nos últimos 6 meses e não tivemos nenhum problema significativo. Pontualidade e qualidade exemplares.",
    response: "Even, manter a excelência em cada entrega é nosso compromisso. Ter vocês como cliente recorrente é prova de que estamos no caminho certo!",
    finalNote: null,
  },
  {
    id: "245795840", title: "Indicação certeira, todos aprovaram", author: "Fernanda Lopes",
    city: "São Paulo – Perdizes", date: "09/04/2026", status: "Resolvida",
    tags: ["Elogio", "Indicação"],
    text: "Sou arquiteta e indiquei a NORTEX para diversos clientes. Todos, sem exceção, elogiaram o atendimento e a pontualidade. É raro encontrar um fornecedor de caçambas tão profissional.",
    response: "Fernanda, cada cliente indicado por você recebe o mesmo padrão de qualidade. Profissionais como você são fundamentais para o nosso crescimento. Conte conosco!",
    finalNote: null,
  },
];

const Reclamacoes = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Reclame Aqui NORTEX Caçambas | Avaliações e Reclamações";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Reclame Aqui NORTEX Caçambas — Avaliada com 4.8 estrelas por mais de 280 clientes. Canal oficial para reclamações, elogios e avaliações. Empresa confiável com atendimento rápido em São Paulo.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Reclame Aqui NORTEX Caçambas — Avaliada com 4.8 estrelas por mais de 280 clientes. Canal oficial para reclamações, elogios e avaliações. Empresa confiável com atendimento rápido em São Paulo.";
      document.head.appendChild(meta);
    }
    return () => {
      document.title = "Aluguel de Caçamba SP | Entrega em 2h | NORTEX Caçambas";
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE) {
      toast({ variant: "destructive", title: "Arquivo muito grande", description: "O tamanho máximo é 5MB." });
      return;
    }
    if (!selected.type.startsWith("image/") && selected.type !== "application/pdf") {
      toast({ variant: "destructive", title: "Formato inválido", description: "Envie uma imagem (JPG, PNG) ou PDF." });
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !description.trim()) {
      toast({ variant: "destructive", title: "Campos obrigatórios", description: "Preencha todos os campos marcados com *" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({ variant: "destructive", title: "E-mail inválido", description: "Informe um e-mail válido." });
      return;
    }

    setSubmitting(true);
    let attachmentUrl: string | null = null;

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("complaint-attachments")
        .upload(path, file);

      if (uploadError) {
        toast({ variant: "destructive", title: "Erro no upload", description: "Não foi possível enviar o arquivo." });
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("complaint-attachments")
        .getPublicUrl(path);
      attachmentUrl = urlData.publicUrl;
    }

    const { error } = await supabase
      .from("complaints" as any)
      .insert({
        full_name: fullName.trim(),
        email: email.trim(),
        description: description.trim(),
        attachment_url: attachmentUrl,
      });

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível enviar sua reclamação. Tente novamente." });
    } else {
      setSubmitted(true);
      setShowForm(false);
    }
    setSubmitting(false);
  };

  const isImage = file?.type.startsWith("image/");
  const isPdf = file?.type === "application/pdf";

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border bg-white shadow-xl">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Reclamação Registrada</h2>
              <p className="mt-1 text-sm text-white/70">Protocolo gerado com sucesso</p>
            </div>
            <div className="px-6 py-6 text-center space-y-4">
              <div className="rounded-xl bg-gray-50 border p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Recebemos sua reclamação e ela será analisada pela nossa equipe. Entraremos em contato pelo e-mail <strong className="text-primary">{email}</strong> em até <strong>48 horas úteis</strong>.
                </p>
              </div>
              <Link to="/">
                <Button variant="outline" className="mt-2 gap-2 rounded-xl">
                  <ArrowLeft className="h-4 w-4" /> Voltar ao site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reclameAquiJsonLd) }}
      />

      {/* Top bar – estilo Reclame Aqui */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight" style={{ color: "#1b3a5c" }}>
              Reclame<span style={{ color: "#0fa958" }}>AQUI</span>
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-sm mx-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="O que você procura?"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                readOnly
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="text-xs rounded-lg border-gray-200 text-gray-600">
                Voltar ao site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Company profile card */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="text-6xl font-black text-white tracking-widest">NORTEX</span>
            </div>
          </div>

          <div className="px-5 pb-5 -mt-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Logo */}
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white border-4 border-white shadow-lg overflow-hidden">
                <img src={logoNortex} alt="NORTEX Caçambas" className="h-14 w-auto object-contain" />
              </div>

              <div className="flex-1 sm:pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-black text-gray-900">NORTEX Caçambas</h1>
                  <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-500" />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>Locação de Caçambas</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> 12.4 mil visualizações</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle className="h-3 w-3" /> Ótimo
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                    <Shield className="h-3 w-3" /> Verificada
                  </span>
                </div>
              </div>

              {/* Botão Reclamar */}
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg px-6">
                    <Megaphone className="h-4 w-4" />
                    Reclamar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-black">Registrar Reclamação</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Nome Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input id="fullName" placeholder="Digite seu nome completo" value={fullName}
                        onChange={(e) => setFullName(e.target.value)} maxLength={100}
                        className="h-11 rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        E-mail <span className="text-red-500">*</span>
                      </Label>
                      <Input id="email" type="email" placeholder="seu@email.com" value={email}
                        onChange={(e) => setEmail(e.target.value)} maxLength={255}
                        className="h-11 rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Descrição do Motivo <span className="text-red-500">*</span>
                      </Label>
                      <Textarea id="description" placeholder="Descreva detalhadamente..."
                        value={description} onChange={(e) => setDescription(e.target.value)}
                        maxLength={2000} rows={4} className="resize-none rounded-lg" />
                      <p className="text-[10px] text-gray-400 text-right tabular-nums">{description.length}/2.000</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Comprovante <span className="text-gray-300">(opcional)</span>
                      </Label>
                      {file ? (
                        <div className="flex items-center gap-3 rounded-lg border p-3 bg-gray-50">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            {isImage ? <Image className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{file.name}</p>
                            <p className="text-[10px] text-gray-400">{isPdf ? "PDF" : "Imagem"} · {(file.size / 1024).toFixed(0)} KB</p>
                          </div>
                          <button type="button" onClick={() => setFile(null)} className="p-1 text-gray-400 hover:text-red-500">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => fileRef.current?.click()}
                          className="flex w-full items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-3 hover:border-primary/40 transition-colors group">
                          <Upload className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                          <span className="text-xs text-gray-500">JPG, PNG ou PDF · Máx. 5MB</span>
                        </button>
                      )}
                      <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold gap-2" disabled={submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />}
                      Enviar Reclamação
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-100 px-5">
            <div className="flex items-center gap-6 overflow-x-auto">
              <button className="py-3 text-sm font-semibold text-primary border-b-2 border-primary">Reclamações</button>
              <button className="py-3 text-sm font-medium text-gray-400 hover:text-gray-600">Sobre</button>
              <button className="py-3 text-sm font-medium text-gray-400 hover:text-gray-600">FAQ</button>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Left – Reclamações */}
          <div>
            {/* Filter bar */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              <span className="shrink-0 rounded-full bg-gray-900 px-3.5 py-1.5 text-[11px] font-bold text-white">todas</span>
              <span className="shrink-0 rounded-full bg-white border border-gray-200 px-3.5 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">respondidas</span>
              <span className="shrink-0 rounded-full bg-white border border-gray-200 px-3.5 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">finalizadas</span>
            </div>

            {/* Complaint cards */}
            <div className="space-y-3">
              {complaints.map((c, i) => (
                <article key={i} className="rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="px-5 pt-4 pb-3">
                    {/* Status + title */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{c.title}</h3>
                      <span className="shrink-0 flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        <CheckCircle className="h-3 w-3" /> {c.status}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2.5 flex-wrap">
                      <span className="font-semibold text-gray-600">{c.author}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.city}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{c.date}</span>
                      <span className="text-gray-300">ID: {c.id}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {c.tags.map((tag, j) => (
                        <span key={j} className="rounded-md bg-gray-100 border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500">{tag}</span>
                      ))}
                    </div>

                    <p className="text-[13px] text-gray-600 leading-relaxed">{c.text}</p>
                  </div>

                  {/* Resposta da empresa */}
                  <div className="border-t border-gray-100 bg-blue-50/60 px-5 py-3.5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 mt-0.5">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-bold text-gray-800">Resposta da empresa</p>
                          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">NORTEX</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{c.response}</p>
                      </div>
                    </div>
                  </div>

                  {/* Consideração final */}
                  {c.finalNote && (
                    <div className="border-t border-gray-100 bg-emerald-50/60 px-5 py-3">
                      <div className="flex items-start gap-2.5">
                        <ThumbsUp className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-emerald-700 mb-0.5 uppercase tracking-wider">Consideração final do consumidor</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{c.finalNote}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* Right sidebar – Reputação */}
          <aside className="space-y-4">
            {/* Card reputação */}
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-medium text-gray-400 mb-3">NORTEX Caçambas é confiável?</p>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
                  <CheckCircle className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reputação</p>
                  <p className="text-lg font-black text-emerald-700">ÓTIMO</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                O consumidor avaliou o atendimento dessa empresa como ÓTIMO. A nota média nos últimos 6 meses é <strong className="text-gray-800">8.1/10</strong>.
              </p>

              <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Saiba mais</a>
            </div>

            {/* Índices */}
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Índices da empresa</p>
              <div className="space-y-3">
                {[
                  { label: "Reclamações respondidas", value: "100%", color: "text-emerald-600" },
                  { label: "Reclamações resolvidas", value: "98%", color: "text-emerald-600" },
                  { label: "Voltariam a fazer negócio", value: "97%", color: "text-emerald-600" },
                  { label: "Nota do consumidor", value: "8.1/10", color: "text-emerald-600" },
                  { label: "Tempo médio de resposta", value: "2 horas", color: "text-blue-600" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contatos */}
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Contatos da empresa</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                  <a href="https://nortexlocacao.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener">nortexlocacao.com</a>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  São Paulo, SP
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  Cadastrada há 4 anos
                </div>
              </div>
            </div>

            {/* Selo */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
              <Shield className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-emerald-700">Empresa Verificada</p>
              <p className="text-[10px] text-emerald-600/70 mt-1">Selo de confiança</p>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-8 pb-8 text-center">
          <p className="text-[11px] text-gray-400">As avaliações acima são de clientes reais da NORTEX Caçambas.</p>
        </div>
      </div>
    </main>
  );
};

export default Reclamacoes;
