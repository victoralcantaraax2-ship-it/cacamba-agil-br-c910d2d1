import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import googleLogo from "@/assets/google-logo.png";

const reviews = [
  { name: "MF Engenharia", role: "Construtora – Guarulhos/SP", stars: 5, text: "Usamos a AMBA em todas as nossas obras na região. Entrega rápida e equipe muito profissional." },
  { name: "Papelão Guarulhos Reciclagem", role: "Reciclagem – Guarulhos/SP", stars: 5, text: "Precisávamos de caçamba urgente para descarte de papelão e entulho. Resolveram no mesmo dia, excelente!" },
  { name: "RC Reformas e Acabamentos", role: "Reformas – Guarulhos/SP", stars: 5, text: "Já alugamos mais de 15 caçambas com a AMBA. Sempre pontuais e com ótimo atendimento pelo WhatsApp." },
  { name: "Construtora Vila Galvão", role: "Construtora – Guarulhos/SP", stars: 5, text: "Fornecedor fixo das nossas obras. Nunca tivemos problema com prazo ou qualidade do serviço." },
  { name: "Ferro Velho São João", role: "Reciclagem – Guarulhos/SP", stars: 5, text: "Caçamba chegou no horário combinado. Equipe educada e profissional. Recomendo para qualquer empresa." },
  { name: "Terraplenagem Norte SP", role: "Terraplenagem – Guarulhos/SP", stars: 5, text: "Bom serviço, caçamba bem conservada. Entrega dentro do prazo combinado." },
  { name: "JL Materiais de Construção", role: "Comércio – Guarulhos/SP", stars: 5, text: "Indicamos a AMBA para todos os nossos clientes. Serviço sério e confiável." },
  { name: "Reciclagem Cumbica", role: "Reciclagem – Guarulhos/SP", stars: 5, text: "Atendimento excelente. Entrega foi rápida e tudo correu bem." },
  { name: "Marmoraria Presidente Dutra", role: "Marmoraria – Guarulhos/SP", stars: 5, text: "Descartamos resíduos de mármore e granito. Serviço rápido e dentro das normas ambientais." },
  { name: "Josy Araujo", role: "Arquiteta – Mogi das Cruzes/SP", stars: 5, text: "Atendimento pelo WhatsApp super rápido. A caçamba chegou no mesmo dia. Recomendo demais!" },
  { name: "Rogério Pereira", role: "Engenheiro Civil – Campinas/SP", stars: 5, text: "Muito satisfeito com o serviço. Equipe pontual e comprometida com o prazo." },
  { name: "Laudiane Sousa", role: "Proprietária de Imóvel – Barueri/SP", stars: 5, text: "Podem contratar sem medo. Processo simples e atendimento excelente." },
  { name: "Nilson Fucítalo", role: "Mestre de Obras – Juiz de Fora/MG", stars: 5, text: "Cumprem o que prometem. Já é minha terceira locação com eles." },
  { name: "Carla Mendes", role: "Decoradora – Belo Horizonte/MG", stars: 5, text: "Muito fácil pedir pelo WhatsApp e a entrega foi rápida. Nota 10!" },
  { name: "Anderson Lima", role: "Proprietário – Guarulhos/SP", stars: 5, text: "Reformei minha casa e precisei de 2 caçambas. Entrega no dia seguinte. Super indico!" },
  { name: "Patrícia Oliveira", role: "Síndica – Guarulhos/SP", stars: 5, text: "Contratei para o condomínio. Serviço impecável, sem sujeira na rua. Os moradores elogiaram." },
  { name: "Dona Maria Aparecida", role: "Aposentada – Itapecerica da Serra/SP", stars: 5, text: "Meu filho indicou. Pedi pelo WhatsApp e no outro dia já estava na porta. Muito prático!" },
  { name: "Thiago Nascimento", role: "Pedreiro autônomo – Uberaba/MG", stars: 5, text: "Trabalho com reforma e sempre preciso de caçamba. A AMBA nunca me deixou na mão." },
  { name: "Luciana Ferreira", role: "Designer de Interiores – Campinas/SP", stars: 5, text: "Usei na reforma do meu escritório. Entrega rápida e serviço impecável." },
  { name: "Eduardo Takahashi", role: "Proprietário – São Paulo/SP", stars: 5, text: "Contratei de SP mesmo e entregaram em Guarulhos sem problema. Atendimento nota 10." },
  { name: "Felipe Monteiro", role: "Engenheiro – Mogi das Cruzes/SP", stars: 5, text: "Precisei de caçamba para uma obra em Mogi e a AMBA atendeu super rápido. Serviço impecável!" },
  { name: "Renata Campos", role: "Arquiteta – Itapecerica da Serra/SP", stars: 5, text: "Contratei para reforma residencial em Itapecerica. Entrega pontual e equipe muito educada." },
  { name: "Marcos Vinicius", role: "Construtor – Campinas/SP", stars: 5, text: "Mesmo sendo em Campinas, o atendimento foi excelente. Caçamba chegou no prazo combinado." },
  { name: "Daniela Souza", role: "Síndica – Barueri/SP", stars: 5, text: "Contratei para limpeza do condomínio em Barueri. Moradores aprovaram o serviço. Recomendo!" },
  { name: "Roberto Almeida", role: "Mestre de Obras – Juiz de Fora/MG", stars: 5, text: "Empresa séria e comprometida. Entregaram dentro do prazo na região de Juiz de Fora." },
  { name: "Cláudia Ribeiro", role: "Proprietária – Belo Horizonte/MG", stars: 5, text: "Reformei meu apartamento em BH e a AMBA cuidou de todo o descarte. Serviço nota 10!" },
  { name: "André Machado", role: "Empreiteiro – Uberaba/MG", stars: 5, text: "Caçamba bem conservada e entrega rápida em Uberaba. Já estou na segunda locação com eles." },
];

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

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
    <section id="depoimentos" className="bg-secondary py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-secondary-foreground md:text-3xl">
            O que nossos clientes dizem
          </h2>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex flex-col items-center gap-1">
              <img src={googleLogo} alt="Google" className="h-7 w-auto" />
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-star text-star" />
                  ))}
                </div>
                <span className="text-sm font-bold text-secondary-foreground">4.8</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <button
            onClick={prev}
            className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-secondary-foreground/10 p-2 text-secondary-foreground shadow-lg transition-colors hover:bg-secondary-foreground/20 md:-left-5"
            aria-label="Avaliação anterior"
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
                    <Star key={i} className={`h-4 w-4 ${i < review.stars ? "fill-star text-star" : "fill-muted text-muted"}`} />
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
            aria-label="Próxima avaliação"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => scrollTo("#tamanhos")}
            className="rounded-xl bg-primary px-8 py-4 text-base font-bold uppercase text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90"
          >
            Quero pedir agora
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
