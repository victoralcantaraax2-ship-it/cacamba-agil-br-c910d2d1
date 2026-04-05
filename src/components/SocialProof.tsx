import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useCallback, useRef } from "react";
import googleLogo from "@/assets/google-logo.webp";

const reviews = [
  // Condomínios
  { name: "Cond. Parque dos Pássaros", role: "Condomínio – Jandira/SP", stars: 5, text: "Contratamos a AMBA para descarte de entulho da reforma do salão de festas. Entrega pontual e equipe educada." },
  { name: "Cond. Reserva da Serra", role: "Condomínio – Barueri/SP", stars: 5, text: "Precisamos descartar material de poda e reforma. AMBA resolveu rápido e sem bagunça. Moradores aprovaram." },
  { name: "Cond. Villa Lobos", role: "Condomínio – Osasco/SP", stars: 5, text: "Usamos a AMBA para limpeza geral do condomínio. Caçamba chegou no horário combinado. Recomendo!" },
  { name: "Cond. Jardim Europa", role: "Condomínio – Santo André/SP", stars: 5, text: "Reforma nos blocos e precisávamos de caçamba urgente. AMBA entregou no mesmo dia!" },
  { name: "Cond. Alto da Boa Vista", role: "Condomínio – São Paulo/SP", stars: 5, text: "Já é a quarta vez que contratamos. Serviço impecável e preço justo para condomínios." },

  // Empresas de freios / autopeças
  { name: "Freios Master Autopeças", role: "Autopeças – Guarulhos/SP", stars: 5, text: "Descartamos peças e materiais da oficina. AMBA veio rápido e resolveu nosso problema de espaço." },
  { name: "Centro Automotivo Freio Seguro", role: "Oficina – São Bernardo do Campo/SP", stars: 5, text: "Precisávamos limpar o depósito da oficina. Caçamba chegou no dia seguinte, tudo certo!" },
  { name: "Auto Freios Capital", role: "Autopeças – São Paulo/SP", stars: 5, text: "Descarte de material antigo da loja. Rápido, prático e dentro das normas." },

  // Construtoras
  { name: "Construtora JR", role: "Construtora – Jandira/SP", stars: 5, text: "Atendemos obras em Jandira e região. AMBA é parceira fixa, nunca falham." },
  { name: "MF Engenharia", role: "Construtora – Guarulhos/SP", stars: 5, text: "Usamos a AMBA em todas as nossas obras na região. Caçamba sempre no prazo e time competente." },
  { name: "Construtora Horizonte", role: "Construtora – Campinas/SP", stars: 5, text: "Mesmo em Campinas, a AMBA entregou no prazo. Logística impressionante!" },
  { name: "Construtora Vila Verde", role: "Construtora – Santo André/SP", stars: 5, text: "Parceiro fixo das nossas obras no ABC. Pontualidade e qualidade impecáveis." },
  { name: "Rocha & Filhos Construções", role: "Construtora – Sorocaba/SP", stars: 5, text: "Obra grande em Sorocaba e a AMBA atendeu todas as demandas. Empresa séria!" },
  { name: "Construtora Planalto", role: "Construtora – Ribeirão Preto/SP", stars: 5, text: "Logística perfeita até Ribeirão. Já contratamos mais de 20 caçambas." },

  // Escolas, Colégios e Creches
  { name: "Colégio Objetivo – Unidade Osasco", role: "Escola – Osasco/SP", stars: 5, text: "Reforma na quadra e precisávamos de caçamba com urgência. AMBA entregou no mesmo dia!" },
  { name: "Escola Monteiro Lobato", role: "Escola – São Paulo/SP", stars: 5, text: "Descarte de móveis antigos da escola. Serviço limpo e organizado. Recomendamos!" },
  { name: "Creche Cantinho Feliz", role: "Creche – Jandira/SP", stars: 5, text: "Reformamos o parquinho e precisávamos de descarte. AMBA foi super atenciosa e rápida." },
  { name: "Colégio São José", role: "Escola – Campinas/SP", stars: 5, text: "Obra de ampliação e a AMBA forneceu caçambas durante toda a reforma. Excelente parceria!" },
  { name: "Escola Infantil Primeiros Passos", role: "Creche – Guarulhos/SP", stars: 5, text: "Precisamos descartar entulho da reforma do berçário. Atendimento gentil e caçamba no prazo." },

  // Gastrobares e Restaurantes
  { name: "Gastrobar 42", role: "Gastrobar – São Paulo/SP", stars: 5, text: "Reformamos o salão inteiro. A AMBA cuidou do descarte sem atrapalhar o funcionamento. Top!" },
  { name: "Bar do Alemão", role: "Gastrobar – Santo André/SP", stars: 5, text: "Obra rápida no bar e a caçamba chegou certinha. Equipe respeitou o horário combinado." },
  { name: "Empório & Bistrô Vila Real", role: "Restaurante – Campinas/SP", stars: 5, text: "Reforma na cozinha industrial. AMBA entregou e retirou tudo no prazo. Recomendo demais!" },

  // Madeireiras
  { name: "Madeireira São Jorge", role: "Madeireira – Osasco/SP", stars: 5, text: "Descartamos sobras de madeira e resíduos. AMBA é rápida e o preço é justo. Cliente fixo!" },
  { name: "Madeireira Pau Brasil", role: "Madeireira – Guarulhos/SP", stars: 5, text: "Usamos caçamba semanalmente para descartar retalhos. AMBA nunca atrasou." },
  { name: "Madeireira Central", role: "Madeireira – São Paulo/SP", stars: 5, text: "Parceiro de anos. Caçamba sempre limpa e entrega pontual. Nota 10!" },

  // Marmorarias
  { name: "Marmoraria Ipiranga", role: "Marmoraria – São Paulo/SP", stars: 5, text: "Descartamos restos de mármore e granito. Ágil e dentro das normas ambientais." },
  { name: "Marmoraria Pedra Bonita", role: "Marmoraria – São Bernardo do Campo/SP", stars: 5, text: "Material pesado e a AMBA deu conta. Caçamba reforçada e entrega rápida." },
  { name: "Marmoraria Elite", role: "Marmoraria – Campinas/SP", stars: 5, text: "Precisávamos de descarte urgente de sobras de granito. Resolveram no mesmo dia!" },

  // Reformas e profissionais
  { name: "RC Reformas e Acabamentos", role: "Reformas – São Paulo/SP", stars: 5, text: "Já alugamos mais de 15 caçambas com a AMBA. Nunca tiveram atraso." },
  { name: "Josy Araujo", role: "Arquiteta – São Caetano/SP", stars: 5, text: "WhatsApp super ágil. Caçamba chegou no mesmo dia. Recomendo demais!" },
  { name: "Paulo Henrique", role: "Proprietário – Jandira/SP", stars: 5, text: "Reformei minha casa em Jandira e a AMBA entregou no dia seguinte. Muito satisfeito!" },
  { name: "Ana Paula Santos", role: "Proprietária – Barueri/SP", stars: 5, text: "Reforma em Alphaville e a caçamba chegou certinha. Atendimento nota 10." },
  { name: "JL Materiais de Construção", role: "Comércio – São Bernardo/SP", stars: 5, text: "Indicamos a AMBA para nossos clientes. Trabalho sério e confiável." },
  { name: "Reciclagem Paulista", role: "Reciclagem – Osasco/SP", stars: 5, text: "Precisávamos de caçamba urgente para descarte. Resolveram no mesmo dia, excelente!" },
  { name: "Simone Alves", role: "Proprietária – Cotia/SP", stars: 5, text: "Pedi pelo WhatsApp de manhã, à tarde já estava na porta. Excelente!" },
  { name: "Dona Maria Aparecida", role: "Aposentada – São Paulo/SP", stars: 5, text: "Meu filho indicou. Pedi pelo WhatsApp e no outro dia já estava na porta." },
  { name: "Thiago Nascimento", role: "Pedreiro autônomo – Osasco/SP", stars: 5, text: "Trabalho com reforma e sempre preciso de caçamba. AMBA nunca me deixou na mão." },
  { name: "Fernanda Lopes", role: "Arquiteta – Campinas/SP", stars: 5, text: "Indiquei para clientes de Campinas. Todos elogiaram o atendimento." },
  { name: "Eduardo Takahashi", role: "Proprietário – São Paulo/SP", stars: 5, text: "Contratei da zona sul e entregaram sem problema. Suporte nota 10." },
  { name: "Cláudia Ribeiro", role: "Proprietária – São Paulo/SP", stars: 5, text: "Reformei meu apartamento e a AMBA cuidou de todo o descarte. Nota 10!" },
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
            Clientes que confiam na NORTEX
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
            Peça sua caçamba agora
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
