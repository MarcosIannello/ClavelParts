export type ProductCategory =
  | "aceites"
  | "neumaticos"
  | "filtros"
  | "offroad"
  | "racing";

export interface ProductCompatibility {
  versionId: string;
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  imageUrl: string;
  brandLabel?: string;
  tags?: string[];
  compatibility: ProductCompatibility[];
  stock?: number;
  highlighted?: boolean;
}

