import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useCallback, useRef } from "react";
import googleLogo from "@/assets/google-logo.webp";

const reviews = [
  { name: "RC Reformas e Acabamentos", role: "Reformas – São Paulo/SP", stars: 5, text: "Já alugamos mais de 15 caçambas com a AMBA. Nunca tiveram atraso." },
  { name: "Construtora JR", role: "Construtora – Jandira/SP", stars: 5, text: "Atendemos obras em Jandira e região. AMBA é parceira fixa, nunca falham." },
  { name: "MF Engenharia", role: "Construtora – Guarulhos/SP", stars: 5, text: "Usamos a AMBA em todas as nossas obras na região. Caçamba sempre no prazo e time competente." },
  { name: "Construtora Horizonte", role: "Construtora – Campinas/SP", stars: 5, text: "Mesmo em Campinas, a AMBA entregou no prazo. Logística impressionante!" },
  { name: "Reciclagem Paulista", role: "Reciclagem – Osasco/SP", stars: 5, text: "Precisávamos de caçamba urgente para descarte. Resolveram no mesmo dia, excelente!" },
  { name: "Construtora Vale", role: "Construtora – São José dos Campos/SP", stars: 5, text: "Atendimento excelente aqui no Vale do Paraíba. Caçamba chegou certinho." },
  { name: "Construtora Vila Verde", role: "Construtora – Santo André/SP", stars: 5, text: "Parceiro fixo das nossas obras no ABC. Pontualidade e qualidade impecáveis." },
  { name: "Construtora Ribeirão", role: "Construtora – Ribeirão Preto/SP", stars: 5, text: "Logística perfeita até Ribeirão Preto. Caçamba chegou no prazo." },
  { name: "Construtora Litoral", role: "Construtora – Santos/SP", stars: 5, text: "Obra na Baixada Santista e a AMBA entregou sem atraso. Excelente!" },
  { name: "JL Materiais de Construção", role: "Comércio – São Bernardo/SP", stars: 5, text: "Indicamos a AMBA para nossos clientes. Trabalho sério e confiável." },
  { name: "Construtora Americana", role: "Construtora – Americana/SP", stars: 5, text: "Serviço impecável em Americana. Logística rápida e eficiente." },
  { name: "Construtora Premium", role: "Construtora – Riviera de São Lourenço/SP", stars: 5, text: "Obra de alto padrão na Riviera. AMBA entregou com pontualidade e cuidado." },
  { name: "Josy Araujo", role: "Arquiteta – São Caetano/SP", stars: 5, text: "WhatsApp super ágil. Caçamba chegou no mesmo dia. Recomendo demais!" },
  { name: "Construtora Sorocabana", role: "Construtora – Sorocaba/SP", stars: 5, text: "Obras em Sorocaba com caçamba da AMBA. Sempre no prazo!" },
  { name: "Paulo Henrique", role: "Proprietário – Jandira/SP", stars: 5, text: "Reformei minha casa em Jandira e a AMBA entregou no dia seguinte. Muito satisfeito!" },
  { name: "Construtora Rio Preto", role: "Construtora – São José do Rio Preto/SP", stars: 5, text: "Atendimento chegou até Rio Preto sem problema. Muito bom!" },
  { name: "Ana Paula Santos", role: "Proprietária – Barueri/SP", stars: 5, text: "Reforma em Alphaville e a caçamba chegou certinha. Atendimento nota 10." },
  { name: "Ferro Velho São Jorge", role: "Reciclagem – Guarulhos/SP", stars: 5, text: "Caçamba no horário combinado. Pessoal educado e profissional. Recomendo para qualquer empresa." },
  { name: "Fábio Mendonça", role: "Construtor – Mogi das Cruzes/SP", stars: 5, text: "Obra em Mogi e a AMBA entregou sem atraso. Serviço sério!" },
  { name: "Ricardo Bastos", role: "Engenheiro – Campinas/SP", stars: 5, text: "Obra grande em Campinas e precisei de várias caçambas. Serviço impecável." },
  { name: "Construtora Serra", role: "Construtora – Jundiaí/SP", stars: 5, text: "Obras em Jundiaí atendidas com rapidez. AMBA é referência!" },
  { name: "Marcos Teixeira", role: "Empreiteiro – Diadema/SP", stars: 5, text: "Várias obras em Diadema. AMBA é minha primeira opção sempre." },
  { name: "Leandro Costa", role: "Mestre de Obras – São José dos Campos/SP", stars: 5, text: "Obra em SJC e precisei com urgência. Entregaram no mesmo dia!" },
  { name: "Terraplenagem Capital", role: "Terraplenagem – São Paulo/SP", stars: 5, text: "Serviço sólido, caçamba bem conservada. Sempre dentro do prazo." },
  { name: "Rafael Moreira", role: "Proprietário – Santos/SP", stars: 5, text: "Reforma em Santos, caçamba chegou no horário. Pessoal muito profissional." },
  { name: "Sandra Oliveira", role: "Síndica – Jandira/SP", stars: 5, text: "Contratei para descarte no condomínio. Rápido e dentro do combinado." },
  { name: "Gustavo Nogueira", role: "Engenheiro – Ribeirão Preto/SP", stars: 5, text: "Surpreendente a qualidade do serviço mesmo à distância. Nota 10!" },
  { name: "Simone Alves", role: "Proprietária – Cotia/SP", stars: 5, text: "Pedi pelo WhatsApp de manhã, à tarde já estava na porta. Excelente!" },
  { name: "Carlos Eduardo", role: "Empreiteiro – Americana/SP", stars: 5, text: "Contratei várias vezes. Sempre pontuais e com caçambas em bom estado." },
  { name: "Rogério Pereira", role: "Engenheiro Civil – Guarulhos/SP", stars: 5, text: "Muito satisfeito. Time pontual e comprometido." },
  { name: "Henrique Barros", role: "Engenheiro – Riviera de São Lourenço/SP", stars: 5, text: "Serviço diferenciado na Riviera. Caçamba limpa e entrega pontual." },
  { name: "Rodrigo Pinto", role: "Mestre de Obras – Taboão da Serra/SP", stars: 5, text: "Caçamba chegou no horário combinado. Equipe muito educada." },
  { name: "Laudiane Sousa", role: "Proprietária – Osasco/SP", stars: 5, text: "Podem contratar tranquilo. Processo simples e suporte de primeira." },
  { name: "Bruno Santana", role: "Mestre de Obras – Sorocaba/SP", stars: 5, text: "Entrega rápida e preço justo. Melhor opção em Sorocaba." },
  { name: "Fernanda Lopes", role: "Arquiteta – Campinas/SP", stars: 5, text: "Indiquei para clientes de Campinas. Todos elogiaram o atendimento." },
  { name: "Construtora Praia", role: "Construtora – Praia Grande/SP", stars: 5, text: "Obra na Praia Grande e a logística foi perfeita. Super recomendo!" },
  { name: "Nilson Fucítalo", role: "Mestre de Obras – Santo André/SP", stars: 5, text: "Cumprem o que prometem. Já é minha terceira locação." },
  { name: "Vanessa Martins", role: "Proprietária – São José dos Campos/SP", stars: 5, text: "Reformei minha casa e contratei a AMBA. Super recomendo!" },
  { name: "Construtora Itapevi", role: "Construtora – Itapevi/SP", stars: 5, text: "Entrega rápida aqui na região. Melhor custo-benefício com certeza." },
  { name: "Mariana Duarte", role: "Decoradora – Ribeirão Preto/SP", stars: 5, text: "Precisei descartar entulho de reforma. Rápido e sem complicação." },
  { name: "Carla Mendes", role: "Decoradora – São Paulo/SP", stars: 5, text: "Pedi pelo WhatsApp e a caçamba chegou voando. Nota 10!" },
  { name: "Diego Ferreira", role: "Engenheiro – São José do Rio Preto/SP", stars: 5, text: "Precisei com urgência e a AMBA resolveu rapidamente. Recomendo!" },
  { name: "Juliana Prado", role: "Arquiteta – Santos/SP", stars: 5, text: "Atendimento rápido pelo WhatsApp. Entregaram na Baixada sem problema." },
  { name: "Anderson Lima", role: "Proprietário – Guarulhos/SP", stars: 5, text: "Reformei minha casa e precisei de 2 caçambas. Chegaram no dia seguinte." },
  { name: "Tatiane Ramos", role: "Proprietária – Americana/SP", stars: 5, text: "Reformei a cozinha e precisei de caçamba. Chegou no dia seguinte!" },
  { name: "Construtora Alpha", role: "Construtora – Barueri/SP", stars: 5, text: "Parceiro de obras em Barueri. Sempre confiável e pontual." },
  { name: "Isabela Fonseca", role: "Arquiteta – Riviera de São Lourenço/SP", stars: 5, text: "Clientes da Riviera aprovaram. Descarte organizado e profissional." },
  { name: "Patrícia Oliveira", role: "Síndica – São Bernardo/SP", stars: 5, text: "Contratei para o condomínio. Serviço impecável, moradores elogiaram." },
  { name: "Camila Rodrigues", role: "Arquiteta – Jundiaí/SP", stars: 5, text: "Indiquei para três clientes em Jundiaí. Todos satisfeitos!" },
  { name: "José Carlos", role: "Pedreiro – Carapicuíba/SP", stars: 5, text: "Trabalho com reformas e sempre chamo a AMBA. Nunca tive problema." },
  { name: "Luís Fernando", role: "Engenheiro – Piracicaba/SP", stars: 5, text: "Mesmo no interior, a AMBA entregou com qualidade. Impressionante!" },
  { name: "Dona Maria Aparecida", role: "Aposentada – São Paulo/SP", stars: 5, text: "Meu filho indicou. Pedi pelo WhatsApp e no outro dia já estava na porta." },
  { name: "Thiago Nascimento", role: "Pedreiro autônomo – Osasco/SP", stars: 5, text: "Trabalho com reforma e sempre preciso de caçamba. AMBA nunca me deixou na mão." },
  { name: "Marmoraria Ipiranga", role: "Marmoraria – São Paulo/SP", stars: 5, text: "Descartamos restos de mármore e granito. Ágil e dentro das normas." },
  { name: "Reciclagem Oeste SP", role: "Reciclagem – Osasco/SP", stars: 5, text: "Atendimento nota 10. Caçamba chegou rápido e sem problema." },
  { name: "Luciana Ferreira", role: "Designer de Interiores – Santo André/SP", stars: 5, text: "Usei na reforma do escritório. Rápido e impecável." },
  { name: "Eduardo Takahashi", role: "Proprietário – São Paulo/SP", stars: 5, text: "Contratei da zona sul e entregaram sem problema. Suporte nota 10." },
  { name: "Felipe Monteiro", role: "Engenheiro – São Caetano/SP", stars: 5, text: "AMBA respondeu super rápido. Serviço impecável!" },
  { name: "Renata Campos", role: "Arquiteta – Guarulhos/SP", stars: 5, text: "Contratei para reforma residencial. Pontual e time muito educado." },
  { name: "Marcos Vinicius", role: "Construtor – Osasco/SP", stars: 5, text: "Suporte excelente. Caçamba chegou no prazo combinado." },
  { name: "Daniela Souza", role: "Síndica – São Bernardo/SP", stars: 5, text: "Contratei para limpeza do condomínio. Moradores aprovaram. Recomendo!" },
  { name: "Roberto Almeida", role: "Mestre de Obras – Santo André/SP", stars: 5, text: "Empresa séria. Entregaram dentro do prazo no ABC." },
  { name: "Cláudia Ribeiro", role: "Proprietária – São Paulo/SP", stars: 5, text: "Reformei meu apartamento e a AMBA cuidou de todo o descarte. Nota 10!" },
  { name: "André Machado", role: "Empreiteiro – Guarulhos/SP", stars: 5, text: "Caçamba bem conservada e entrega ágil. Já estou na segunda locação." },
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
            Clientes que confiam na AMBA
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
