import type { Product, ProductCategory } from "@/types/product";

const products: Product[] = [
  {
    id: "aceite-castrol-5w30-gol-trend",
    name: "Aceite sintético Castrol 5W-30",
    description:
      "Lubricante sintético de alto rendimiento para motores nafteros, ideal para Volkswagen Gol Trend 1.6.",
    category: "aceites",
    price: 42000,
    imageUrl: "/images/products/aceite-castrol-5w30.jpg",
    brandLabel: "Castrol",
    tags: ["motor", "naftero", "service"],
    compatibility: [
      {
        versionId: "gol-trend-16",
        note: "Recomendado para servicio cada 10.000 km",
      },
    ],
    stock: 12,
    highlighted: true,
  },
  {
    id: "filtro-aceite-mann-gol-trend",
    name: "Filtro de aceite Mann W712/95",
    description:
      "Filtro de aceite Mann original para Volkswagen Gol Trend 1.6. Máxima protección contra impurezas.",
    category: "filtros",
    price: 9500,
    imageUrl: "/images/products/filtro-aceite-mann.jpg",
    brandLabel: "Mann Filter",
    tags: ["motor", "service"],
    compatibility: [
      {
        versionId: "gol-trend-16",
      },
    ],
    stock: 30,
  },
  {
    id: "neumatico-pirelli-scorpion-amarok",
    name: "Neumático Pirelli Scorpion ATR 245/65R17",
    description:
      "Neumático all-terrain Pirelli Scorpion ATR para uso mixto ciudad/offroad. Excelente agarre en Amarok.",
    category: "neumaticos",
    price: 165000,
    imageUrl: "/images/products/pirelli-scorpion-atr.jpg",
    brandLabel: "Pirelli",
    tags: ["offroad", "pickup"],
    compatibility: [
      {
        versionId: "amarok-hig-20",
        note: "Medida sugerida para uso mixto",
      },
    ],
    stock: 8,
    highlighted: true,
  },
  {
    id: "kit-filtros-service-fiesta",
    name: "Kit de filtros service Ford Fiesta",
    description:
      "Kit completo de filtros (aceite, aire y habitáculo) para Ford Fiesta Titanium. Ideal para service anual.",
    category: "filtros",
    price: 38000,
    imageUrl: "/images/products/kit-filtros-fiesta.jpg",
    brandLabel: "Motorcraft",
    tags: ["service", "original"],
    compatibility: [
      {
        versionId: "fiesta-titanium",
      },
    ],
    stock: 15,
  },
  {
    id: "chip-racing-onix",
    name: "Chip performance ONIX LT 1.4",
    description:
      "Módulo de potencia plug&play para Chevrolet Onix LT 1.4. Mejora respuesta y entrega de torque.",
    category: "racing",
    price: 98000,
    imageUrl: "/images/products/chip-onix-racing.jpg",
    brandLabel: "RacingLab",
    tags: ["performance", "tuning"],
    compatibility: [
      {
        versionId: "onix-lt-14",
      },
    ],
    stock: 5,
    highlighted: true,
  },
  {
    id: "barra-led-offroad-universal",
    name: "Barra LED offroad 20\" universal",
    description:
      "Barra de LED de alta potencia para uso offroad, carcasa de aluminio y soporte universal.",
    category: "offroad",
    price: 52000,
    imageUrl: "/images/products/barra-led-offroad.jpg",
    tags: ["offroad", "iluminacion"],
    compatibility: [
      {
        versionId: "amarok-hig-20",
      },
      {
        versionId: "ranger-xlt",
      },
    ],
    stock: 20,
  },
];

export interface ProductFilters {
  category?: ProductCategory;
  versionId?: string;
  search?: string;
}

const categorySearchLabel: Record<ProductCategory, string> = {
  aceites: "aceite aceites lubricante lubricantes",
  neumaticos: "neumatico neumaticos cubierta cubiertas",
  filtros: "filtro filtros",
  offroad: "offroad off road 4x4",
  racing: "racing performance",
};

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function applyFilters(all: Product[], filters?: ProductFilters): Product[] {
  if (!filters) return all;

  const { category, versionId, search } = filters;
  const normalizedSearch = search ? normalizeSearchValue(search) : "";

  const filtered = all.filter((product) => {
    if (category && product.category !== category) return false;

    if (
      versionId &&
      !product.compatibility.some((c) => c.versionId === versionId)
    ) {
      return false;
    }

    return true;
  });

  if (!normalizedSearch) return filtered;

  const searchTerms = normalizedSearch.split(" ").filter(Boolean);

  return filtered
    .map((product, index) => {
      const normalizedName = normalizeSearchValue(product.name);
      const normalizedBrand = normalizeSearchValue(product.brandLabel ?? "");
      const normalizedDescription = normalizeSearchValue(product.description);
      const normalizedTags = normalizeSearchValue(product.tags?.join(" ") ?? "");
      const normalizedCategory = normalizeSearchValue(
        categorySearchLabel[product.category] ?? product.category,
      );

      const fullText = `${normalizedName} ${normalizedBrand} ${normalizedDescription} ${normalizedTags} ${normalizedCategory}`;
      let score = 0;

      if (fullText.includes(normalizedSearch)) {
        score += 7;
      }

      for (const term of searchTerms) {
        let termScore = 0;

        if (normalizedName.includes(term)) termScore = Math.max(termScore, 6);
        if (normalizedBrand.includes(term)) termScore = Math.max(termScore, 5);
        if (normalizedTags.includes(term)) termScore = Math.max(termScore, 4);
        if (normalizedDescription.includes(term)) termScore = Math.max(termScore, 3);
        if (normalizedCategory.includes(term)) termScore = Math.max(termScore, 2);

        if (termScore === 0) {
          return null;
        }

        score += termScore;
      }

      return { product, score, index };
    })
    .filter((item): item is { product: Product; score: number; index: number } => {
      return item !== null;
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.product);
}

export async function fetchProducts(
  filters?: ProductFilters,
): Promise<Product[]> {
  return Promise.resolve(applyFilters(products, filters));
}

export async function fetchProductById(
  id: string,
): Promise<Product | null> {
  const product = products.find((p) => p.id === id);
  return Promise.resolve(product ?? null);
}

// Placeholder para etapa inicial: en el futuro esto llamará a tu API REST.
export async function createProduct(
  data: Omit<Product, "id">,
): Promise<Product> {
  const product: Product = {
    id: `mock-${Date.now()}`,
    ...data,
  };
  return Promise.resolve(product);
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id">>,
): Promise<Product> {
  const existing = products.find((p) => p.id === id);

  const updated: Product = {
    ...(existing ?? {
      id,
      name: "",
      description: "",
      category: "aceites",
      price: 0,
      imageUrl: "",
      compatibility: [],
    }),
    ...data,
  };

  return Promise.resolve(updated);
}

export async function deleteProduct(id: string): Promise<void> {
  // En esta etapa inicial solo devolvemos una promesa resuelta.
  // En el futuro se reemplazará por una llamada a la API real.
  void id;
  return Promise.resolve();
}

