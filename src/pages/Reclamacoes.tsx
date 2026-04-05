import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Upload, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import logoAmba from "@/assets/logo-nortex.png";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Reclamacoes = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  if (submitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Reclamação Enviada</h2>
            <p className="text-sm text-muted-foreground">
              Recebemos sua reclamação e ela será analisada pela nossa equipe. Entraremos em contato pelo e-mail informado.
            </p>
            <Link to="/">
              <Button variant="outline" className="mt-2 gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar ao site
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={logoAmba} alt="NORTEX Caçambas" className="mx-auto mb-4 h-14 w-auto" />
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-sm font-bold text-destructive">Canal de Reclamações</span>
          </div>
          <h1 className="text-2xl font-black text-foreground">Abrir Chamado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Preencha o formulário abaixo para registrar sua reclamação. Nossa equipe analisará o mais breve possível.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Nome Completo <span className="text-destructive">*</span></Label>
                <Input
                  id="fullName"
                  placeholder="Digite seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Descrição do Motivo <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Descreva detalhadamente o motivo da sua reclamação..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={2000}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{description.length}/2000</p>
              </div>

              <div className="space-y-1.5">
                <Label>Comprovante (opcional)</Label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-4 transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    {file ? (
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Clique para selecionar uma imagem ou PDF</p>
                    )}
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <Button type="submit" className="w-full gap-2" size="lg" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                Enviar Reclamação
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Suas informações são tratadas com sigilo. Responderemos em até 48 horas úteis.
        </p>
      </div>
    </main>
  );
};

export default Reclamacoes;
