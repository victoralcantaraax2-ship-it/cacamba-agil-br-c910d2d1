import { memo, useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const regioes = [
  { nome: "São Paulo (Capital)", cidades: "São Paulo, Zona Leste, Zona Sul, Zona Norte, Zona Oeste, Centro, Penha, Itaquera, Mooca, Ipiranga, Santana, Pinheiros, Butantã, Lapa, Vila Mariana, Tatuapé, Aricanduva, Ermelino Matarazzo, São Miguel Paulista, Guaianases, Cidade Tiradentes" },
  { nome: "Região Metropolitana", cidades: "Guarulhos, Osasco, Barueri, Cotia, Taboão da Serra, Carapicuíba, Embu das Artes, Itapecerica da Serra, Jandira, Itapevi, Franco da Rocha, Francisco Morato, Caieiras, Mairiporã, Santana de Parnaíba, Alphaville" },
  { nome: "ABC Paulista", cidades: "Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires, Rio Grande da Serra" },
  { nome: "Alto Tietê", cidades: "Mogi das Cruzes, Suzano, Itaquaquecetuba, Poá, Ferraz de Vasconcelos, Guararema, Biritiba Mirim, Arujá, Santa Isabel" },
  { nome: "Campinas e região", cidades: "Campinas, Sumaré, Hortolândia, Indaiatuba, Valinhos, Vinhedo, Americana, Santa Bárbara d'Oeste, Paulínia, Itatiba, Jaguariúna" },
  { nome: "Baixada Santista", cidades: "Santos, São Vicente, Praia Grande, Guarujá, Cubatão, Bertioga, Mongaguá, Itanhaém, Peruíbe" },
  { nome: "Vale do Paraíba", cidades: "São José dos Campos, Taubaté, Jacareí, Pindamonhangaba, Caçapava, Lorena, Guaratinguetá, Aparecida, Tremembé, Campos do Jordão" },
  { nome: "Sorocaba e região", cidades: "Sorocaba, Itu, Salto, Votorantim, Piedade, São Roque, Mairinque, Araçoiaba da Serra, Boituva, Tatuí" },
  { nome: "Interior de São Paulo", cidades: "Ribeirão Preto, São Carlos, Araraquara, Bauru, Marília, Presidente Prudente, Araçatuba, São José do Rio Preto, Franca, Piracicaba, Limeira, Jundiaí, Bragança Paulista, Atibaia, Mogi Guaçu, Mogi Mirim" },
];

const cidadeLinks = [
  { slug: "cacamba-sao-paulo", label: "São Paulo" },
  { slug: "cacamba-guarulhos", label: "Guarulhos" },
  { slug: "cacamba-osasco", label: "Osasco" },
  { slug: "cacamba-santo-andre", label: "Santo André" },
  { slug: "cacamba-sao-bernardo", label: "São Bernardo" },
  { slug: "cacamba-sao-caetano", label: "São Caetano" },
  { slug: "cacamba-campinas", label: "Campinas" },
  { slug: "cacamba-sorocaba", label: "Sorocaba" },
  { slug: "cacamba-ribeirao-preto", label: "Ribeirão Preto" },
  { slug: "cacamba-sao-jose-dos-campos", label: "São José dos Campos" },
  { slug: "cacamba-sao-jose-do-rio-preto", label: "S. J. Rio Preto" },
  { slug: "cacamba-jandira", label: "Jandira" },
];

const RegiaoCard = ({ nome, cidades }: { nome: string; cidades: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/40 hover:shadow-sm cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-card-foreground">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          {nome}
        </h3>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "mt-3 max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="text-xs text-muted-foreground leading-relaxed">{cidades}</p>
      </div>
    </button>
  );
};

const RegioesSection = memo(() => {
  return (
    <section id="regioes" className="bg-muted/30 py-14 md:py-20">
      <div className="container px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-foreground md:text-3xl">
            Regiões atendidas em São Paulo
          </h2>
          <p className="text-muted-foreground">
            Cobertura em toda a Grande São Paulo e principais cidades do estado
          </p>
        </div>

        <div className="mx-auto mb-10 flex flex-wrap items-center justify-center gap-2 max-w-3xl">
          {cidadeLinks.map(({ slug, label }) => (
            <Link
              key={slug}
              to={`/${slug}`}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-card-foreground transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <MapPin className="h-3 w-3 text-primary" />
              {label}
            </Link>
          ))}
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regioes.map(({ nome, cidades }) => (
            <RegiaoCard key={nome} nome={nome} cidades={cidades} />
          ))}
        </div>
      </div>
    </section>
  );
});

RegioesSection.displayName = "RegioesSection";

export default RegioesSection;
