import { CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Obrigado = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle className="h-10 w-10 text-accent" />
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
          Solicitação confirmada!
        </h1>
        <p className="mb-8 text-base text-muted-foreground">
          Nossa equipe entrará em contato em breve pelo WhatsApp.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="https://wa.me/5511987604407?text=Olá!%20Acabei%20de%20realizar%20o%20pagamento."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full gap-2 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp-hover" size="lg">
              <MessageCircle className="h-5 w-5 fill-current" />
              Falar no WhatsApp
            </Button>
          </a>
          <Button variant="outline" onClick={() => navigate("/")} size="lg">
            Voltar ao início
          </Button>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © 2021–{new Date().getFullYear()} AMBA Locação de Caçambas — Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
};

export default Obrigado;
