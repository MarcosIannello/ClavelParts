"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product } from "@/types/product";
import type { ProductCategory } from "@/types/product";
import { fetchProducts, type ProductFilters } from "@/lib/api/products";

const categoryOptions: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "aceites", label: "Aceites" },
  { value: "neumaticos", label: "Neumáticos" },
  { value: "filtros", label: "Filtros" },
  { value: "offroad", label: "Off Road" },
  { value: "racing", label: "The Racers Edge" },
];

const quickSearchOptions = ["Castrol", "Mann", "Pirelli", "service", "offroad"];

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") ?? "all";
  const versionParam = searchParams.get("version") ?? "";
  const searchParam = searchParams.get("q") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParam);

  const buildCatalogUrl = (params: URLSearchParams) => {
    const query = params.toString();
    return query ? `/catalogo?${query}` : "/catalogo";
  };

  useEffect(() => {
    const filters: ProductFilters = {};

    if (categoryParam !== "all") {
      filters.category = categoryParam as ProductCategory;
    }

    if (versionParam) {
      filters.versionId = versionParam;
    }

    if (searchParam) {
      filters.search = searchParam;
    }

    setLoading(true);
    void fetchProducts(filters)
      .then((data) => {
        setProducts(data);
      })
      .finally(() => setLoading(false));
  }, [categoryParam, versionParam, searchParam]);

  useEffect(() => {
    setSearchValue(searchParam);
  }, [searchParam]);

  const activeCategory = useMemo(
    () =>
      categoryOptions.find((c) => c.value === categoryParam) ??
      categoryOptions[0],
    [categoryParam],
  );

  const handleCategoryChange = (value: ProductCategory | "all") => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(buildCatalogUrl(params));
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const cleanedSearch = searchValue.replace(/\s+/g, " ").trim();

    if (cleanedSearch) {
      params.set("q", cleanedSearch);
      setSearchValue(cleanedSearch);
    } else {
      params.delete("q");
      setSearchValue("");
    }
    router.push(buildCatalogUrl(params));
  };

  const handleSearchClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    setSearchValue("");
    router.push(buildCatalogUrl(params));
  };

  const handleQuickSearch = (term: string) => {
    const cleanedTerm = term.replace(/\s+/g, " ").trim();
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", cleanedTerm);
    setSearchValue(cleanedTerm);
    router.push(buildCatalogUrl(params));
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-4 md:px-6 md:pt-8">
      <header className="space-y-4 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 shadow-2xl shadow-black/40">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-400">
              Catálogo de autopartes
            </p>
            <h1 className="mt-1 text-xl font-semibold text-zinc-50 md:text-2xl">
              Encontrá repuestos compatibles para tu vehículo
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Filtrá por categoría, buscá por texto libre y aprovechá los datos
              de tu vehículo seleccionados desde la landing.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleCategoryChange(category.value)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  activeCategory.value === category.value
                    ? "bg-sky-600 text-white"
                    : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-md items-end gap-2"
          >
            <Input
              label="Buscá por nombre, marca o descripción"
              placeholder="Ej: aceite 5W-30, filtro Mann..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue.trim() && (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleSearchClear}
              >
                Limpiar
              </Button>
            )}
            <Button type="submit" variant="secondary" size="md">
              Buscar
            </Button>
          </form>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Búsquedas rápidas:
          </span>
          {quickSearchOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleQuickSearch(option)}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 font-semibold text-zinc-300 transition hover:border-sky-500/60 hover:text-sky-300"
            >
              {option}
            </button>
          ))}
        </div>
      </header>
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            {loading
              ? "Cargando productos..."
              : `${products.length} producto${
                  products.length === 1 ? "" : "s"
                } encontrado${
                  products.length === 1 ? "" : "s"
                } para los filtros actuales.`}
          </span>
          {versionParam && (
            <span className="hidden md:inline">
              Filtrando por el vehículo seleccionado desde la landing.
            </span>
          )}
        </div>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl border border-zinc-800/80 bg-zinc-900/60"
              />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </div>
  );
}
