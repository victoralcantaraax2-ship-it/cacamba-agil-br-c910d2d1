import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useCallback, useRef } from "react";
import googleLogo from "@/assets/google-logo.png";

const reviews = [
  { name: "MF Engenharia", role: "Construtora – Joinville/SC", stars: 5, text: "Usamos a AMBA em todas as nossas obras na região. Chegada ágil e time muito competente." },
  { name: "Reciclagem Litoral SC", role: "Reciclagem – Balneário Camboriú/SC", stars: 5, text: "Precisávamos de caçamba com urgência para descarte. Solucionaram no mesmo dia, excelente!" },
  { name: "RC Reformas e Acabamentos", role: "Reformas – Blumenau/SC", stars: 5, text: "Já locamos mais de 15 caçambas com a AMBA. Sempre no horário e com ótimo suporte." },
  { name: "Construtora Parque Verde", role: "Construtora – Itajaí/SC", stars: 5, text: "Parceiro fixo das nossas obras. Nunca tivemos problema com prazo ou qualidade." },
  { name: "Ferro Velho São João", role: "Reciclagem – Joinville/SC", stars: 5, text: "Caçamba chegou no horário combinado. Time educado e competente. Indico para qualquer empresa." },
  { name: "Terraplenagem Vale", role: "Terraplenagem – Brusque/SC", stars: 5, text: "Bom serviço, caçamba bem conservada. Dentro do prazo combinado." },
  { name: "JL Materiais de Construção", role: "Comércio – Florianópolis/SC", stars: 5, text: "Indicamos a AMBA para todos os nossos clientes. Serviço sério e de confiança." },
  { name: "Reciclagem Navegantes", role: "Reciclagem – Navegantes/SC", stars: 5, text: "Suporte excelente. Chegada foi ágil e tudo ocorreu bem." },
  { name: "Marmoraria Presidente", role: "Marmoraria – Blumenau/SC", stars: 5, text: "Descartamos resíduos de mármore e granito. Serviço ágil e dentro das normas ambientais." },
  { name: "Josy Araujo", role: "Arquiteta – Jaraguá do Sul/SC", stars: 5, text: "Suporte pelo WhatsApp super ágil. A caçamba chegou no mesmo dia. Recomendo muito!" },
  { name: "Rogério Pereira", role: "Engenheiro Civil – Criciúma/SC", stars: 5, text: "Muito satisfeito com o serviço. Time pontual e comprometido com o prazo." },
  { name: "Laudiane Sousa", role: "Proprietária de Imóvel – Chapecó/SC", stars: 5, text: "Podem contratar sem receio. Processo simples e suporte excelente." },
  { name: "Nilson Fucítalo", role: "Mestre de Obras – Lages/SC", stars: 5, text: "Cumprem o que prometem. Já é minha terceira locação com eles." },
  { name: "Carla Mendes", role: "Decoradora – Florianópolis/SC", stars: 5, text: "Muito fácil solicitar pelo WhatsApp e a chegada foi ágil. Nota 10!" },
  { name: "Anderson Lima", role: "Proprietário – Joinville/SC", stars: 5, text: "Reformei minha casa e precisei de 2 caçambas. Chegaram no dia seguinte. Super indico!" },
  { name: "Patrícia Oliveira", role: "Síndica – Itajaí/SC", stars: 5, text: "Contratei para o condomínio. Serviço impecável, sem sujeira na rua. Moradores elogiaram." },
  { name: "Dona Maria Aparecida", role: "Aposentada – Balneário Camboriú/SC", stars: 5, text: "Meu filho indicou. Pedi pelo WhatsApp e no outro dia já estava na porta. Muito prático!" },
  { name: "Thiago Nascimento", role: "Pedreiro autônomo – Tubarão/SC", stars: 5, text: "Trabalho com reforma e sempre preciso de caçamba. A AMBA nunca me deixou na mão." },
  { name: "Luciana Ferreira", role: "Designer de Interiores – Criciúma/SC", stars: 5, text: "Usei na reforma do meu escritório. Chegada ágil e serviço impecável." },
  { name: "Eduardo Takahashi", role: "Proprietário – Florianópolis/SC", stars: 5, text: "Contratei de Florianópolis e entregaram sem problema. Suporte nota 10." },
  { name: "Felipe Monteiro", role: "Engenheiro – Chapecó/SC", stars: 5, text: "Precisei de caçamba para uma obra em Chapecó e a AMBA respondeu super rápido. Impecável!" },
  { name: "Renata Campos", role: "Arquiteta – São José/SC", stars: 5, text: "Contratei para reforma residencial em São José. Pontual e time muito educado." },
  { name: "Marcos Vinicius", role: "Construtor – Criciúma/SC", stars: 5, text: "Mesmo sendo em Criciúma, o suporte foi excelente. Caçamba chegou no prazo combinado." },
  { name: "Daniela Souza", role: "Síndica – Chapecó/SC", stars: 5, text: "Contratei para limpeza do condomínio em Chapecó. Moradores aprovaram. Recomendo!" },
  { name: "Roberto Almeida", role: "Mestre de Obras – Lages/SC", stars: 5, text: "Empresa séria e comprometida. Entregaram dentro do prazo na região de Lages." },
  { name: "Cláudia Ribeiro", role: "Proprietária – Florianópolis/SC", stars: 5, text: "Reformei meu apartamento em Florianópolis e a AMBA cuidou de todo o descarte. Nota 10!" },
  { name: "André Machado", role: "Empreiteiro – Tubarão/SC", stars: 5, text: "Caçamba bem conservada e chegada ágil em Tubarão. Já estou na segunda locação com eles." },
];

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const SocialProof = () => {
  const shuffled = useMemo(() => [...reviews].sort(() => Math.random() - 0.5), []);
  const [current, setCurrent] = useState(0);
  const touchStart = useRef<number | null>(null);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? shuffled.length - 1 : c - 1)), [shuffled.length]);
  const next = useCallback(() => setCurrent((c) => (c === shuffled.length - 1 ? 0 : c + 1)), [shuffled.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    touchStart.current = null;
  };

  const getVisibleReviews = () => {
    const visible: typeof reviews = [];
    for (let i = 0; i < 3; i++) {
      visible.push(shuffled[(current + i) % shuffled.length]);
    }
    return visible;
  };

  return (
    <section id="depoimentos" className="bg-secondary py-12 md:py-24">
      <div className="container px-4">
        <div className="mb-6 md:mb-10 text-center">
          <h2 className="mb-2 text-xl font-extrabold text-secondary-foreground md:text-3xl">
            Quem já usou, recomenda
          </h2>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex flex-col items-center gap-1">
              <img src={googleLogo} alt="Google" className="h-6 md:h-7 w-auto" />
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-star text-star" />
                  ))}
                </div>
                <span className="text-xs md:text-sm font-bold text-secondary-foreground">4.8</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto max-w-4xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={prev}
            className="absolute -left-1 md:-left-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-secondary-foreground/10 p-1.5 md:p-2 text-secondary-foreground shadow-lg transition-colors hover:bg-secondary-foreground/20 active:bg-secondary-foreground/30"
            aria-label="Avaliação anterior"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          <div className="grid grid-cols-1 gap-3 md:gap-4 px-6 md:px-8 md:grid-cols-2 lg:grid-cols-3">
            {getVisibleReviews().map((review, idx) => (
              <div
                key={`${review.name}-${idx}`}
                className={`rounded-xl border border-secondary-foreground/10 bg-secondary-foreground/5 p-4 md:p-5 transition-opacity ${
                  idx === 0 ? "block" : idx === 1 ? "hidden md:block" : "hidden lg:block"
                }`}
              >
                <div className="mb-2 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 md:h-4 md:w-4 ${i < review.stars ? "fill-star text-star" : "fill-muted text-muted"}`} />
                  ))}
                </div>
                <p className="mb-2 md:mb-3 text-xs md:text-sm leading-relaxed text-secondary-foreground">"{review.text}"</p>
                <p className="text-xs md:text-sm font-bold text-secondary-foreground">{review.name}</p>
                <p className="text-[11px] md:text-xs text-secondary-foreground/60">{review.role}</p>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            className="absolute -right-1 md:-right-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-secondary-foreground/10 p-1.5 md:p-2 text-secondary-foreground shadow-lg transition-colors hover:bg-secondary-foreground/20 active:bg-secondary-foreground/30"
            aria-label="Próxima avaliação"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-1.5 md:hidden">
          {shuffled.slice(0, Math.min(shuffled.length, 8)).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all ${
                current === idx ? "w-4 bg-primary" : "w-1.5 bg-secondary-foreground/20"
              }`}
              aria-label={`Ir para avaliação ${idx + 1}`}
            />
          ))}
        </div>

        <div className="mt-6 md:mt-10 text-center">
          <button
            onClick={() => scrollTo("#tamanhos")}
            className="rounded-xl bg-primary px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-bold uppercase text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95 hover:bg-primary/90"
          >
            Quero solicitar agora
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
