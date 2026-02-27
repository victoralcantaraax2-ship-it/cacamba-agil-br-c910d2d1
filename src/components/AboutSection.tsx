import { Clock, Eye, Leaf } from "lucide-react";

const values = [
  { icon: Clock, label: "Pontualidade", desc: "Cumprimos prazos de entrega e retirada com rigor." },
  { icon: Eye, label: "Transparência", desc: "Sem taxas escondidas. Tudo claro desde o orçamento." },
  { icon: Leaf, label: "Responsabilidade ambiental", desc: "Descarte dentro das normas e leis ambientais." },
];

const AboutSection = () => {
  return (
    <section id="sobre-nos" className="bg-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
            Sobre a AMBA Central de Caçambas
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            A AMBA é uma central especializada em locação de caçambas, com foco
            em agilidade, atendimento humanizado e descarte responsável. Nosso
            objetivo é simplificar o processo para quem está reformando,
            construindo ou fazendo limpeza — sem burocracia e com total suporte
            via WhatsApp.
          </p>
          <p className="mb-10 text-muted-foreground leading-relaxed">
            Trabalhamos com diferentes tamanhos de caçamba para atender desde
            pequenas reformas residenciais até grandes obras comerciais, sempre
            garantindo pontualidade na entrega e retirada.
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
