"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartIcon } from "./CartIcon";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const router = useRouter();
  const { user, status, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--header-border)] bg-[var(--header-bg)] shadow-lg shadow-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--brand-badge-bg)] text-[10px] font-black tracking-[0.22em] text-[var(--brand-badge-text)]">
            CP
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-title)]">
              CLAVELPARTS
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--brand-subtitle)]">
              Autopartes online
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/producto/__prueba-not-found__"
            className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--header-link)] hover:text-[var(--header-link-hover)] md:inline-flex"
          >
            Mi Garage
          </Link>
          <CartIcon />
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-[var(--header-skeleton)]" />
          ) : user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="hidden h-9 items-center rounded-full border border-[var(--header-control-border)] bg-[var(--header-control-bg)] px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--header-control-text)] hover:border-red-500 hover:text-red-200 md:inline-flex"
            >
              {user.name ? user.name.split(" ")[0] ?? "Cuenta" : "Cuenta"}
              <span className="ml-1 text-[var(--brand-subtitle)]">·</span>
              <span className="ml-1 text-red-400">Salir</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden h-9 items-center rounded-full bg-[var(--header-nav-active-bg)] px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--header-nav-active-text)] hover:brightness-110 md:inline-flex"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
      <div className="border-t border-[var(--header-strip-border)] bg-[var(--header-strip-bg)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--header-strip-text)] md:px-6">
          <span>Envíos a todo el país</span>
          <span className="hidden md:inline">
            Pagá en cuotas · Tiendas verificadas
          </span>
        </div>
      </div>
    </header>
  );
}
