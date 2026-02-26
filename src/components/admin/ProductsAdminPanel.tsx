"use client";

import { useMemo, useState } from "react";
import type { Product, ProductCategory } from "@/types/product";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/api/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface ProductsAdminPanelProps {
  initialProducts: Product[];
}

type FormMode = "create" | "edit";

interface ProductFormState {
  id?: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  imageUrl: string;
  brandLabel: string;
  stock: string;
  highlighted: boolean;
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  category: "aceites",
  price: "",
  imageUrl: "",
  brandLabel: "",
  stock: "",
  highlighted: false,
};

export function ProductsAdminPanel({ initialProducts }: ProductsAdminPanelProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [mode, setMode] = useState<FormMode>("create");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "all">(
    "all",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (categoryFilter !== "all" && product.category !== categoryFilter) {
        return false;
      }

      const term = search.trim().toLowerCase();
      if (!term) return true;

      const haystack = `${product.name} ${product.description} ${
        product.brandLabel ?? ""
      }`.toLowerCase();

      return haystack.includes(term);
    });
  }, [products, categoryFilter, search]);

  function openCreateForm() {
    setMode("create");
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setMode("edit");
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      brandLabel: product.brandLabel ?? "",
      stock: product.stock?.toString() ?? "",
      highlighted: Boolean(product.highlighted),
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim()) return;

    const numericPrice = Number(form.price.replace(",", "."));
    const numericStock =
      form.stock.trim() !== "" ? Number(form.stock.replace(",", ".")) : null;

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const created = await createProduct({
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          price: Number.isFinite(numericPrice) ? numericPrice : 0,
          imageUrl: form.imageUrl.trim() || "/images/products/placeholder.jpg",
          brandLabel: form.brandLabel.trim() || undefined,
          compatibility: [],
          stock:
            numericStock !== null && Number.isFinite(numericStock)
              ? numericStock
              : undefined,
          highlighted: form.highlighted,
          tags: [],
        });

        setProducts((prev) => [created, ...prev]);
      } else if (mode === "edit" && form.id) {
        const updated = await updateProduct(form.id, {
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          price: Number.isFinite(numericPrice) ? numericPrice : undefined,
          imageUrl: form.imageUrl.trim() || undefined,
          brandLabel: form.brandLabel.trim() || undefined,
          stock:
            numericStock !== null && Number.isFinite(numericStock)
              ? numericStock
              : undefined,
          highlighted: form.highlighted,
        });

        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
        );
      }

      closeForm();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `¿Eliminar el producto "${product.name}"? Esta acción se replicará luego en tu API real.`,
    );
    if (!confirmed) return;

    await deleteProduct(product.id);
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-400">
            Catálogo
          </p>
          <h1 className="text-lg font-semibold text-zinc-50 md:text-xl">
            Gestión de productos
          </h1>
          <p className="text-xs text-zinc-400">
            ABM básico apoyado en los servicios mock de frontend. Más adelante
            se reemplazará por llamadas a tu API.
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={openCreateForm}
          >
            Nuevo producto
          </Button>
        </div>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3 md:flex-row md:items-center md:justify-between md:p-4">
        <div className="flex flex-1 flex-col gap-2 md:flex-row">
          <div className="w-full md:max-w-xs">
            <Input
              label="Buscar"
              placeholder="Nombre, marca o descripción"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="w-full md:max-w-[180px]">
            <Select
              label="Categoría"
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value === "all"
                    ? "all"
                    : (event.target.value as ProductCategory),
                )
              }
            >
              <option value="all">Todas</option>
              <option value="aceites">Aceites</option>
              <option value="neumaticos">Neumáticos</option>
              <option value="filtros">Filtros</option>
              <option value="offroad">Off Road</option>
              <option value="racing">Racing</option>
            </Select>
          </div>
        </div>
        <p className="text-[11px] text-zinc-400">
          Mostrando{" "}
          <span className="font-semibold text-zinc-200">
            {filteredProducts.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-zinc-200">
            {products.length}
          </span>{" "}
          productos.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60">
        <div className="hidden border-b border-zinc-800/80 bg-zinc-900/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400 md:grid md:grid-cols-[2fr_1fr_0.8fr_0.8fr_0.9fr] md:gap-3">
          <span>Producto</span>
          <span>Categoría</span>
          <span>Precio</span>
          <span>Stock</span>
          <span className="text-right">Acciones</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="flex flex-col gap-3 px-4 py-3 text-sm text-zinc-100 md:grid md:grid-cols-[2fr_1fr_0.8fr_0.8fr_0.9fr] md:items-center md:gap-3"
            >
              <div className="space-y-1">
                <p className="font-semibold text-zinc-50">{product.name}</p>
                <p className="line-clamp-2 text-xs text-zinc-400">
                  {product.description}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
                  {product.brandLabel && (
                    <span className="rounded-full bg-zinc-900/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-300">
                      {product.brandLabel}
                    </span>
                  )}
                  {product.highlighted && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                      Destacado
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs md:text-[13px]">
                <span className="inline-flex items-center rounded-full bg-zinc-900/80 px-2 py-1 text-[10px] uppercase tracking-wide text-zinc-300">
                  {product.category}
                </span>
              </div>

              <div className="text-sm font-semibold text-emerald-300 md:text-right">
                ${product.price.toLocaleString("es-AR")}
              </div>

              <div className="flex items-center gap-1 text-xs md:justify-end">
                {typeof product.stock === "number" ? (
                  <>
                    <span
                      className={`inline-flex h-2 w-2 rounded-full ${
                        product.stock <= 5
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      }`}
                    />
                    <span className="text-zinc-300">
                      {product.stock} unid.
                    </span>
                  </>
                ) : (
                  <span className="rounded-full bg-zinc-900/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-400">
                    Sin stock declarado
                  </span>
                )}
              </div>

              <div className="flex items-center justify-start gap-2 md:justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="border-zinc-700/80 bg-zinc-900/60 text-xs text-zinc-100 hover:bg-zinc-800"
                  onClick={() => openEditForm(product)}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="border-zinc-800/80 bg-zinc-950/80 text-xs text-red-400 hover:bg-red-950/60 hover:text-red-300"
                  onClick={() => handleDelete(product)}
                >
                  Eliminar
                </Button>
              </div>
            </article>
          ))}

          {filteredProducts.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-zinc-400">
              No se encontraron productos con los filtros actuales. Probá
              limpiarlos o crear un nuevo producto desde el botón{" "}
              <span className="font-semibold text-zinc-200">
                “Nuevo producto”
              </span>
              .
            </div>
          )}
        </div>
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800/80 bg-zinc-950 p-5 shadow-2xl">
            <header className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-400">
                  {mode === "create" ? "Nuevo producto" : "Editar producto"}
                </p>
                <h2 className="mt-1 text-base font-semibold text-zinc-50">
                  {mode === "create"
                    ? "Agregar producto al catálogo"
                    : "Actualizar datos del producto"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cerrar
              </button>
            </header>

            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <Input
                label="Nombre"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />

              <label className="flex w-full flex-col gap-1 text-xs font-medium text-zinc-500">
                <span className="uppercase tracking-wide">Descripción</span>
                <textarea
                  className="min-h-[80px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <Select
                  label="Categoría"
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      category: event.target.value as ProductCategory,
                    }))
                  }
                >
                  <option value="aceites">Aceites</option>
                  <option value="neumaticos">Neumáticos</option>
                  <option value="filtros">Filtros</option>
                  <option value="offroad">Off Road</option>
                  <option value="racing">Racing</option>
                </Select>

                <Input
                  label="Precio (ARS)"
                  type="number"
                  min="0"
                  step="100"
                  value={form.price}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, price: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  label="Marca / etiqueta"
                  value={form.brandLabel}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      brandLabel: event.target.value,
                    }))
                  }
                  placeholder="Castrol, Pirelli, etc."
                />

                <Input
                  label="Stock disponible"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, stock: event.target.value }))
                  }
                  placeholder="Opcional"
                />
              </div>

              <Input
                label="URL de imagen"
                value={form.imageUrl}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    imageUrl: event.target.value,
                  }))
                }
                placeholder="/images/products/mi-producto.jpg"
              />

              <label className="mt-1 flex items-center gap-2 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.highlighted}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      highlighted: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-zinc-400 bg-zinc-900 text-sky-500"
                />
                Mostrar como producto destacado en el catálogo.
              </label>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="border-zinc-700/80 bg-zinc-900/60 text-xs text-zinc-200 hover:bg-zinc-800"
                  onClick={closeForm}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Guardando..."
                    : mode === "create"
                      ? "Crear producto"
                      : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

