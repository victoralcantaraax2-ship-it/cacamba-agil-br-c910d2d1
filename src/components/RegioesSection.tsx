import { memo } from "react";
import { MapPin, Zap } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const regioes = [
  { nome: "São Paulo (Capital)", cidades: "São Paulo, Zona Leste, Zona Sul, Zona Norte, Zona Oeste, Centro, Penha, Itaquera, Mooca, Ipiranga, Santana, Pinheiros, Butantã, Lapa" },
  { nome: "Região Metropolitana", cidades: "Guarulhos, Osasco, Barueri, Cotia, Taboão da Serra, Carapicuíba, Embu das Artes, Itapecerica da Serra, Jandira, Itapevi" },
  { nome: "ABC (Santo André, São Bernardo, São Caetano)", cidades: "Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires, Rio Grande da Serra" },
  { nome: "Alto Tietê", cidades: "Mogi das Cruzes, Suzano, Itaquaquecetuba, Poá, Ferraz de Vasconcelos, Guararema, Biritiba Mirim" },
  { nome: "Campinas e região", cidades: "Campinas, Sumaré, Hortolândia, Indaiatuba, Valinhos, Vinhedo, Americana, Santa Bárbara d'Oeste, Paulínia" },
  { nome: "Baixada Santista", cidades: "Santos, São Vicente, Praia Grande, Guarujá, Cubatão, Bertioga, Mongaguá, Itanhaém, Peruíbe" },
  { nome: "Vale do Paraíba", cidades: "São José dos Campos, Taubaté, Jacareí, Pindamonhangaba, Caçapava, Lorena, Guaratinguetá, Aparecida" },
  { nome: "Sorocaba e região", cidades: "Sorocaba, Itu, Salto, Votorantim, Piedade, São Roque, Mairinque, Araçoiaba da Serra" },
  { nome: "Interior de São Paulo", cidades: "Ribeirão Preto, São Carlos, Araraquara, Bauru, Marília, Presidente Prudente, Araçatuba, São José do Rio Preto, Franca, Piracicaba, Limeira, Jundiaí" },
];

const RegioesSection = memo(() => {
  return (
    <>
      {/* Visible section */}
      <section id="regioes" className="bg-secondary py-16 md:py-28">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-extrabold text-secondary-foreground md:text-4xl">
              Regiões atendidas em São Paulo
            </h2>
            <p className="text-sm text-secondary-foreground/60 md:text-base">
              Atendimento rápido em toda a Grande São Paulo e principais regiões do estado
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
            {regioes.map(({ nome, cidades }) => (
              <div
                key={nome}
                className="rounded-2xl border-2 border-white/10 bg-white/5 p-5 md:p-6 transition-all hover:border-primary/40 hover:bg-white/10 hover:shadow-lg"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-secondary-foreground md:text-base">{nome}</h3>
                </div>
                <p className="sr-only">{cidades}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-base font-bold text-secondary-foreground md:text-lg">
              Precisa de caçamba na sua região?
            </p>
            <button
              onClick={() => handleWhatsAppClick("Olá! Gostaria de saber se vocês atendem a minha região. Podem me ajudar?")}
              className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-extrabold uppercase text-white shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
              CONSULTAR DISPONIBILIDADE AGORA
            </button>
            <span className="flex items-center gap-1.5 text-xs text-secondary-foreground/50">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Entrega rápida em até 2 horas
            </span>
          </div>
        </div>
      </section>
    </>
  );
});

RegioesSection.displayName = "RegioesSection";

export default RegioesSection;
