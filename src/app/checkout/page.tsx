"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createOrder } from "@/lib/api/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    orderNumber: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!items.length) {
      setError("Tu carrito está vacío.");
      return;
    }

    if (!customerName || !customerEmail || !shippingAddress) {
      setError("Completá al menos nombre, email y dirección de envío.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        customerName,
        customerEmail,
        customerPhone: customerPhone || undefined,
        shippingAddress,
        notes: notes || undefined,
        total: totalPrice,
      };

      const result = await createOrder(payload);
      setConfirmation({ orderNumber: result.orderNumber });
      clearCart();
    } catch {
      setError("Ocurrió un error al registrar tu pedido. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length && confirmation) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 pt-8 md:px-6">
        <div className="space-y-3 rounded-3xl border border-sky-900/60 bg-sky-950/50 p-6 text-sm text-sky-50 shadow-2xl shadow-black/40">
          <h1 className="text-lg font-semibold">
            ¡Gracias por tu compra en CLAVELPARTS!
          </h1>
          <p className="text-sm text-sky-100/80">
            Registramos tu pedido con el número{" "}
            <span className="font-semibold">{confirmation.orderNumber}</span>.
          </p>
          <p className="text-xs text-sky-100/80">
            Pronto vas a recibir un email con los detalles y la tienda se
            contactará para coordinar el envío.
          </p>
          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => router.push("/")}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pt-4 md:flex-row md:px-6 md:pt-8">
      <section className="flex-1 space-y-4 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 shadow-2xl shadow-black/40">
        <h1 className="text-lg font-semibold text-zinc-50">
          Checkout · Datos de contacto y envío
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="Nombre y apellido"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="Teléfono (opcional)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <Input
              label="Dirección de envío"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="flex w-full flex-col gap-1 text-xs font-medium text-zinc-500">
              <span className="uppercase tracking-wide">
                Comentarios para la tienda (opcional)
              </span>
              <textarea
                className="min-h-[80px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" disabled={loading}>
              {loading ? "Confirmando pedido..." : "Confirmar compra"}
            </Button>
          </div>
        </form>
      </section>
      <aside className="w-full max-w-sm space-y-4 rounded-3xl border border-sky-900/60 bg-sky-950/40 p-6 text-sm text-zinc-100 shadow-2xl shadow-black/40 md:w-80">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
          Resumen de compra
        </h2>
        {items.length === 0 ? (
          <p className="text-xs text-sky-100/70">
            No hay productos en tu carrito. Volvé al catálogo para agregar
            autopartes antes de finalizar la compra.
          </p>
        ) : (
          <>
            <ul className="space-y-2 text-xs text-sky-100/80">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span className="flex-1">
                    {item.name}{" "}
                    <span className="text-sky-300">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold">
                    $
                    {(item.price * item.quantity).toLocaleString("es-AR")}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-sky-900/60 pt-3 text-sm">
              <span className="font-semibold">Total productos</span>
              <span className="text-base font-semibold text-sky-200">
                ${totalPrice.toLocaleString("es-AR")}
              </span>
            </div>
            <p className="text-[11px] text-sky-100/70">
              El costo de envío y el medio de pago se coordinarán con la tienda.
            </p>
          </>
        )}
      </aside>
    </div>
  );
}

