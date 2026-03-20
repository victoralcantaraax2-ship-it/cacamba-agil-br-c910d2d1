import { memo } from "react";
import { Clock, Eye, Leaf } from "lucide-react";

const values = [
  { icon: Clock, label: "Pontualidade no prazo", desc: "Entregamos e retiramos no horário combinado, sem atrasos." },
  { icon: Eye, label: "Tudo às claras", desc: "Valores definidos na cotação, sem surpresas na hora de pagar." },
  { icon: Leaf, label: "Descarte consciente", desc: "Resíduos encaminhados para locais licenciados, dentro das normas." },
];

const AboutSection = memo(() => {
  return (
    <section id="sobre-nos" className="bg-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
            Sobre a AMBA Caçambas
          </h2>
           <p className="mb-4 text-muted-foreground leading-relaxed">
            A AMBA atua no aluguel de caçambas em todo o estado de São Paulo, oferecendo
            atendimento direto, logística ágil e descarte dentro das normas ambientais. Cobrimos
            a capital, Guarulhos, Campinas, Osasco, ABC, Sorocaba, Ribeirão Preto, São José dos Campos,
            São José do Rio Preto, Jandira e diversas outras cidades. Nosso foco é simplificar o processo — sem burocracia, com suporte pelo WhatsApp.
          </p>
          <p className="mb-10 text-muted-foreground leading-relaxed">
            Trabalhamos com caçambas de diversos tamanhos para atender desde
            uma reforma simples até obras de grande escala, sempre dentro
            do prazo acordado.
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
