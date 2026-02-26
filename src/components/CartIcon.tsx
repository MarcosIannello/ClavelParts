"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrito"
      aria-label={`Carrito con ${totalItems} item${totalItems === 1 ? "" : "s"}`}
      className="relative inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[var(--header-control-border)] bg-[var(--header-control-bg)] px-4 text-xs font-medium uppercase tracking-[0.16em] text-[var(--header-control-text)] hover:border-[var(--header-nav-active-bg)]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 stroke-current"
        fill="none"
        strokeWidth="1.8"
      >
        <circle cx="9" cy="20" r="1.25" />
        <circle cx="17" cy="20" r="1.25" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 4h2l1.4 8.6a2 2 0 0 0 2 1.7h8a2 2 0 0 0 2-1.6L20 7H7.2"
        />
      </svg>
      <span>Carrito</span>
      <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-500 text-[10px] font-semibold text-white">
        {totalItems}
      </span>
    </Link>
  );
}
