import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import galleryEntulho from "@/assets/gallery-entulho.jpg";
import galleryComercial from "@/assets/gallery-comercial.jpg";
import galleryResidencial from "@/assets/gallery-residencial.jpg";
import gallery7m from "@/assets/gallery-7m.jpg";
import gallery5m from "@/assets/gallery-5m.jpg";
import gallery3m from "@/assets/gallery-3m.jpg";

const items = [
  { src: galleryEntulho, label: "Remoção de Entulho" },
  { src: galleryComercial, label: "Obra Comercial" },
  { src: galleryResidencial, label: "Entrega Residencial" },
  { src: gallery7m, label: "Caçamba 7 m³" },
  { src: gallery5m, label: "Caçamba 5 m³" },
  { src: gallery3m, label: "Caçamba 3 m³" },
];

const GallerySection = () => {
  return (
    <section className="bg-background py-14 md:py-20">
      <div className="container px-4 text-center">
        <h2 className="mb-10 text-2xl font-extrabold text-foreground md:text-3xl">
          Veja Nosso Trabalho
        </h2>

        <div className="mx-auto mb-10 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3">
          {items.map(({ src, label }) => (
            <div key={label} className="group relative overflow-hidden rounded-xl">
              <img
                src={src}
                alt={label}
                className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
                width={400}
                height={400}
              />
              <div className="absolute inset-x-0 bottom-0 bg-secondary/80 px-3 py-2">
                <span className="text-sm font-bold text-secondary-foreground">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-extrabold uppercase text-whatsapp-foreground shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
        >
          <MessageCircle className="h-5 w-5 fill-current" />
          Peça Sua Caçamba
        </a>
      </div>
    </section>
  );
};

export default GallerySection;
