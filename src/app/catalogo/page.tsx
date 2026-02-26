import { Suspense } from "react";
import CatalogPageClient from "./CatalogPageClient";

function CatalogPageFallback() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-4 md:px-6 md:pt-8">
      <div className="h-56 animate-pulse rounded-3xl border border-zinc-800/80 bg-zinc-900/60" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl border border-zinc-800/80 bg-zinc-900/60"
          />
        ))}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogPageFallback />}>
      <CatalogPageClient />
    </Suspense>
  );
}
