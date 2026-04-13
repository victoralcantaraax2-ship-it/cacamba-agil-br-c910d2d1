import { memo } from "react";
import { Truck, Clock, MessageCircle, FileCheck, DollarSign, CalendarCheck } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const diferenciais = [
  { icon: Truck, title: "Entrega rápida", desc: "Realizamos a entrega da caçamba em até 2 horas, conforme disponibilidade da região." },
  { icon: CalendarCheck, title: "Agendamento flexível", desc: "Você escolhe o melhor dia para entrega e retirada, com total comodidade." },
  { icon: MessageCircle, title: "Atendimento imediato", desc: "Atendimento rápido via WhatsApp, com resposta em poucos minutos." },
  { icon: FileCheck, title: "Processo simplificado", desc: "Sem burocracia. Solicitação rápida e prática." },
  { icon: DollarSign, title: "Preço justo e transparente", desc: "Sem taxas ocultas. Você sabe exatamente quanto vai pagar." },
  { icon: Clock, title: "Compromisso com prazos", desc: "Cumprimos os horários combinados com responsabilidade." },
];

const DiferenciaisSection = memo(() => {
  return (
    <section className="bg-card py-16 md:py-28">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-foreground md:text-4xl">
            Por que escolher a NORTEX Caçambas?
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Confiança, agilidade e preço justo em cada atendimento.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {diferenciais.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center rounded-2xl border-2 border-border bg-background p-6 md:p-8 transition-all hover:border-primary/40 hover:shadow-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-base font-bold text-foreground md:text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <button
            onClick={() => handleWhatsAppClick()}
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-extrabold uppercase text-white shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
            SOLICITAR CAÇAMBA NO WHATSAPP
          </button>
          <span className="text-xs text-muted-foreground">Atendimento imediato • Sem compromisso</span>
        </div>
      </div>
    </section>
  );
});

DiferenciaisSection.displayName = "DiferenciaisSection";

export default DiferenciaisSection;
