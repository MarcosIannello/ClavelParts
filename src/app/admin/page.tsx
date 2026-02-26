import { fetchProducts } from "@/lib/api/products";

export default async function AdminDashboardPage() {
  const products = await fetchProducts();

  const totalProducts = products.length;
  const highlightedProducts = products.filter((p) => p.highlighted).length;
  const lowStockProducts = products.filter(
    (p) => typeof p.stock === "number" && p.stock <= 5,
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-400">
          Panel de administración
        </p>
        <h1 className="text-xl font-semibold text-zinc-50 md:text-2xl">
          Resumen de la tienda
        </h1>
        <p className="text-sm text-zinc-400">
          Métricas básicas con datos mock para empezar a trabajar el flujo de
          gestión. Luego se conectará a tu API real.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">
            Productos publicados
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">
            {totalProducts}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Basado en el catálogo mock actual.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">
            Destacados en home
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">
            {highlightedProducts}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Marcados como destacados para carruseles y grillas.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">
            Stock bajo
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-400">
            {lowStockProducts}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Productos con stock menor o igual a 5 unidades.
          </p>
        </div>
      </section>

      <section className="mt-2 rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-900/40 p-4 text-xs text-zinc-400">
        <p className="font-medium text-zinc-300">Próximos pasos</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>Conectar estas métricas con endpoints reales de tu API.</li>
          <li>
            Agregar tarjetas para órdenes, facturación y actividad de usuarios.
          </li>
          <li>
            Integrar filtros por rango de fechas y canales de venta
            (marketplace, tienda propia, etc.).
          </li>
        </ul>
      </section>
    </div>
  );
}

