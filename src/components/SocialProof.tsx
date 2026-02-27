import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import googleLogo from "@/assets/google-logo.png";


const reviews = [
  // Empresas da região
  { name: "MF Engenharia", role: "Construtora – Guarulhos/SP", text: "Usamos a AMBA em todas as nossas obras na região. Entrega rápida e preço competitivo. Parceria de confiança." },
  { name: "Papelão Guarulhos Reciclagem", role: "Reciclagem – Guarulhos/SP", text: "Precisávamos de caçamba urgente para descarte de papelão e entulho. Resolveram no mesmo dia, excelente!" },
  { name: "RC Reformas e Acabamentos", role: "Reformas – Guarulhos/SP", text: "Já alugamos mais de 15 caçambas com a AMBA. Sempre pontuais e com ótimo atendimento pelo WhatsApp." },
  { name: "Construtora Vila Galvão", role: "Construtora – Guarulhos/SP", text: "Fornecedor fixo das nossas obras. Nunca tivemos problema com prazo ou qualidade do serviço." },
  { name: "Ferro Velho São João", role: "Reciclagem – Guarulhos/SP", text: "Caçamba chegou no horário combinado. Equipe educada e profissional. Recomendo para qualquer empresa." },
  // Pessoa física
  { name: "Josy Araujo", role: "Arquiteta", text: "Atendimento pelo WhatsApp super rápido. A caçamba chegou no mesmo dia. Recomendo demais!" },
  { name: "Rogério Pereira", role: "Engenheiro Civil", text: "Muito satisfeito com o serviço. Equipe pontual e comprometida com o prazo." },
  { name: "Laudiane Sousa", role: "Proprietária de Imóvel", text: "Podem contratar sem medo. Processo simples e preço justo." },
  { name: "Nilson Fucítalo", role: "Mestre de Obras", text: "Cumprem o que prometem. Já é minha terceira locação com eles." },
  { name: "Carla Mendes", role: "Decoradora", text: "Muito fácil pedir pelo WhatsApp e a entrega foi rápida. Nota 10!" },
  { name: "Anderson Lima", role: "Proprietário – Guarulhos/SP", text: "Reformei minha casa e precisei de 2 caçambas. Preço justo e entrega no dia seguinte. Super indico!" },
  { name: "Patrícia Oliveira", role: "Síndica – Guarulhos/SP", text: "Contratei para o condomínio. Serviço impecável, sem sujeira na rua. Os moradores elogiaram." },
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
                <span className="text-sm font-bold text-secondary-foreground">5.0</span>
              </div>
            </div>
            
          </div>
          <p className="mt-2 text-sm text-secondary-foreground/60">
            Com base em mais de 60 avaliações de clientes reais
          </p>
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
            aria-label="Próxima avaliação"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
