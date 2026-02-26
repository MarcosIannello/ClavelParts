"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

interface ProductDetailActionsProps {
  product: Product;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-3">
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleAdd}
        className="w-full"
      >
        Agregar al carrito
      </Button>
      {added && (
        <p className="text-center text-xs text-sky-200">
          Producto agregado al carrito.
        </p>
      )}
      <p className="text-[11px] text-zinc-400">
        Podrás revisar tu compra y completar los datos de envío en el checkout.
      </p>
    </div>
  );
}

