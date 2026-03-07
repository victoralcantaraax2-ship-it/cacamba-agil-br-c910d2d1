import { memo } from "react";
import { Clock, Eye, Leaf } from "lucide-react";

const values = [
  { icon: Clock, label: "Compromisso com prazos", desc: "Respeitamos os horários de entrega e retirada à risca." },
  { icon: Eye, label: "Transparência total", desc: "Sem custos ocultos. Tudo combinado desde a cotação." },
  { icon: Leaf, label: "Sustentabilidade", desc: "Destinação ecológica dos resíduos, conforme as normas vigentes." },
];

const AboutSection = memo(() => {
  return (
    <section id="sobre-nos" className="bg-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
            Conheça a AMBA Locação
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            A AMBA é especializada no aluguel de caçambas, com foco em
            agilidade, suporte personalizado e destinação correta dos resíduos. Nosso
            objetivo é tornar o processo mais simples para quem está reformando,
            construindo ou fazendo limpeza — sem burocracia e com atendimento
            direto pelo WhatsApp.
          </p>
          <p className="mb-10 text-muted-foreground leading-relaxed">
            Oferecemos caçambas de diferentes capacidades para atender desde
            pequenos reparos residenciais até obras de grande porte, sempre
            cumprindo os prazos combinados.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-base font-bold text-card-foreground">{label}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
