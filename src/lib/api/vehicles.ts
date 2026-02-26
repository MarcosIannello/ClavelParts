import type { Brand, Model, Version } from "@/types/vehicle";

// Datos mock para la etapa inicial: se pueden reemplazar luego por fetch a tu API real.

const brands: Brand[] = [
  { id: "vw", name: "Volkswagen" },
  { id: "ford", name: "Ford" },
  { id: "chevrolet", name: "Chevrolet" },
];

const models: Model[] = [
  { id: "gol", brandId: "vw", name: "Gol" },
  { id: "amarok", brandId: "vw", name: "Amarok" },
  { id: "fiesta", brandId: "ford", name: "Fiesta" },
  { id: "ranger", brandId: "ford", name: "Ranger" },
  { id: "onix", brandId: "chevrolet", name: "Onix" },
];

const versions: Version[] = [
  { id: "gol-trend-16", modelId: "gol", name: "Trend 1.6", yearFrom: 2014, yearTo: 2021 },
  { id: "amarok-hig-20", modelId: "amarok", name: "Highline 2.0", yearFrom: 2012, yearTo: 2020 },
  { id: "fiesta-titanium", modelId: "fiesta", name: "Titanium", yearFrom: 2013, yearTo: 2018 },
  { id: "ranger-xlt", modelId: "ranger", name: "XLT 3.2", yearFrom: 2015, yearTo: 2022 },
  { id: "onix-lt-14", modelId: "onix", name: "LT 1.4", yearFrom: 2015, yearTo: 2020 },
];

export async function fetchBrands(): Promise<Brand[]> {
  return Promise.resolve(brands);
}

export async function fetchModels(brandId: string): Promise<Model[]> {
  return Promise.resolve(models.filter((m) => m.brandId === brandId));
}

export async function fetchVersions(modelId: string): Promise<Version[]> {
  return Promise.resolve(versions.filter((v) => v.modelId === modelId));
}

