import { Truck, MessageCircle, Leaf } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const items = [
  {
    icon: Truck,
    title: "Agilidade na Entrega",
    desc: "Chegada rápida logo após a confirmação. Trabalhamos para que sua caçamba esteja no local o quanto antes.",
  },
  {
    icon: MessageCircle,
    title: "Suporte Digital",
    desc: "Atendimento completo pelo WhatsApp para cotações, dúvidas e agendamentos. Prático e direto.",
  },
  {
    icon: Leaf,
    title: "Destinação Ecológica",
    desc: "Descarte responsável, cumprindo todas as regulamentações ambientais. Cuidamos da natureza por você.",
  },
];

const DifferentialsSection = () => {
  return (
    <section className="bg-card py-14 md:py-20">
      <div className="container px-4 text-center">
        <h2 className="mb-10 text-2xl font-extrabold text-card-foreground md:text-3xl">
          Por que escolher a AMBA
        </h2>

        <div className="mx-auto mb-10 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-4 rounded-xl border border-border bg-background p-6"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <Icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-extrabold uppercase text-whatsapp-foreground shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
        >
          <MessageCircle className="h-5 w-5 fill-current" />
          Pedir Cotação
        </a>
      </div>
    </section>
  );
};

export default DifferentialsSection;
