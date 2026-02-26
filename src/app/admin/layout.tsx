import type { ReactNode } from "react";
import { AdminSidebarLink } from "@/components/admin/AdminSidebarLink";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pb-10 pt-6 md:flex-row md:gap-6 md:px-6">
      <aside className="flex flex-row gap-2 rounded-2xl border border-zinc-800/70 bg-zinc-950/80 p-3 text-xs text-zinc-200 md:h-[520px] md:w-64 md:flex-col md:gap-3 md:p-4">
        <div className="hidden flex-col gap-1 md:flex">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-400">
            Panel admin
          </span>
          <h2 className="text-sm font-semibold text-zinc-50">
            CLAVELPARTS · Autopartes
          </h2>
        </div>
        <nav className="flex flex-1 flex-row gap-2 md:flex-col">
          <AdminSidebarLink href="/admin" label="Resumen" />
          <AdminSidebarLink href="/admin/productos" label="Productos" />
        </nav>
      </aside>
      <section className="flex-1 rounded-2xl border border-zinc-800/70 bg-zinc-950/80 p-4 shadow-2xl shadow-black/40 md:p-6">
        {children}
      </section>
    </div>
  );
}
