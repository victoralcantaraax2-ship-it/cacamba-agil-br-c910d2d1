import { memo } from "react";
import { Clock, ShieldCheck, Leaf, Users, Truck, HardHat, Home, Building2, Warehouse } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";
import badgeAward from "@/assets/badge-award.png";

const pillars: { icon?: any; image?: string; label: string; desc: string }[] = [
  { icon: Clock, label: "No horário certo", desc: "A gente chega na hora combinada. Pode confiar." },
  { icon: ShieldCheck, label: "Preço sem surpresa", desc: "Você sabe quanto vai pagar antes de fechar. Sem taxa escondida." },
  { icon: Leaf, label: "Descarte certinho", desc: "Levamos o entulho pra lugar certo, tudo dentro da lei." },
  { image: badgeAward, label: "Anos de estrada", desc: "Não somos de ontem. Milhares de clientes já passaram por aqui." },
  { icon: Users, label: "Atendimento de gente", desc: "Você fala direto com a gente. Sem robô, sem espera." },
  { icon: Truck, label: "Frota própria", desc: "Nossos caminhões, nossa equipe. Isso garante agilidade." },
];

const segments = [
  { icon: HardHat, label: "Construtoras" },
  { icon: Home, label: "Reformas" },
  { icon: Building2, label: "Condomínios" },
  { icon: Warehouse, label: "Comércios" },
];

const AboutSection = memo(() => {
  return (
    <section id="sobre-nos" className="bg-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
            Quem é a NORTEX?
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed text-base md:text-lg">
            A <span className="font-bold text-foreground">NORTEX Caçambas</span> tá no mercado há anos, alugando caçamba pra obra, reforma e demolição. A gente atende de ponta a ponta — do pedido até a retirada.
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Pode ser uma reforminha no banheiro ou uma obra grande de construtora: o atendimento é o mesmo. Rápido, direto e sem enrolação.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Nosso foco é um só: <span className="font-bold text-foreground">resolver o seu problema de entulho rápido, com preço justo e sem dor de cabeça</span>. É por isso que o pessoal volta e indica.
          </p>
        </div>

        <div className="mx-auto mb-12 flex flex-wrap items-center justify-center gap-3 max-w-2xl">
          {segments.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-card-foreground">{label}</span>
            </div>
          ))}
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {pillars.map(({ icon: Icon, image, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-md">
              {image ? (
                <img src={image} alt={label} className="h-12 w-12 object-contain" width={48} height={48} />
              ) : Icon ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              ) : null}
              <h3 className="text-base font-bold text-card-foreground">{label}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 text-center">
          <button
            onClick={() => handleWhatsAppClick()}
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-extrabold uppercase text-white shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
            Pedir cotação grátis
          </button>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
