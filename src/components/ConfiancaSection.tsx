import { memo } from "react";
import { CheckCircle, ShieldCheck, Clock, MessageCircle, CreditCard, Truck } from "lucide-react";

const items = [
  {
    icon: Clock,
    title: "Resposta imediata",
    desc: "Nossa equipe retorna seu contato em poucos minutos, sem demora.",
  },
  {
    icon: Truck,
    title: "Entrega pontual",
    desc: "Cumprimos o horário combinado. Sua obra não sofre atrasos.",
  },
  {
    icon: ShieldCheck,
    title: "Sem taxas ocultas",
    desc: "O valor informado é o valor final. Transparência total na negociação.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento direto",
    desc: "Comunicação humanizada pelo WhatsApp, sem intermediários.",
  },
  {
    icon: CreditCard,
    title: "Pagamento facilitado",
    desc: "Pix, cartão de crédito e outras modalidades sob consulta.",
  },
  {
    icon: CheckCircle,
    title: "Descarte legalizado",
    desc: "Destinação dos resíduos em conformidade com a legislação ambiental.",
  },
];

const ConfiancaSection = memo(() => {
  return (
    <section id="confianca" className="bg-background py-10 md:py-16">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">
            Por que confiar na NORTEX?
          </h2>
          <p className="text-muted-foreground">
            Compromisso com qualidade, pontualidade e transparência em cada atendimento.
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
