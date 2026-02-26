"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function CartSummary() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 text-center text-sm text-zinc-300 shadow-2xl shadow-black/40">
        <p className="text-base font-semibold text-zinc-50">
          Tu carrito está vacío.
        </p>
        <p className="text-sm text-zinc-400">
          Buscá autopartes para tu vehículo desde la landing o el catálogo.
        </p>
        <div className="mt-2">
          <Link
            href="/catalogo"
            className="inline-flex h-10 items-center justify-center rounded-full bg-sky-600 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-sky-500"
          >
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row">
      <section className="flex-1 space-y-4 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 shadow-2xl shadow-black/40">
        <h1 className="text-lg font-semibold text-zinc-50">
          Carrito de compras
        </h1>
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-4"
            >
              <div className="hidden h-16 w-16 items-center justify-center rounded-xl bg-zinc-950/80 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:flex">
                Img
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-50">
                      {item.name}
                    </h2>
                    <p className="text-xs text-zinc-400">
                      ${item.price.toLocaleString("es-AR")} c/u
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-red-400"
                  >
                    Quitar
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="w-32">
                    <Input
                      type="number"
                      min={1}
                      label="Cantidad"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value, 10);
                        if (Number.isNaN(value)) return;
                        updateQuantity(item.id, value);
                      }}
                    />
                  </div>
                  <div className="text-sm font-semibold text-zinc-50">
                    Total: $
                    {(item.price * item.quantity).toLocaleString("es-AR")}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-zinc-800/70 pt-4 text-sm">
          <button
            type="button"
            onClick={clearCart}
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-red-400"
          >
            Vaciar carrito
          </button>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Subtotal
            </p>
            <p className="text-lg font-semibold text-zinc-50">
              ${totalPrice.toLocaleString("es-AR")}
            </p>
          </div>
        </div>
      </section>
      <aside className="w-full max-w-sm space-y-4 rounded-3xl border border-sky-900/60 bg-sky-950/40 p-6 text-sm text-zinc-100 shadow-2xl shadow-black/40 md:w-80">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
          Resumen
        </h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-300">Productos</span>
          <span className="font-medium">
            ${totalPrice.toLocaleString("es-AR")}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>Envío</span>
          <span>A calcular en el checkout</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-sky-900/60 pt-3 text-sm">
          <span className="font-semibold">Total estimado</span>
          <span className="text-base font-semibold text-sky-200">
            ${totalPrice.toLocaleString("es-AR")}
          </span>
        </div>
        <Link
          href="/checkout"
          className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-sky-600 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-sky-500"
        >
          Ir al checkout
        </Link>
      </aside>
    </div>
  );
}

