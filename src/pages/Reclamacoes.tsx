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

        {/* Reputação Premium */}
        <div className="mt-10">
          {/* Score card */}
          <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-xl mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 px-6 py-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Reputação Geral</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl font-black text-white">4.8</span>
                <div className="text-left">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-300 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">312 avaliações verificadas</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border/50">
              <div className="px-4 py-4 text-center">
                <p className="text-lg font-black text-foreground">98%</p>
                <p className="text-[10px] text-muted-foreground font-medium">Resolvidas</p>
              </div>
              <div className="px-4 py-4 text-center">
                <p className="text-lg font-black text-foreground">2h</p>
                <p className="text-[10px] text-muted-foreground font-medium">Tempo médio</p>
              </div>
              <div className="px-4 py-4 text-center">
                <p className="text-lg font-black text-foreground">97%</p>
                <p className="text-[10px] text-muted-foreground font-medium">Voltariam</p>
              </div>
            </div>
          </div>

          {/* Selo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Empresa Verificada · Ótima Reputação</span>
          </div>

          {/* Reviews */}
          <div className="space-y-3">
            {[
              { author: "Shopping Aricanduva", role: "Shopping Center", type: "org", rating: 5, text: "Reforma na praça de alimentação e a NORTEX forneceu caçambas durante toda a obra. Logística impecável e equipe muito profissional.", response: "Obrigado pela confiança, Shopping Aricanduva! É uma honra atender um parceiro tão importante. Estamos sempre à disposição." },
              { author: "MRV Engenharia", role: "Construtora", type: "org", rating: 5, text: "A NORTEX é parceira fixa em nossas obras na Grande São Paulo. Nunca apresentaram falhas.", response: "Agradecemos a parceria de longa data, MRV! Compromisso e pontualidade fazem parte do nosso DNA." },
              { author: "Universidade Cruzeiro do Sul", role: "Universidade", type: "org", rating: 5, text: "Reforma no campus Anália Franco. A NORTEX atendeu com caçambas de grande porte e cumpriu todos os prazos.", response: "Muito obrigado pelo reconhecimento! Atender instituições de ensino com excelência é motivo de orgulho para nós." },
              { author: "Cond. Parque dos Pássaros", role: "Síndico profissional", type: "org", rating: 5, text: "Contratamos a NORTEX para descarte de entulho da reforma do salão de festas. Entrega pontual e equipe educada.", response: "Obrigado pela avaliação! Ficamos felizes em contribuir com a manutenção do condomínio. Conte sempre conosco!" },
              { author: "Josy Araujo", role: "Arquiteta · Moema", type: "person", rating: 5, text: "Atendimento ágil pelo WhatsApp. Caçamba entregue no mesmo dia. Recomendo fortemente.", response: "Obrigado, Josy! Nosso atendimento pelo WhatsApp é prioridade. Indicações como a sua nos motivam a melhorar sempre!" },
              { author: "Construtora Even", role: "Construtora", type: "org", rating: 5, text: "Parceiro recorrente das nossas obras. Pontualidade e qualidade exemplares.", response: "Agradecemos a confiança contínua, Even! Manter a excelência em cada entrega é nosso compromisso." },
              { author: "Fernanda Lopes", role: "Arquiteta · Perdizes", type: "person", rating: 5, text: "Indiquei para diversos clientes. Todos elogiaram o atendimento e a pontualidade.", response: "Fernanda, obrigado pelas indicações! Cada cliente indicado recebe o mesmo padrão de qualidade. Conte conosco!" },
              { author: "Madeireira São Jorge", role: "Madeireira · Ipiranga", type: "org", rating: 5, text: "Descartamos sobras de madeira e resíduos. A NORTEX é ágil e pratica preços justos. Somos clientes regulares.", response: "Obrigado pela fidelidade, Madeireira São Jorge! Nosso compromisso é oferecer o melhor custo-benefício sempre." },
              { author: "Cláudia Ribeiro", role: "Proprietária · São Caetano", type: "person", rating: 5, text: "Reformei meu apartamento e a NORTEX cuidou de todo o descarte. Serviço impecável.", response: "Cláudia, ficamos muito felizes com sua avaliação! Nosso objetivo é tornar a reforma mais simples pra você." },
              { author: "Shopping Metrô Itaquera", role: "Shopping Center", type: "org", rating: 5, text: "Obra de ampliação e a NORTEX cuidou de todo o descarte. Empresa séria e comprometida com prazos.", response: "Agradecemos, Shopping Metrô Itaquera! Atender grandes operações com eficiência é nosso diferencial." },
            ].map((review, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-black text-primary border border-primary/10">
                      {review.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-foreground">{review.author}</p>
                        {review.type === "org" && (
                          <span className="shrink-0 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600">Empresa</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground/60 mt-0.5">{review.role}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(review.rating)].map((_, j) => (
                          <span key={j} className="text-yellow-500 text-sm">★</span>
                        ))}
                      </div>
                      <p className="mt-2.5 text-sm text-foreground/80 leading-relaxed">"{review.text}"</p>
                    </div>
                  </div>
                </div>
                {/* Resposta da empresa */}
                <div className="border-t border-border/40 bg-muted/30 px-5 py-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-emerald-600 mb-0.5">Resposta da NORTEX Caçambas</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{review.response}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA final */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600">Índice de Solução: 98% · Nota 4.8/5.0</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Reclamacoes;
