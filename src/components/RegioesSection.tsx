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
      <section id="regioes" className="sr-only" aria-hidden="false">
        <div className="container px-4">
          <h2>Regiões atendidas em São Paulo</h2>
          <p>Atendimento rápido em toda a Grande São Paulo e principais regiões do estado</p>
          {regioes.map(({ nome, cidades }) => (
            <div key={nome}>
              <h3>{nome}</h3>
              <p>{cidades}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
});

RegioesSection.displayName = "RegioesSection";

export default RegioesSection;
