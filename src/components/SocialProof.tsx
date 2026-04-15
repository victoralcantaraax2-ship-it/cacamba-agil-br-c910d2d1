import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useCallback, useRef } from "react";
import googleLogo from "@/assets/google-logo.webp";

const reviews = [
  // Shoppings
  { name: "Shopping Aricanduva", role: "Shopping Center", city: "São Paulo – Zona Leste", stars: 5, text: "Reforma na praça de alimentação e a NORTEX forneceu caçambas durante toda a obra. Logística impecável e equipe muito profissional." },
  { name: "Shopping Boulevard Tatuapé", role: "Shopping Center", city: "São Paulo – Tatuapé", stars: 5, text: "Utilizamos o serviço para descarte de materiais da reforma de lojas. Entrega pontual e coleta dentro do prazo." },
  { name: "Shopping Center Penha", role: "Shopping Center", city: "São Paulo – Penha", stars: 5, text: "Precisávamos de caçamba com urgência para reforma de fachada. A NORTEX atendeu no mesmo dia." },
  { name: "Shopping Metrô Itaquera", role: "Shopping Center", city: "São Paulo – Itaquera", stars: 5, text: "Obra de ampliação e a NORTEX cuidou de todo o descarte. Empresa séria e comprometida com prazos." },

  // Condomínios (Síndicos)
  { name: "Cond. Parque dos Pássaros", role: "Síndico profissional", city: "Guarulhos", stars: 5, text: "Contratamos a NORTEX para descarte de entulho da reforma do salão de festas. Entrega pontual e equipe educada." },
  { name: "Cond. Reserva da Serra", role: "Síndico", city: "Cotia", stars: 5, text: "Precisávamos descartar material de poda e reforma. A NORTEX resolveu com agilidade. Moradores aprovaram." },
  { name: "Cond. Villa Lobos", role: "Administração condominial", city: "São Paulo – Mooca", stars: 5, text: "Utilizamos para limpeza geral do condomínio. Caçamba entregue no horário combinado. Recomendamos." },
  { name: "Cond. Jardim Europa", role: "Síndico", city: "Osasco", stars: 5, text: "Reforma nos blocos e precisávamos de caçamba urgente. A NORTEX entregou no mesmo dia." },
  { name: "Cond. Alto da Boa Vista", role: "Administradora", city: "São Paulo – Zona Sul", stars: 5, text: "Quarta contratação consecutiva. Serviço impecável e valores justos para condomínios." },
  { name: "Cond. Residencial Alphaville", role: "Síndico profissional", city: "Barueri – Alphaville", stars: 5, text: "Gestão de resíduos da reforma das áreas comuns. A NORTEX ofereceu solução completa e eficiente." },

  // Creches e Escolas
  { name: "Colégio Objetivo – Tatuapé", role: "Escola", city: "São Paulo – Tatuapé", stars: 5, text: "Reforma na quadra esportiva e precisávamos de caçamba urgente. A NORTEX entregou no mesmo dia." },
  { name: "Escola Monteiro Lobato", role: "Escola", city: "Santo André", stars: 5, text: "Descarte de mobiliário antigo da escola. Serviço limpo, organizado e dentro das normas." },
  { name: "Creche Cantinho Feliz", role: "Creche", stars: 5, text: "Reformamos o parquinho e precisávamos de descarte seguro. A NORTEX foi atenciosa e extremamente ágil." },
  { name: "Colégio São José", role: "Escola", city: "São Bernardo do Campo", stars: 5, text: "Obra de ampliação e a NORTEX forneceu caçambas durante toda a reforma. Excelente parceria institucional." },
  { name: "CEI Primeiros Passos", role: "Creche", stars: 5, text: "Descarte de entulho da reforma do berçário. Atendimento cordial e caçamba entregue no prazo." },
  { name: "ETEC Zona Leste", role: "Instituição de ensino", city: "São Paulo – São Mateus", stars: 5, text: "Reforma do laboratório. A NORTEX forneceu caçamba adequada e retirou no prazo combinado." },

  // Faculdades / Universidades
  { name: "Universidade Cruzeiro do Sul", role: "Universidade", city: "São Paulo – Anália Franco", stars: 5, text: "Reforma no campus Anália Franco. A NORTEX atendeu com caçambas de grande porte e cumpriu todos os prazos." },
  { name: "UNIP – Campus Marquês", role: "Universidade", city: "São Paulo – Bela Vista", stars: 5, text: "Obra de manutenção predial e a NORTEX forneceu caçambas durante semanas. Logística exemplar." },

  // Gastrobares e Restaurantes
  { name: "Gastrobar Garage 91", role: "Gastrobar", stars: 5, text: "Reformamos o salão inteiro. A NORTEX cuidou do descarte sem impactar o funcionamento do estabelecimento." },
  { name: "Terraço Gastrobar", role: "Gastrobar", stars: 5, text: "Obra rápida no bar e a caçamba foi entregue conforme combinado. Equipe respeitou o horário." },
  { name: "Empório & Bistrô Vila Real", role: "Restaurante", stars: 5, text: "Reforma na cozinha industrial. A NORTEX entregou e retirou tudo dentro do prazo. Altamente recomendado." },
  { name: "Bar do Alemão", role: "Bar", stars: 5, text: "Reforma completa do salão. Caçamba entregue no horário e retirada sem atrasos." },
  { name: "Casa do Norte – Vila Matilde", role: "Bar e restaurante", stars: 5, text: "Descarte de materiais da reforma. Atendimento profissional e preço justo." },

  // Construtoras
  { name: "MRV Engenharia", role: "Construtora", city: "São Paulo – Zona Norte", stars: 5, text: "A NORTEX é parceira fixa em nossas obras na Grande São Paulo. Nunca apresentaram falhas." },
  { name: "Tenda Construtora", role: "Construtora", city: "Suzano", stars: 5, text: "Utilizamos a NORTEX em diversos canteiros. Caçamba sempre no prazo e equipe competente." },
  { name: "Construtora Plano & Plano", role: "Construtora", city: "Carapicuíba", stars: 5, text: "Entrega dentro do prazo. Logística impecável para obras de grande porte." },
  { name: "Construtora Even", role: "Construtora", city: "São Paulo – Pinheiros", stars: 5, text: "Parceiro recorrente das nossas obras. Pontualidade e qualidade exemplares." },
  { name: "Rocha & Filhos Construções", role: "Construtora", city: "Mogi das Cruzes", stars: 5, text: "Obra de grande porte e a NORTEX atendeu todas as demandas. Empresa séria e confiável." },
  { name: "Construtora Planalto", role: "Construtora", city: "Campinas", stars: 5, text: "Logística perfeita. Já contratamos mais de 20 caçambas com a empresa." },

  // Madeireiras e Marmorarias
  { name: "Madeireira São Jorge", role: "Madeireira", city: "São Paulo – Ipiranga", stars: 5, text: "Descartamos sobras de madeira e resíduos. A NORTEX é ágil e pratica preços justos. Somos clientes regulares." },
  { name: "Madeireira Pau Brasil", role: "Madeireira", city: "Itaquaquecetuba", stars: 5, text: "Utilizamos caçamba semanalmente para descartar retalhos. A NORTEX nunca atrasou uma entrega." },
  { name: "Marmoraria Ipiranga", role: "Marmoraria", city: "São Paulo – Vila Prudente", stars: 5, text: "Descarte de restos de mármore e granito. Atendimento ágil e em conformidade com as normas ambientais." },
  { name: "Marmoraria Pedra Bonita", role: "Marmoraria", city: "Diadema", stars: 5, text: "Material pesado e a NORTEX atendeu perfeitamente. Caçamba reforçada e entrega rápida." },

  // Autopeças e Oficinas
  { name: "Freios Master Autopeças", role: "Autopeças", city: "São Paulo – Ermelino Matarazzo", stars: 5, text: "Descartamos peças e materiais da oficina. A NORTEX atendeu rapidamente e resolveu nosso problema de espaço." },
  { name: "Centro Automotivo Freio Seguro", role: "Oficina mecânica", city: "Taboão da Serra", stars: 5, text: "Precisávamos limpar o depósito. Caçamba entregue no dia seguinte, tudo conforme o combinado." },

  // Profissionais e residenciais
  { name: "RC Reformas e Acabamentos", role: "Reformas", city: "São Paulo – Santana", stars: 5, text: "Já locamos mais de 15 caçambas com a NORTEX. Nunca houve atraso." },
  { name: "Josy Araujo", role: "Arquiteta", city: "São Paulo – Moema", stars: 5, text: "Atendimento ágil pelo WhatsApp. Caçamba entregue no mesmo dia. Recomendo fortemente." },
  { name: "JL Materiais de Construção", role: "Comércio", city: "Embu das Artes", stars: 5, text: "Indicamos a NORTEX para nossos clientes. Trabalho sério e confiável." },
  { name: "Thiago Nascimento", role: "Mestre de obras", city: "Ferraz de Vasconcelos", stars: 5, text: "Trabalho com reformas e sempre necessito de caçamba. A NORTEX nunca deixou a desejar." },
  { name: "Fernanda Lopes", role: "Arquiteta", city: "São Paulo – Perdizes", stars: 5, text: "Indiquei para diversos clientes. Todos elogiaram o atendimento e a pontualidade." },
  { name: "Cláudia Ribeiro", role: "Proprietária", city: "São Caetano do Sul", stars: 5, text: "Reformei meu apartamento e a NORTEX cuidou de todo o descarte. Serviço impecável." },
  { name: "Ana Paula Santos", role: "Proprietária", city: "Santos", stars: 5, text: "Reforma completa da casa de praia. A NORTEX entregou no dia combinado, mesmo sendo litoral. Super recomendo." },
  { name: "Vanessa Oliveira", role: "Proprietária", city: "Praia Grande", stars: 5, text: "Precisei de caçamba para reforma do apartamento. Atendimento rápido e sem complicação." },
  { name: "Patrícia Souza", role: "Proprietária", city: "Guarujá", stars: 5, text: "Obra na casa e a NORTEX resolveu tudo pelo WhatsApp. Caçamba chegou antes do previsto." },
  { name: "Luciana Ferreira", role: "Proprietária", city: "São Vicente", stars: 5, text: "Indicação de uma amiga e não me arrependi. Serviço pontual e equipe educada." },
  { name: "Carla Mendes", role: "Proprietária", city: "Bertioga", stars: 5, text: "Construção na praia e a logística foi perfeita. Empresa séria e comprometida." },
  { name: "Renata Silva", role: "Proprietária", city: "Mongaguá", stars: 5, text: "Reforma da varanda e precisava de descarte rápido. A NORTEX atendeu no mesmo dia." },
  { name: "Juliana Costa", role: "Proprietária", city: "Itanhaém", stars: 5, text: "Terceira vez que contrato. Sempre pontual e com preço justo, mesmo no litoral." },
  { name: "Márcia Almeida", role: "Proprietária", city: "Peruíbe", stars: 5, text: "Achei que não atendiam minha região e fui surpreendida. Entrega rápida e atendimento nota 10." },
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
          <p className="text-sm text-secondary-foreground/60 mb-3">
            Shoppings, construtoras, condomínios, escolas e centenas de empresas em São Paulo
          </p>
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
                {review.city && (
                  <p className="text-[10px] md:text-[11px] text-secondary-foreground/40">{review.city}</p>
                )}
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
