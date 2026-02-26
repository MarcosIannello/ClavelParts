import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api/products";
import { Badge } from "@/components/ui/Badge";
import { ProductDetailActions } from "@/components/ProductDetailActions";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductById(params.id);

  if (!product) {
    notFound();
  }

  const categoryLabelMap: Record<typeof product.category, string> = {
    aceites: "Aceites",
    neumaticos: "Neumáticos",
    filtros: "Filtros",
    offroad: "Off Road",
    racing: "The Racers Edge",
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pt-4 md:flex-row md:px-6 md:pt-8">
      <section className="flex-1 space-y-4 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 shadow-2xl shadow-black/40">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex h-56 flex-1 items-center justify-center rounded-2xl bg-zinc-900/80">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Imagen producto
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {categoryLabelMap[product.category]}
              </Badge>
              {product.brandLabel && (
                <Badge variant="outline" className="border-sky-500/60 text-sky-200">
                  {product.brandLabel}
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-semibold text-zinc-50 md:text-2xl">
              {product.name}
            </h1>
            <p className="text-sm text-zinc-300">{product.description}</p>
            <div className="mt-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Precio
              </p>
              <p className="text-2xl font-semibold text-zinc-50">
                ${product.price.toLocaleString("es-AR")}
              </p>
            </div>
          </div>
        </div>
        {product.compatibility.length > 0 && (
          <div className="mt-4 rounded-2xl border border-zinc-800/70 bg-zinc-900/80 p-4 text-sm text-zinc-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Compatibilidad por vehículo
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-zinc-300">
              {product.compatibility.map((compat) => (
                <li key={compat.versionId}>
                  Versión: <span className="font-medium">{compat.versionId}</span>
                  {compat.note && (
                    <span className="text-zinc-400"> · {compat.note}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <aside className="w-full max-w-sm rounded-3xl border border-sky-900/60 bg-sky-950/40 p-6 text-sm text-zinc-100 shadow-2xl shadow-black/40 md:w-80">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
          Comprar este producto
        </h2>
        <p className="mt-2 text-xs text-sky-100/80">
          Agregalo al carrito y completá tus datos en el checkout para coordinar
          el envío con la tienda.
        </p>
        <div className="mt-4">
          <ProductDetailActions product={product} />
        </div>
      </aside>
    </div>
  );
}

