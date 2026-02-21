import { MessageCircle, MapPin, CalendarCheck } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const steps = [
  { icon: MessageCircle, title: "Chame no WhatsApp", desc: "Envie uma mensagem rápida" },
  { icon: MapPin, title: "Verificamos sua região", desc: "Informamos disponibilidade" },
  { icon: CalendarCheck, title: "Agendamos a entrega", desc: "Prático e sem burocracia" },
];

const HowItWorks = () => {
  return (
    <section className="bg-card py-14 md:py-20">
      <div className="container px-4 text-center">
        <h2 className="mb-10 text-2xl font-extrabold text-card-foreground md:text-3xl">
          Como funciona?
        </h2>

        <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }, idx) => (
            <div key={title} className="relative flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-black text-primary-foreground">
                {idx + 1}
              </div>
              <Icon className="h-6 w-6 text-muted-foreground" />
              <h3 className="text-base font-bold text-card-foreground">{title}</h3>
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
          Solicitar pelo WhatsApp
        </a>
      </div>
    </section>
  );
};

export default HowItWorks;
