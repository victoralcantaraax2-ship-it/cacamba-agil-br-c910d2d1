import { Clock, Eye, Leaf } from "lucide-react";

const values = [
  { icon: Clock, label: "Compromisso com horários", desc: "Respeitamos prazos de entrega e recolhimento à risca." },
  { icon: Eye, label: "Clareza total", desc: "Sem custos ocultos. Tudo definido desde a cotação." },
  { icon: Leaf, label: "Sustentabilidade", desc: "Destinação ecológica, conforme as normas vigentes." },
];

const AboutSection = () => {
  return (
    <section id="sobre-nos" className="bg-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
            Conheça a AMBA Locação
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            A AMBA é especializada no aluguel de caçambas, com foco em
            rapidez, suporte personalizado e destinação correta dos resíduos. Nosso
            propósito é tornar o processo mais simples para quem está reformando,
            construindo ou fazendo limpeza — sem burocracia e com total suporte
            via WhatsApp.
          </p>
          <p className="mb-10 text-muted-foreground leading-relaxed">
            Oferecemos diferentes capacidades para atender desde
            ajustes residenciais até empreendimentos de grande porte, sempre
            cumprindo os prazos de entrega e recolhimento.
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
};

export default AboutSection;
