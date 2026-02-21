import { Clock, ShieldCheck, Truck, CheckCircle } from "lucide-react";

const features = [
  { icon: Clock, label: "Atendimento rápido" },
  { icon: ShieldCheck, label: "Empresas verificadas" },
  { icon: Truck, label: "Entrega ágil" },
  { icon: CheckCircle, label: "Processo simples" },
];

const NationalCoverage = () => {
  return (
    <section className="bg-secondary py-14 md:py-20">
      <div className="container px-4 text-center">
        <h2 className="mb-3 text-2xl font-extrabold text-secondary-foreground md:text-3xl">
          Atendimento em diversas regiões
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-secondary-foreground/70">
          Conectamos você rapidamente a equipes parceiras próximas da sua localização.
        </p>

        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-5 md:grid-cols-4">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 rounded-xl bg-secondary-foreground/5 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-secondary-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NationalCoverage;
