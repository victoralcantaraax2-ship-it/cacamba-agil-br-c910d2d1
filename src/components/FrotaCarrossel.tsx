import frota1 from "@/assets/frota-1.webp";

const images = [frota1];

const FrotaCarrossel = () => {
  // Duplicate for seamless loop
  const loop = [...images, ...images, ...images, ...images, ...images, ...images];

  return (
    <section className="bg-background py-12 md:py-16 overflow-hidden">
      <div className="container px-4 mb-8 text-center">
        <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">
          Nossa Frota de Caçambas
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Equipamentos próprios, conservados e prontos para sua obra
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 md:gap-6 animate-scroll-x">
          {loop.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-[280px] md:w-[420px] aspect-[4/3] overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={src}
                alt={`Caçamba NORTEX ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrotaCarrossel;
