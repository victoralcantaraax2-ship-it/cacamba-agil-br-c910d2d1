import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const reviews = [
  { name: "Josy Araujo", text: "Comprometidos. Recomendo." },
  { name: "Rogerio Pereira", text: "Muito satisfeito com o serviço prestado." },
  { name: "Laudiane Sousa", text: "Podem contratar sem medo." },
  { name: "Nilson Fucítalo", text: "Cumprem com o combinado." },
];

const SocialProof = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1));

  // Show 1 on mobile, 2 on md, 3 on lg
  const getVisibleReviews = () => {
    const visible: typeof reviews = [];
    for (let i = 0; i < 3; i++) {
      visible.push(reviews[(current + i) % reviews.length]);
    }
    return visible;
  };

  return (
    <section className="bg-card py-14 md:py-20">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-card-foreground md:text-3xl">
            Clientes recomendam nosso atendimento
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold text-card-foreground">EXCELENTE</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-star text-star" />
              ))}
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Baseado em +60 avaliações</p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <button
            onClick={prev}
            className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-secondary p-2 text-secondary-foreground shadow-lg transition-colors hover:bg-secondary/80 md:-left-5"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 gap-4 px-8 md:grid-cols-2 lg:grid-cols-3">
            {getVisibleReviews().map((review, idx) => (
              <div
                key={`${review.name}-${idx}`}
                className={`rounded-xl border border-border bg-background p-5 shadow-sm transition-opacity ${
                  idx === 0 ? "block" : idx === 1 ? "hidden md:block" : "hidden lg:block"
                }`}
              >
                <div className="mb-2 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-star text-star" />
                  ))}
                </div>
                <p className="mb-3 text-sm text-card-foreground">"{review.text}"</p>
                <p className="text-xs font-bold text-muted-foreground">{review.name}</p>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-secondary p-2 text-secondary-foreground shadow-lg transition-colors hover:bg-secondary/80 md:-right-5"
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
