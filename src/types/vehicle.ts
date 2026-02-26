export interface Brand {
  id: string;
  name: string;
}

export interface Model {
  id: string;
  brandId: string;
  name: string;
}

export interface Version {
  id: string;
  modelId: string;
  name: string;
  yearFrom: number;
  yearTo: number;
}

