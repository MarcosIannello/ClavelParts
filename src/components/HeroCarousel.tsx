"use client";

import { useState, useEffect } from "react";
import { Badge } from "./ui/Badge";

const slides = [
  {
    id: 1,
    title: "AUTOPARTES PARA TU PICK-UP",
    subtitle: "Amortiguadores, cubiertas y equipamiento off-road",
    highlight: "Financiación en 6 cuotas",
  },
  {
    id: 2,
    title: "CAMBIÁ EL ACEITE SIN DUDAS",
    subtitle: "Encontrá el aceite exacto para tu motor",
    highlight: "Filtros y lubricantes premium",
  },
  {
    id: 3,
    title: "THE RACERS EDGE",
    subtitle: "Performance y racing para los que van más allá",
    highlight: "Líneas deportivas seleccionadas",
  },
];

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <div className="relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-950 to-sky-900 p-6 text-white shadow-xl shadow-black/40">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Badge variant="outline">NUEVO</Badge>
          <h2 className="mt-3 max-w-xs text-xl font-semibold leading-tight md:text-2xl">
            {activeSlide.title}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-300">
            {activeSlide.subtitle}
          </p>
        </div>
        <div className="hidden h-24 w-24 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/20 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-100 md:flex">
          CLAVEL
          <br />
          PARTS
        </div>
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <p className="text-sm font-medium text-sky-200">
          {activeSlide.highlight}
        </p>
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-7 bg-sky-400"
                  : "w-2.5 bg-zinc-600 hover:bg-zinc-400"
              }`}
              aria-label={`Ver slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-sky-500/20 via-sky-400/5 to-transparent blur-3xl" />
    </div>
  );
}

