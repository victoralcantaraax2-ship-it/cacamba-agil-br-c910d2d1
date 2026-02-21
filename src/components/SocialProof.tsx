import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const reviews = [
  { name: "Josy Araujo", role: "Arquiteta", text: "Atendimento pelo WhatsApp super rápido. Caçamba chegou no mesmo dia. Recomendo demais!" },
  { name: "Rogerio Pereira", role: "Engenheiro Civil", text: "Muito satisfeito com o serviço. Equipe pontual e comprometida com o prazo." },
  { name: "Laudiane Sousa", role: "Proprietária de Imóvel", text: "Podem contratar sem medo. Processo simples e preço justo." },
  { name: "Nilson Fucítalo", role: "Mestre de Obras", text: "Cumprem com o combinado. Já é minha terceira locação com eles." },
  { name: "Carla Mendes", role: "Decoradora", text: "Facilidade de pedir pelo WhatsApp e entrega rápida. Nota 10!" },
];

const SocialProof = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1));

  const getVisibleReviews = () => {
    const visible: typeof reviews = [];
    for (let i = 0; i < 3; i++) {
      visible.push(reviews[(current + i) % reviews.length]);
    }
    return visible;
  };

  return (
    <section className="bg-secondary py-14 md:py-20">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-secondary-foreground md:text-3xl">
            O Que Nossos Clientes Dizem
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold text-secondary-foreground">EXCELENTE</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-star text-star" />
              ))}
            </div>
          </div>
          <p className="mt-1 text-sm text-secondary-foreground/60">
            Baseado em +80 avaliações de clientes reais
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <button
            onClick={prev}
            className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-secondary-foreground/10 p-2 text-secondary-foreground shadow-lg transition-colors hover:bg-secondary-foreground/20 md:-left-5"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 gap-4 px-8 md:grid-cols-2 lg:grid-cols-3">
            {getVisibleReviews().map((review, idx) => (
              <div
                key={`${review.name}-${idx}`}
                className={`rounded-xl border border-secondary-foreground/10 bg-secondary-foreground/5 p-5 transition-opacity ${
                  idx === 0 ? "block" : idx === 1 ? "hidden md:block" : "hidden lg:block"
                }`}
              >
                <div className="mb-2 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-star text-star" />
                  ))}
                </div>
                <p className="mb-3 text-sm text-secondary-foreground">"{review.text}"</p>
                <p className="text-sm font-bold text-secondary-foreground">{review.name}</p>
                <p className="text-xs text-secondary-foreground/60">{review.role}</p>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-secondary-foreground/10 p-2 text-secondary-foreground shadow-lg transition-colors hover:bg-secondary-foreground/20 md:-right-5"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
