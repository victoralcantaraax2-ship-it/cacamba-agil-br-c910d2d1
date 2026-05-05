import { useState } from "react";
import frota1 from "@/assets/frota-1.webp";
import frota2 from "@/assets/frota-2.webp";
import frota3 from "@/assets/frota-3.webp";
import frota4 from "@/assets/frota-4.webp";

const images = [frota1, frota2, frota3, frota4];

const FrotaCarrossel = () => {
  const loop = [...images, ...images];
  const [paused, setPaused] = useState(false);

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

      <div
        className="relative w-full overflow-hidden select-none cursor-pointer"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
      >
        <div
          className="flex gap-4 md:gap-6 animate-scroll-x [animation-duration:20s] md:[animation-duration:40s]"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {loop.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-[280px] md:w-[420px] aspect-[4/3] overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={src}
                alt={`Caçamba NORTEX ${i + 1}`}
                className="h-full w-full object-cover pointer-events-none select-none"
                loading="eager"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrotaCarrossel;
