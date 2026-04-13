import { memo } from "react";
import { CheckCircle, ShieldCheck, Clock, MessageCircle, CreditCard, Truck } from "lucide-react";

const items = [
  {
    icon: Clock,
    title: "Resposta em minutos",
    desc: "Mandou mensagem, a gente já responde. Nada de ficar esperando.",
  },
  {
    icon: Truck,
    title: "Entrega no horário",
    desc: "Combinou? A caçamba chega na hora. Sua obra não para.",
  },
  {
    icon: ShieldCheck,
    title: "Sem taxa escondida",
    desc: "O preço que a gente passa é o preço final. Ponto.",
  },
  {
    icon: MessageCircle,
    title: "Fala direto com a gente",
    desc: "Atendimento real pelo WhatsApp. Sem robô, sem espera.",
  },
  {
    icon: CreditCard,
    title: "Pagamento fácil",
    desc: "Pix, cartão, boleto... do jeito que for melhor pra você.",
  },
  {
    icon: CheckCircle,
    title: "Tudo legalizado",
    desc: "Entulho vai pra lugar certo, com descarte regularizado.",
  },
];


const ConfiancaSection = memo(() => {
  return (
    <section id="confianca" className="bg-background py-10 md:py-16">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">
            Por que o pessoal confia na NORTEX?
          </h2>
          <p className="text-muted-foreground">
            Empresa séria, atendimento direto e entrega garantida.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 rounded-xl border border-border bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-card-foreground">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ConfiancaSection.displayName = "ConfiancaSection";

export default ConfiancaSection;
