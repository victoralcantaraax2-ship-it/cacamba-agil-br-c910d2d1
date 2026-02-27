import { Check, MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useNavigate } from "react-router-dom";

const sizes = [
  {
    size: "3m³",
    title: "Pequenas reformas",
    bags: "Aprox. 18 sacos",
    
    popular: false,
    benefits: ["Ideal para banheiros e cozinhas", "Descarte de entulho leve", "Entrega em até 24h", "Retirada programada"],
  },
  {
    size: "5m³",
    title: "Reformas médias",
    bags: "Aprox. 30 sacos",
    
    popular: true,
    benefits: ["Reformas completas de cômodos", "Sobras de construção", "Entrega em até 24h", "Retirada programada"],
  },
  {
    size: "7m³",
    title: "Grandes reformas",
    bags: "Aprox. 42 sacos",
    
    popular: false,
    benefits: ["Demolições parciais", "Obras maiores", "Entrega em até 24h", "Retirada programada"],
  },
  {
    size: "10m³",
    title: "Obras completas",
    bags: "Aprox. 60 sacos",
    
    popular: false,
    benefits: ["Construções e demolições", "Alto volume de entulho", "Entrega em até 24h", "Retirada programada"],
  },
];

const TamanhosSection = () => {
  const navigate = useNavigate();

  return (
    <section id="tamanhos" className="bg-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl lg:text-4xl">
            Escolha o Tamanho Ideal
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Selecione a caçamba que melhor atende sua necessidade. Todos os tamanhos com entrega rápida.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sizes.map((item) => (
            <div
              key={item.size}
              className={`relative flex flex-col rounded-2xl border-2 bg-card p-6 transition-all hover:shadow-xl ${
                item.popular
                  ? "border-primary shadow-lg scale-[1.02]"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {item.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase text-primary-foreground">
                  Mais popular
                </span>
              )}

              <div className="mb-4 text-center">
                <span className="text-4xl font-black text-foreground">{item.size}</span>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground/70">{item.bags}</p>
              </div>


              <ul className="mb-6 flex-1 space-y-2">
                {item.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-card-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {b}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/finalizacao")}
                className={`w-full rounded-lg py-3 text-sm font-bold uppercase transition-all hover:scale-105 ${
                  item.popular
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {item.popular ? "Pedir agora" : "Cotar agora"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-whatsapp transition-colors hover:underline"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            Dúvidas? Fale conosco pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default TamanhosSection;
