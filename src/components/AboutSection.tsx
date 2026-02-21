import { ShieldCheck, Leaf, Users, Award } from "lucide-react";

const values = [
  { icon: Award, label: "Experiência no mercado" },
  { icon: ShieldCheck, label: "Confiança e transparência" },
  { icon: Leaf, label: "Compromisso ambiental" },
  { icon: Users, label: "Atendimento humanizado" },
];

const AboutSection = () => {
  return (
    <section className="bg-background py-14 md:py-20">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
            Tradição e Qualidade em Locação de Caçambas
          </h2>
          <p className="mb-10 text-muted-foreground">
            Somos uma empresa dedicada à locação de caçambas com foco em agilidade,
            responsabilidade ambiental e satisfação do cliente. Trabalhamos para que
            o descarte de entulho seja simples, rápido e dentro das normas.
          </p>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-5 md:grid-cols-4">
          {values.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-card-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
