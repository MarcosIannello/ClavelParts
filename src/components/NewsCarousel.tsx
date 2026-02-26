"use client";

import { useRef } from "react";
import { Button } from "./ui/Button";

const items = [
  {
    id: 1,
    title: "Tienda Off Road Patagonia",
    description: "Kit de suspensión + cubiertas all terrain",
    tag: "Promo de la semana",
  },
  {
    id: 2,
    title: "Lubricentro Córdoba",
    description: "Cambio de aceite + filtro con turno online",
    tag: "Turnos 24/7",
  },
  {
    id: 3,
    title: "Garage Racing BA",
    description: "Pastillas, discos y performance para pista",
    tag: "The Racers Edge",
  },
  {
    id: 4,
    title: "Neumáticos Norte",
    description: "Neumáticos para pick-ups y SUV",
    tag: "Envio a todo el país",
  },
];

export function NewsCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = direction === "left" ? -320 : 320;
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="mt-10 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-500">
            NOVEDADES
          </p>
          <h2 className="text-lg font-semibold text-zinc-900">
            De las tiendas que sigo
          </h2>
        </div>
        <div className="hidden gap-2 md:flex">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => scroll("left")}
            className="border border-zinc-200 bg-white/80 px-3 text-xs"
          >
            ◀
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => scroll("right")}
            className="border border-zinc-200 bg-white/80 px-3 text-xs"
          >
            ▶
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
      >
        {items.map((item) => (
          <article
            key={item.id}
            className="relative flex h-40 min-w-[260px] max-w-xs snap-start flex-col justify-between rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-sky-800 p-4 text-white shadow-md"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                {item.tag}
              </p>
              <h3 className="mt-2 text-sm font-semibold">{item.title}</h3>
              <p className="mt-1 text-xs text-zinc-200">{item.description}</p>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
              Ver catálogo
            </p>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-sky-400/40 via-sky-300/10 to-transparent blur-2xl" />
          </article>
        ))}
      </div>
    </section>
  );
}

