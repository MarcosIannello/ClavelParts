"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchBrands, fetchModels, fetchVersions } from "@/lib/api/vehicles";
import type { Brand, Model, Version } from "@/types/vehicle";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";

export function VehicleSelector() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);

  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [versionId, setVersionId] = useState("");

  useEffect(() => {
    void fetchBrands().then(setBrands);
  }, []);

  useEffect(() => {
    if (!brandId) {
      setModels([]);
      setModelId("");
      setVersions([]);
      setVersionId("");
      return;
    }
    void fetchModels(brandId).then((data) => {
      setModels(data);
      setModelId("");
      setVersions([]);
      setVersionId("");
    });
  }, [brandId]);

  useEffect(() => {
    if (!modelId) {
      setVersions([]);
      setVersionId("");
      return;
    }
    void fetchVersions(modelId).then((data) => {
      setVersions(data);
      setVersionId("");
    });
  }, [modelId]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brandId) params.set("brand", brandId);
    if (modelId) params.set("model", modelId);
    if (versionId) params.set("version", versionId);

    router.push(`/catalogo?${params.toString()}`);
  };

  const disableSearch = !brandId || !modelId || !versionId;

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl bg-zinc-900/80 p-6 shadow-xl shadow-black/40 backdrop-blur">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-400">
          ¿Qué auto tenés?
        </p>
        <h2 className="mt-1 text-xl font-semibold text-white">
          Encontrá autopartes 100% compatibles
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Select
          label="Marca"
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
        >
          <option value="">Seleccioná</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>
        <Select
          label="Modelo"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          disabled={!brandId}
        >
          <option value="">Seleccioná</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </Select>
        <Select
          label="Versión"
          value={versionId}
          onChange={(e) => setVersionId(e.target.value)}
          disabled={!modelId}
        >
          <option value="">Seleccioná</option>
          {versions.map((version) => (
            <option key={version.id} value={version.id}>
              {version.name} ({version.yearFrom}-{version.yearTo})
            </option>
          ))}
        </Select>
      </div>
      <Button
        variant="primary"
        size="lg"
        onClick={handleSearch}
        disabled={disableSearch}
        fullWidth
        className="mt-1"
      >
        Buscar autopartes para mi vehículo
      </Button>
      <p className="text-[11px] text-zinc-400">
        Podés guardar tu vehículo en <span className="font-semibold">Mi Garage</span>{" "}
        para futuras compras.
      </p>
    </div>
  );
}

