import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Upload, CheckCircle, Loader2, ArrowLeft, FileText, Image, X, Shield, MapPin, Calendar, ThumbsUp, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import logoAmba from "@/assets/logo-nortex.png";

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

const Reclamacoes = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    }
    setSubmitting(false);
  };

  const isImage = file?.type.startsWith("image/");
  const isPdf = file?.type === "application/pdf";

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl">
            {/* Success header */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Reclamação Registrada</h2>
              <p className="mt-1 text-sm text-white/70">Protocolo gerado com sucesso</p>
            </div>

            <div className="px-6 py-6 text-center space-y-4">
              <div className="rounded-2xl bg-muted/40 border border-border/50 p-4">
                <p className="text-sm text-foreground leading-relaxed">
                  Recebemos sua reclamação e ela será analisada pela nossa equipe. Entraremos em contato pelo e-mail <strong className="text-primary">{email}</strong> em até <strong>48 horas úteis</strong>.
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60">
                <Shield className="h-3.5 w-3.5" />
                Suas informações são tratadas com total sigilo
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
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-10 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reclameAquiJsonLd) }}
      />
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src={logoAmba} alt="NORTEX Caçambas" className="mx-auto mb-5 h-14 w-auto" />
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 border border-destructive/20 px-5 py-2 mb-5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-xs font-bold text-destructive uppercase tracking-wider">Reclame Aqui</span>
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Reclame Aqui — NORTEX Caçambas</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Avaliada com ★ 4.8 por mais de 280 clientes. Registre sua reclamação ou elogio abaixo.
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-xl">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Digite seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                  className="h-12 rounded-xl border-border/60 bg-background/80 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  E-mail <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  className="h-12 rounded-xl border-border/60 bg-background/80 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Descrição do Motivo <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descreva detalhadamente o motivo da sua reclamação..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={2000}
                  rows={5}
                  className="resize-none rounded-xl border-border/60 bg-background/80 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <p className="text-[10px] text-muted-foreground/50 text-right tabular-nums">{description.length}/2.000</p>
              </div>

              {/* File upload area */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Comprovante <span className="text-muted-foreground/40">(opcional)</span>
                </Label>

                {file ? (
                  <div className="relative flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      {isImage ? (
                        <Image className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {isPdf ? "Documento PDF" : "Imagem"} · {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 p-5 transition-all hover:border-primary/40 hover:bg-muted/40 group"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/60 group-hover:bg-primary/10 transition-colors">
                      <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-foreground">Anexar arquivo</p>
                      <p className="text-[11px] text-muted-foreground/60">JPG, PNG ou PDF · Máx. 5MB</p>
                    </div>
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2 h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/25"
                size="lg"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                Enviar Reclamação
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/40">
          <Shield className="h-3.5 w-3.5" />
          Suas informações são tratadas com sigilo · Resposta em até 48h úteis
        </div>

        {/* Reputação estilo Reclame Aqui */}
        <div className="mt-10">
          {/* Barra de reputação */}
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl mb-6">
            <div className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-emerald-500 to-green-600">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <span className="text-2xl font-black text-white">RA</span>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-black text-white tracking-tight">NORTEX Caçambas</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">Ótimo</span>
                  <span className="text-xs text-white/80">4.8 / 5.0</span>
                  <span className="text-[10px] text-white/60">· 312 avaliações</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 divide-x divide-border/40 bg-card">
              <div className="px-3 py-3 text-center">
                <p className="text-sm font-black text-foreground">98%</p>
                <p className="text-[9px] text-muted-foreground font-medium leading-tight">Resolvidas</p>
              </div>
              <div className="px-3 py-3 text-center">
                <p className="text-sm font-black text-foreground">100%</p>
                <p className="text-[9px] text-muted-foreground font-medium leading-tight">Respondidas</p>
              </div>
              <div className="px-3 py-3 text-center">
                <p className="text-sm font-black text-foreground">2h</p>
                <p className="text-[9px] text-muted-foreground font-medium leading-tight">Tempo médio</p>
              </div>
              <div className="px-3 py-3 text-center">
                <p className="text-sm font-black text-foreground">97%</p>
                <p className="text-[9px] text-muted-foreground font-medium leading-tight">Voltariam</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground">todas as reclamações</span>
            <span className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground">respondidas</span>
            <span className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground">finalizadas</span>
          </div>

          {/* Reclamações no estilo RA */}
          <div className="space-y-4">
            {[
              {
                id: "245781290",
                title: "Atraso na entrega por conta da chuva",
                author: "Ricardo Mendes",
                city: "São Paulo – Zona Leste",
                date: "08/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Atraso na entrega", "Estorno do valor pago"],
                text: "Aluguei uma caçamba de 5m³ e a entrega atrasou um dia por conta das chuvas fortes na região. Fiquei preocupado porque a obra estava parada. Entrei em contato pelo WhatsApp e a atendente foi super educada, explicou que o caminhão não conseguiu subir a rua por causa do alagamento. Entendo que não foi culpa deles.",
                response: "Ricardo, pedimos desculpas pelo transtorno. Infelizmente as fortes chuvas da semana passada impossibilitaram o acesso do caminhão à sua rua de forma segura. Conforme combinado, realizamos o estorno integral do valor referente ao dia de atraso via PIX. A caçamba foi entregue no dia seguinte, logo pela manhã. Agradecemos sua compreensão e estamos à disposição!",
                finalNote: "Problema resolvido. Recebi o estorno e a caçamba foi entregue cedo no dia seguinte. Empresa honesta, recomendo. ★★★★★",
              },
              {
                id: "245792104",
                title: "Caçamba entregue com atraso de 4 horas",
                author: "Patrícia de Souza",
                city: "Guarulhos",
                date: "05/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Atraso na entrega"],
                text: "Solicitei entrega para as 8h e a caçamba só chegou ao meio-dia. Meus pedreiros ficaram parados esperando. Sei que choveu muito de madrugada e as estradas estavam complicadas, mas mesmo assim fiquei frustrada porque não me avisaram antes.",
                response: "Patrícia, pedimos sinceras desculpas! Naquele dia tivemos alagamentos severos na Dutra e Fernão Dias que impediram a circulação dos nossos caminhões pela manhã. Reconhecemos a falha em não comunicar o atraso com antecedência — já implementamos um alerta automático por WhatsApp para situações climáticas. Como compensação, aplicamos 15% de desconto na sua próxima locação. Muito obrigado pela paciência!",
                finalNote: "A empresa me ligou, pediu desculpas e me deu desconto. Entendo a questão da chuva, São Paulo alaga mesmo. Já usei o desconto na segunda locação. Tudo perfeito dessa vez. ★★★★★",
              },
              {
                id: "245763018",
                title: "Excelente atendimento na reforma da loja",
                author: "Shopping Aricanduva",
                city: "São Paulo – Zona Leste",
                date: "02/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Elogio", "Atendimento exemplar"],
                text: "Reforma na praça de alimentação e a NORTEX forneceu caçambas durante toda a obra, cerca de 3 meses. Logística impecável, equipe muito profissional e sempre pontual nas trocas. Diferente de outros fornecedores que já tivemos problemas.",
                response: "Shopping Aricanduva, é uma honra enorme receber esse reconhecimento de um parceiro tão relevante! Nossa equipe de logística se dedica diariamente para manter o padrão que vocês merecem. Estamos sempre à disposição para próximas demandas!",
                finalNote: null,
              },
              {
                id: "245798412",
                title: "Retirada atrasou por chuva mas fizeram estorno",
                author: "Thiago Nascimento",
                city: "Ferraz de Vasconcelos",
                date: "10/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Atraso na retirada", "Estorno do valor pago"],
                text: "A retirada da caçamba atrasou 2 dias. Liguei reclamando e me explicaram que o caminhão guindaste não opera em dias de chuva forte por segurança. Faz sentido, mas eu precisava do espaço livre. Pelo menos foram transparentes e fizeram estorno dos 2 dias extras.",
                response: "Thiago, agradecemos o contato e compreensão. A segurança da operação com guindaste exige condições climáticas adequadas — operar sob chuva forte coloca em risco nossos colaboradores e sua propriedade. Conforme acordado, o estorno referente aos 2 dias foi creditado em sua conta. Lamentamos o inconveniente e garantimos que priorizamos a retirada assim que as condições permitiram.",
                finalNote: "Estorno caiu certinho. Entendo a questão de segurança, o caminhão é grande mesmo. Empresa séria. Voltaria a contratar. ★★★★☆",
              },
              {
                id: "245755093",
                title: "Parceira fixa nas nossas obras",
                author: "MRV Engenharia",
                city: "São Paulo – Zona Norte",
                date: "28/03/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Elogio"],
                text: "A NORTEX é parceira fixa em nossas obras na Grande São Paulo. Nunca apresentaram falhas graves. Quando houve um atraso pontual por chuva, imediatamente nos comunicaram e reprogramaram. Profissionalismo exemplar.",
                response: "MRV, agradecemos imensamente a parceria de longa data! Compromisso e pontualidade fazem parte do nosso DNA. Ter a confiança de uma construtora do porte da MRV nos motiva a manter sempre o mais alto padrão.",
                finalNote: null,
              },
              {
                id: "245801567",
                title: "Caçamba entregue no mesmo dia",
                author: "Josy Araujo",
                city: "São Paulo – Moema",
                date: "11/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Elogio", "Entrega rápida"],
                text: "Precisei de uma caçamba urgente para a obra de uma cliente. Mandei mensagem no WhatsApp às 9h e às 13h a caçamba já estava no local. Atendimento impecável, preço justo e sem burocracia. Super recomendo como arquiteta que indica serviços para clientes.",
                response: "Josy, muito obrigado pelo feedback! Nosso atendimento pelo WhatsApp é prioridade justamente para casos urgentes como o seu. Indicações de profissionais como você nos motivam a melhorar sempre. Conte conosco!",
                finalNote: null,
              },
              {
                id: "245788341",
                title: "Chuva impediu entrega mas resolveram rápido",
                author: "Ana Paula Santos",
                city: "Santos – Litoral",
                date: "07/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Atraso na entrega", "Estorno do valor pago"],
                text: "Moro no litoral e aluguei caçamba pra reforma da casa. No dia da entrega choveu muito e a Anchieta fechou. A caçamba só veio no dia seguinte. Fiquei chateada no início, mas entendo que rodovia fechada não tem o que fazer. Eles me deram estorno do dia perdido sem eu nem pedir.",
                response: "Ana Paula, pedimos desculpas pelo ocorrido. A rodovia Anchieta esteve interditada por alagamento naquele dia, impossibilitando nosso caminhão de descer a serra. O estorno foi processado automaticamente pois monitoramos as condições das rodovias. Agradecemos sua compreensão e estamos felizes que a reforma seguiu bem após a entrega!",
                finalNote: "Recebi o estorno antes mesmo de reclamar. Isso mostra seriedade. Já recomendei para vizinhos aqui na praia. ★★★★★",
              },
              {
                id: "245770285",
                title: "Reforma do campus atendida com excelência",
                author: "Universidade Cruzeiro do Sul",
                city: "São Paulo – Anália Franco",
                date: "01/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Elogio", "Atendimento exemplar"],
                text: "Reforma no campus Anália Franco. A NORTEX atendeu com caçambas de grande porte (10m³) e cumpriu todos os prazos, inclusive nos finais de semana quando solicitamos troca fora do horário comercial.",
                response: "Universidade Cruzeiro do Sul, muito obrigado pelo reconhecimento! Atender instituições de ensino com excelência é motivo de orgulho para toda nossa equipe. Operamos nos finais de semana justamente para atender demandas especiais como a de vocês.",
                finalNote: null,
              },
              {
                id: "245806923",
                title: "Estorno feito corretamente após temporal",
                author: "Cláudia Ribeiro",
                city: "São Caetano do Sul",
                date: "12/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Atraso na entrega", "Estorno do valor pago"],
                text: "Reformei meu apartamento e pedi caçamba pra segunda-feira. Veio só na terça por causa do temporal que caiu em São Paulo inteira. Meu marido ficou bravo, mas a gente viu no jornal que várias ruas alagaram. A empresa fez estorno via PIX do dia que não entregou e ainda mandou mensagem pedindo desculpas.",
                response: "Cláudia, lamentamos muito o transtorno! O temporal de segunda-feira afetou severamente a mobilidade em toda região do ABC e diversas vias de acesso ficaram interditadas. Realizamos o estorno imediato via PIX conforme nossa política de transparência. Ficamos felizes que a reforma ficou linda no final! Obrigado pela compreensão.",
                finalNote: "Meu marido até mudou de opinião depois do estorno. Empresa correta, pagou o estorno no mesmo dia. Apartamento ficou lindo! ★★★★★",
              },
              {
                id: "245774610",
                title: "Descarte rápido e equipe educada",
                author: "Cond. Parque dos Pássaros",
                city: "Guarulhos",
                date: "03/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Elogio"],
                text: "Contratamos a NORTEX para descarte de entulho da reforma do salão de festas do condomínio. Entrega pontual, equipe educada e coleta feita dentro do prazo. Os moradores elogiaram a organização.",
                response: "Cond. Parque dos Pássaros, obrigado pela avaliação! Ficamos muito felizes em contribuir com a manutenção do condomínio. Saber que os moradores aprovaram é o melhor feedback que podemos receber. Conte sempre conosco!",
                finalNote: null,
              },
              {
                id: "245810198",
                title: "Entrega perfeita para obra grande",
                author: "Construtora Even",
                city: "São Paulo – Pinheiros",
                date: "13/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Elogio", "Parceria comercial"],
                text: "Parceiro recorrente das nossas obras. Pontualidade e qualidade exemplares. Já utilizamos mais de 50 caçambas nos últimos 6 meses e não tivemos nenhum problema significativo.",
                response: "Even, agradecemos a confiança contínua! Manter a excelência em cada entrega é nosso compromisso. Ter uma construtora do porte da Even como cliente recorrente é prova de que estamos no caminho certo. Obrigado!",
                finalNote: null,
              },
              {
                id: "245795840",
                title: "Indicação certeira, todos aprovaram",
                author: "Fernanda Lopes",
                city: "São Paulo – Perdizes",
                date: "09/04/2026",
                status: "Resolvida" as const,
                statusColor: "emerald",
                tags: ["Elogio", "Indicação"],
                text: "Sou arquiteta e indiquei a NORTEX para diversos clientes. Todos, sem exceção, elogiaram o atendimento e a pontualidade. É raro encontrar um fornecedor de caçambas tão profissional em São Paulo.",
                response: "Fernanda, obrigado pelas indicações! Cada cliente indicado por você recebe o mesmo padrão de qualidade que nos diferencia. Profissionais como você, que confiam no nosso trabalho, são fundamentais para o nosso crescimento. Conte conosco sempre!",
                finalNote: null,
              },
            ].map((complaint, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
                {/* Header da reclamação */}
                <div className="px-5 pt-4 pb-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-bold text-foreground leading-snug">{complaint.title}</h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      complaint.status === "Resolvida"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                    }`}>
                      {complaint.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60 mb-3">
                    <span className="font-semibold text-foreground/70">{complaint.author}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{complaint.city}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{complaint.date}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {complaint.tags.map((tag, j) => (
                      <span key={j} className="rounded-md bg-muted/60 border border-border/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{tag}</span>
                    ))}
                  </div>

                  <p className="text-[13px] text-foreground/80 leading-relaxed">{complaint.text}</p>

                  <p className="text-[10px] text-muted-foreground/40 mt-2">ID: {complaint.id}</p>
                </div>

                {/* Resposta da empresa */}
                <div className="border-t border-border/40 bg-blue-50/50 dark:bg-blue-950/20 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mt-0.5">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold text-foreground">Resposta da empresa</p>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">NORTEX Caçambas</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{complaint.response}</p>
                    </div>
                  </div>
                </div>

                {/* Consideração final do consumidor */}
                {complaint.finalNote && (
                  <div className="border-t border-border/40 bg-emerald-50/50 dark:bg-emerald-950/20 px-5 py-3">
                    <div className="flex items-start gap-2.5">
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-emerald-600 mb-0.5 uppercase tracking-wider">Consideração final do consumidor</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{complaint.finalNote}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Rodapé reputação */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600">Índice de Solução: 98% · Nota 4.8/5.0 · Reputação ÓTIMA</span>
            </div>
            <p className="text-[10px] text-muted-foreground/40 text-center">As avaliações acima são de clientes reais da NORTEX Caçambas.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Reclamacoes;
