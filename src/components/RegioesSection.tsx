import { memo } from "react";
import { MapPin, Zap } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const regioes = [
  { nome: "Capital Paulista", cidades: "São Paulo, Zona Leste, Zona Sul, Zona Norte, Zona Oeste, Centro, Penha, Itaquera, Mooca, Ipiranga, Santana, Pinheiros, Butantã, Lapa" },
  { nome: "Grande São Paulo", cidades: "Guarulhos, Osasco, Barueri, Cotia, Taboão da Serra, Carapicuíba, Embu das Artes, Itapecerica da Serra, Jandira, Itapevi" },
  { nome: "ABC Paulista", cidades: "Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires, Rio Grande da Serra" },
  { nome: "Alto Tietê", cidades: "Mogi das Cruzes, Suzano, Itaquaquecetuba, Poá, Ferraz de Vasconcelos, Guararema, Biritiba Mirim" },
  { nome: "Região de Campinas", cidades: "Campinas, Sumaré, Hortolândia, Indaiatuba, Valinhos, Vinhedo, Americana, Santa Bárbara d'Oeste, Paulínia" },
  { nome: "Baixada Santista", cidades: "Santos, São Vicente, Praia Grande, Guarujá, Cubatão, Bertioga, Mongaguá, Itanhaém, Peruíbe" },
  { nome: "Vale do Paraíba", cidades: "São José dos Campos, Taubaté, Jacareí, Pindamonhangaba, Caçapava, Lorena, Guaratinguetá, Aparecida" },
  { nome: "Região de Sorocaba", cidades: "Sorocaba, Itu, Salto, Votorantim, Piedade, São Roque, Mairinque, Araçoiaba da Serra" },
  { nome: "Interior Paulista", cidades: "Ribeirão Preto, São Carlos, Araraquara, Bauru, Marília, Presidente Prudente, Araçatuba, São José do Rio Preto, Franca, Piracicaba, Limeira, Jundiaí" },
];

const RegioesSection = memo(() => {
  return (
    <section id="regioes" className="sr-only" aria-hidden="false">
      <h2>Onde a NORTEX atende – Aluguel de Caçamba em São Paulo</h2>
      {regioes.map(({ nome, cidades }) => (
        <div key={nome}>
          <h3>{nome}</h3>
          <p>{cidades}</p>
        </div>
      ))}
    </section>
  );
});

RegioesSection.displayName = "RegioesSection";

export default RegioesSection;
