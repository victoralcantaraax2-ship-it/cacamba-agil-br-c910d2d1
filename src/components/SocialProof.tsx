import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useCallback, useRef } from "react";
import googleLogo from "@/assets/google-logo.webp";

const reviews = [
  // Condomínios
  { name: "Cond. Parque dos Pássaros", role: "Condomínio", stars: 5, text: "Contratamos a NORTEX para o descarte de entulho da reforma do salão de festas. Entrega pontual e equipe muito profissional." },
  { name: "Cond. Reserva da Serra", role: "Condomínio", stars: 5, text: "Precisávamos descartar material de poda e reforma. A NORTEX resolveu com agilidade e organização. Moradores aprovaram." },
  { name: "Cond. Villa Lobos", role: "Condomínio", stars: 5, text: "Utilizamos o serviço para limpeza geral do condomínio. Caçamba entregue no horário combinado. Recomendamos." },
  { name: "Cond. Jardim Europa", role: "Condomínio", stars: 5, text: "Reforma nos blocos e precisávamos de caçamba com urgência. A NORTEX entregou no mesmo dia." },
  { name: "Cond. Alto da Boa Vista", role: "Condomínio", stars: 5, text: "Quarta contratação consecutiva. Serviço impecável e valores justos para condomínios." },

  // Autopeças
  { name: "Freios Master Autopeças", role: "Autopeças", stars: 5, text: "Descartamos peças e materiais da oficina. A NORTEX atendeu rapidamente e resolveu nosso problema de espaço." },
  { name: "Centro Automotivo Freio Seguro", role: "Oficina", stars: 5, text: "Precisávamos limpar o depósito. Caçamba entregue no dia seguinte, tudo conforme o combinado." },
  { name: "Auto Freios Capital", role: "Autopeças", stars: 5, text: "Descarte de material antigo da loja. Atendimento rápido, prático e dentro das normas." },

  // Construtoras
  { name: "Construtora JR", role: "Construtora", stars: 5, text: "A NORTEX é parceira fixa em nossas obras. Nunca apresentaram falhas." },
  { name: "MF Engenharia", role: "Construtora", stars: 5, text: "Utilizamos a NORTEX em todas as nossas obras. Caçamba sempre no prazo e equipe competente." },
  { name: "Construtora Horizonte", role: "Construtora", stars: 5, text: "Entrega dentro do prazo. Logística impecável." },
  { name: "Construtora Vila Verde", role: "Construtora", stars: 5, text: "Parceiro fixo das nossas obras. Pontualidade e qualidade exemplares." },
  { name: "Rocha & Filhos Construções", role: "Construtora", stars: 5, text: "Obra de grande porte e a NORTEX atendeu todas as demandas. Empresa séria e confiável." },
  { name: "Construtora Planalto", role: "Construtora", stars: 5, text: "Logística perfeita. Já contratamos mais de 20 caçambas com a empresa." },

  // Escolas
  { name: "Colégio Objetivo", role: "Escola", stars: 5, text: "Reforma na quadra esportiva com necessidade urgente de caçamba. A NORTEX entregou no mesmo dia." },
  { name: "Escola Monteiro Lobato", role: "Escola", stars: 5, text: "Descarte de mobiliário antigo. Serviço limpo e organizado. Recomendamos." },
  { name: "Creche Cantinho Feliz", role: "Creche", stars: 5, text: "Reformamos o parquinho e precisávamos de descarte. A NORTEX foi atenciosa e extremamente ágil." },
  { name: "Colégio São José", role: "Escola", stars: 5, text: "Obra de ampliação e a NORTEX forneceu caçambas durante toda a reforma. Excelente parceria." },
  { name: "Escola Infantil Primeiros Passos", role: "Creche", stars: 5, text: "Descarte de entulho da reforma do berçário. Atendimento cordial e caçamba entregue no prazo." },

  // Gastrobares
  { name: "Gastrobar 42", role: "Gastrobar", stars: 5, text: "Reformamos o salão inteiro. A NORTEX cuidou do descarte sem impactar o funcionamento do estabelecimento." },
  { name: "Bar do Alemão", role: "Gastrobar", stars: 5, text: "Obra rápida no bar e a caçamba foi entregue conforme combinado. Equipe respeitou o horário." },
  { name: "Empório & Bistrô Vila Real", role: "Restaurante", stars: 5, text: "Reforma na cozinha industrial. A NORTEX entregou e retirou tudo dentro do prazo. Altamente recomendado." },

  // Madeireiras
  { name: "Madeireira São Jorge", role: "Madeireira", stars: 5, text: "Descartamos sobras de madeira e resíduos. A NORTEX é ágil e pratica preços justos. Somos clientes regulares." },
  { name: "Madeireira Pau Brasil", role: "Madeireira", stars: 5, text: "Utilizamos caçamba semanalmente para descartar retalhos. A NORTEX nunca atrasou uma entrega." },
  { name: "Madeireira Central", role: "Madeireira", stars: 5, text: "Parceria de anos. Caçamba sempre limpa e entrega pontual. Nota máxima." },

  // Marmorarias
  { name: "Marmoraria Ipiranga", role: "Marmoraria", stars: 5, text: "Descarte de restos de mármore e granito. Atendimento ágil e em conformidade com as normas ambientais." },
  { name: "Marmoraria Pedra Bonita", role: "Marmoraria", stars: 5, text: "Material pesado e a NORTEX atendeu perfeitamente. Caçamba reforçada e entrega rápida." },
  { name: "Marmoraria Elite", role: "Marmoraria", stars: 5, text: "Necessidade urgente de descarte de sobras de granito. Resolvido no mesmo dia." },

  // Reformas e profissionais
  { name: "RC Reformas e Acabamentos", role: "Reformas", stars: 5, text: "Já locamos mais de 15 caçambas com a NORTEX. Nunca houve atraso." },
  { name: "Josy Araujo", role: "Arquiteta", stars: 5, text: "Atendimento ágil pelo WhatsApp. Caçamba entregue no mesmo dia. Recomendo fortemente." },
  { name: "Paulo Henrique", role: "Proprietário", stars: 5, text: "Reformei minha residência e a NORTEX entregou no dia seguinte. Muito satisfeito com o serviço." },
  { name: "Ana Paula Santos", role: "Proprietária", stars: 5, text: "Reforma residencial e a caçamba foi entregue conforme o combinado. Atendimento nota máxima." },
  { name: "JL Materiais de Construção", role: "Comércio", stars: 5, text: "Indicamos a NORTEX para nossos clientes. Trabalho sério e confiável." },
  { name: "Reciclagem Paulista", role: "Reciclagem", stars: 5, text: "Necessidade urgente de caçamba para descarte. Resolvido no mesmo dia. Excelente." },
  { name: "Simone Alves", role: "Proprietária", stars: 5, text: "Solicitei pela manhã e no período da tarde a caçamba já estava no local. Excelente." },
  { name: "Dona Maria Aparecida", role: "Aposentada", stars: 5, text: "Meu filho indicou o serviço. Solicitei pelo WhatsApp e no dia seguinte a caçamba já estava disponível." },
  { name: "Thiago Nascimento", role: "Mestre de obras", stars: 5, text: "Trabalho com reformas e sempre necessito de caçamba. A NORTEX nunca deixou a desejar." },
  { name: "Fernanda Lopes", role: "Arquiteta", stars: 5, text: "Indiquei para diversos clientes. Todos elogiaram o atendimento e a pontualidade." },
  { name: "Eduardo Takahashi", role: "Proprietário", stars: 5, text: "Contratei o serviço e a entrega ocorreu sem intercorrências. Suporte nota máxima." },
  { name: "Cláudia Ribeiro", role: "Proprietária", stars: 5, text: "Reformei meu apartamento e a NORTEX cuidou de todo o descarte. Serviço impecável." },
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
            O que nossos clientes dizem
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
            Solicitar sua caçamba
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
