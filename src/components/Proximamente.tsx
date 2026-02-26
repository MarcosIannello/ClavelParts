import Link from "next/link";

export function Proximamente() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 rounded-3xl border border-zinc-800/70 bg-zinc-950/75 px-6 py-12 text-center shadow-2xl shadow-black/40">
      <span className="rounded-full border border-sky-500/50 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
        Error 404
      </span>
      <h1 className="text-3xl font-semibold text-zinc-50 md:text-4xl">
        Próximamente
      </h1>
      <p className="max-w-xl text-sm text-zinc-300 md:text-base">
        La página que buscás no está disponible por el momento o no existe.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center rounded-full bg-sky-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-950 transition hover:brightness-110"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
