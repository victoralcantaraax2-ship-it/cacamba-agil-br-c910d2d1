import { useRef, useState } from "react";
import frota1 from "@/assets/frota-1.webp";
import frota2 from "@/assets/frota-2.webp";
import frota3 from "@/assets/frota-3.webp";

const images = [frota1, frota2, frota3];

const FrotaCarrossel = () => {
  const loop = [...images, ...images, ...images, ...images, ...images, ...images];
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setPaused(true);
    const el = trackRef.current;
    if (!el) return;
    dragState.current = { startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    const s = dragState.current;
    if (!el || !s) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 4) s.moved = true;
    el.scrollLeft = s.startScroll - dx;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const moved = dragState.current?.moved;
    dragState.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    // Tap (sem arraste) alterna pausa; arraste mantém pausado
    if (!moved) setPaused((p) => !p);
  };

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
        ref={trackRef}
        className={`relative w-full overflow-x-auto overflow-y-hidden touch-pan-y select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${paused ? "cursor-grab" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="flex gap-4 md:gap-6 animate-scroll-x [animation-duration:20s] md:[animation-duration:40s] w-max"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {loop.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-[280px] md:w-[420px] aspect-[4/3] overflow-hidden rounded-xl shadow-lg pointer-events-none"
            >
              <img
                src={src}
                alt={`Caçamba NORTEX ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrotaCarrossel;
