"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<Product["category"], string> = {
  aceites: "Aceites",
  neumaticos: "Neumáticos",
  filtros: "Filtros",
  offroad: "Off Road",
  racing: "The Racers Edge",
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/80 shadow-lg shadow-black/40">
      <div className="relative h-40 w-full bg-zinc-900/80">
        {/* La imagen real se puede cargar cuando esté disponible en /public */}
        <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Imagen producto
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          <Badge variant="outline">{categoryLabels[product.category]}</Badge>
          {product.brandLabel && (
            <Badge variant="outline" className="border-sky-500/60 text-sky-200">
              {product.brandLabel}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-50">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-xs text-zinc-400">
            {product.description}
          </p>
        </div>
        <div className="mt-auto space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Precio
            </span>
            <span className="text-lg font-semibold text-zinc-50">
              ${product.price.toLocaleString("es-AR")}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              fullWidth
            >
              Agregar al carrito
            </Button>
            <Link
              href={`/producto/${product.id}`}
              className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-100 hover:border-sky-500 hover:text-white"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

