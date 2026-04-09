import { memo } from "react";
import { MapPin, Zap } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const regioes = [
  { nome: "Zona Leste", cidades: "Penha, Itaquera, São Mateus, Mooca, Ermelino Matarazzo, Guaianases" },
  { nome: "Zona Sul", cidades: "Ipiranga, Santo Amaro, Jabaquara, Grajaú, Campo Limpo, Capela do Socorro" },
  { nome: "Zona Norte", cidades: "Santana, Tucuruvi, Vila Maria, Tremembé, Casa Verde, Jaçanã" },
  { nome: "Zona Oeste", cidades: "Pinheiros, Butantã, Lapa, Perdizes, Jaguaré, Rio Pequeno" },
  { nome: "Centro de SP", cidades: "Sé, República, Bela Vista, Liberdade, Santa Cecília, Consolação" },
  { nome: "Região Metropolitana", cidades: "Guarulhos, Osasco, Barueri, Cotia, Taboão da Serra, Carapicuíba" },
  { nome: "ABC Paulista", cidades: "Santo André, São Bernardo, São Caetano, Diadema, Mauá, Ribeirão Pires" },
  { nome: "Alto Tietê", cidades: "Mogi das Cruzes, Suzano, Itaquaquecetuba, Poá, Ferraz de Vasconcelos" },
];

const RegioesSection = memo(() => {
  return (
    <section id="regioes" className="bg-secondary py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-secondary-foreground md:text-3xl">
            Atendemos Sua Região
          </h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary">Entrega rápida na sua região</span>
          </div>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {regioes.map(({ nome, cidades }) => (
            <div
              key={nome}
              className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-5 transition-all hover:border-primary/30 hover:bg-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <h3 className="text-sm font-bold text-secondary-foreground md:text-base">{nome}</h3>
              </div>
              <p className="sr-only">{cidades}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => handleWhatsAppClick("Olá! Gostaria de saber se vocês atendem a minha região. Podem me ajudar?")}
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
            Consultar minha região
          </button>
        </div>
      </div>
    </section>
  );
});

RegioesSection.displayName = "RegioesSection";

export default RegioesSection;
