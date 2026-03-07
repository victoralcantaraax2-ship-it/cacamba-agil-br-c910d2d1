import { FileText, MapPin, Truck } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "1",
    title: "Defina a capacidade",
    desc: "Veja qual caçamba é a mais adequada para o seu projeto.",
  },
  {
    icon: MapPin,
    step: "2",
    title: "Passe o local e a data",
    desc: "Diga onde e quando precisa receber a caçamba.",
  },
  {
    icon: Truck,
    step: "3",
    title: "Levamos e buscamos",
    desc: "A caçamba é entregue e retirada conforme o combinado.",
  },
];

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const ComoFuncionaSection = () => {
  return (
    <section id="como-funciona" className="bg-muted/40 py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">
            Passo a Passo
          </h2>
          <p className="text-muted-foreground">
            Três etapas para resolver o descarte do seu entulho.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center">
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Icon className="h-8 w-8 text-primary-foreground" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {step}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => scrollTo("#tamanhos")}
            className="rounded-xl bg-primary px-8 py-4 text-base font-bold uppercase text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90"
          >
            Solicitar agora
          </button>
        </div>
      </div>
    </section>
  );
};

export default ComoFuncionaSection;
