import { memo } from "react";
import { CheckCircle, ShieldCheck, Clock, MessageCircle, CreditCard, Truck } from "lucide-react";

const items = [
  {
    icon: Clock,
    title: "Atendimento rápido e confiável",
    desc: "Respondemos em minutos pelo WhatsApp. Sem espera, sem complicação.",
  },
  {
    icon: Truck,
    title: "Entrega no prazo combinado",
    desc: "Caçamba no local dentro do horário acordado. Sua obra não para.",
  },
  {
    icon: ShieldCheck,
    title: "Processo seguro e transparente",
    desc: "Valores claros desde o primeiro contato. Sem taxas escondidas.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento direto via WhatsApp",
    desc: "Fale diretamente com nossa equipe. Sem robôs, sem transferências.",
  },
  {
    icon: CreditCard,
    title: "Pagamento seguro",
    desc: "Pagamento via Pix após confirmação do pedido. Atendimento direto com nossa equipe.",
  },
  {
    icon: CheckCircle,
    title: "Descarte regularizado",
    desc: "Resíduos destinados a locais licenciados, dentro das normas ambientais.",
  },
];


const ConfiancaSection = memo(() => {
  return (
    <section id="confianca" className="bg-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">
            Por Que Mais de 500 Clientes Confiam na NORTEX
          </h2>
          <p className="text-muted-foreground">
            Empresa séria, com atendimento direto e entrega garantida.
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
