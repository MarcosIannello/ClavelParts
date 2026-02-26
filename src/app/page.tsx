import Link from "next/link";
import { VehicleSelector } from "@/components/VehicleSelector";
import { HeroCarousel } from "@/components/HeroCarousel";
import { NewsCarousel } from "@/components/NewsCarousel";

const menuItems = [
  { label: "Todo el catálogo", href: "/catalogo" },
  { label: "Aceites", href: "/catalogo?category=aceites" },
  { label: "Neumáticos", href: "/catalogo?category=neumaticos" },
  { label: "Filtros", href: "/catalogo?category=filtros" },
  { label: "Off Road", href: "/catalogo?category=offroad" },
  { label: "The Racers Edge", href: "/catalogo?category=racing" },
];

export default function Home() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-4 md:px-6 md:pt-8">
      <nav className="rounded-2xl border border-zinc-800/70 bg-zinc-950/80 p-3 shadow-lg shadow-black/30">
        <ul className="flex flex-wrap items-center gap-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex h-9 items-center rounded-full border border-zinc-800/80 bg-zinc-900 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-200 transition hover:border-sky-500/60 hover:text-sky-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="space-y-4 rounded-3xl border border-zinc-800/70 bg-zinc-950/80 p-6 shadow-2xl shadow-black/40">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-400">
            Autopartes para tu vehículo
          </p>
          <h1 className="text-2xl font-semibold leading-tight text-zinc-50 md:text-3xl">
            Elegí tu auto y encontrá todo lo que necesita.
          </h1>
          <p className="max-w-xl text-sm text-zinc-400">
            Aceites, filtros, neumáticos, accesorios y performance. Tiendas
            verificadas, entrega en todo el país y compatibilidad asegurada.
          </p>
          <div className="mt-4">
            <VehicleSelector />
          </div>
        </div>
        <div className="h-full">
          <HeroCarousel />
        </div>
      </section>
      <NewsCarousel />
    </div>
  );
}
