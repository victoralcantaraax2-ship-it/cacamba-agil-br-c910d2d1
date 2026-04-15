import { memo } from "react";
import { FileText, MapPin, Truck } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const steps = [
  {
    icon: FileText,
    step: "1",
    title: "Escolha o tamanho ideal",
    desc: "Selecione a caçamba adequada para o volume da sua obra e entre em contato pelo WhatsApp.",
  },
  {
    icon: MapPin,
    step: "2",
    title: "Informe o endereço",
    desc: "Envie a localização e a data desejada. Confirmamos a disponibilidade em poucos minutos.",
  },
  {
    icon: Truck,
    step: "3",
    title: "Entrega e retirada",
    desc: "Realizamos a entrega no prazo combinado e efetuamos a coleta na data agendada.",
  },
];

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const ComoFuncionaSection = memo(() => {
  return (
    <section id="como-funciona" className="bg-muted/40 py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">
            Como funciona a locação
          </h2>
          <p className="text-muted-foreground">
            Processo simples, rápido e transparente em três etapas.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center">
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Icon className="h-8 w-8 text-white" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {step}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => scrollTo("#tamanhos")}
            className="rounded-xl bg-primary px-8 py-4 text-base font-bold uppercase text-white shadow-lg transition-all hover:scale-105 hover:brightness-110"
          >
            Solicitar Agora
          </button>
          <button
            onClick={() => handleWhatsAppClick()}
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
            Falar pelo WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
});

ComoFuncionaSection.displayName = "ComoFuncionaSection";

export default ComoFuncionaSection;
