import { useEffect, useState } from "react";

export type RegionUF = "SP" | "RJ" | "MG" | "PR";

export interface RegionConfig {
  uf: RegionUF;
  estado: string;          // "São Paulo"
  capital: string;         // "São Paulo"
  metro: string;           // "Grande São Paulo"
  estadoComArtigo: string; // "em São Paulo" / "no Rio de Janeiro"
}

const CONFIGS: Record<RegionUF, RegionConfig> = {
  SP: { uf: "SP", estado: "São Paulo", capital: "São Paulo", metro: "Grande São Paulo", estadoComArtigo: "em São Paulo" },
  RJ: { uf: "RJ", estado: "Rio de Janeiro", capital: "Rio de Janeiro", metro: "Grande Rio", estadoComArtigo: "no Rio de Janeiro" },
  MG: { uf: "MG", estado: "Minas Gerais", capital: "Belo Horizonte", metro: "Grande BH", estadoComArtigo: "em Minas Gerais" },
  PR: { uf: "PR", estado: "Paraná", capital: "Curitiba", metro: "Grande Curitiba", estadoComArtigo: "no Paraná" },
};

const DEFAULT: RegionConfig = CONFIGS.SP;

const ALIASES: Record<string, RegionUF> = {
  "SAO PAULO": "SP",
  "RIO DE JANEIRO": "RJ",
  "MINAS GERAIS": "MG",
  "PARANA": "PR",
};

const normalize = (raw?: string | null): RegionUF | null => {
  if (!raw) return null;
  const up = raw.toString().trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (up.length === 2 && up in CONFIGS) return up as RegionUF;
  return ALIASES[up] || null;
};

let cached: RegionConfig | null = null;
let pending: Promise<RegionConfig> | null = null;

const fetchRegion = (): Promise<RegionConfig> => {
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;
  pending = fetch("https://ipapi.co/json/")
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const uf = normalize(d?.region_code) || normalize(d?.region);
      cached = uf ? CONFIGS[uf] : DEFAULT;
      return cached;
    })
    .catch(() => {
      cached = DEFAULT;
      return DEFAULT;
    });
  return pending;
};

// Pré-aquece
if (typeof window !== "undefined") fetchRegion();

export const useRegion = (): RegionConfig => {
  const [region, setRegion] = useState<RegionConfig>(cached || DEFAULT);
  useEffect(() => {
    if (cached) {
      setRegion(cached);
      return;
    }
    let alive = true;
    fetchRegion().then((r) => alive && setRegion(r));
    return () => { alive = false; };
  }, []);
  return region;
};

/**
 * Substitui menções específicas a São Paulo pelo estado detectado.
 * Mantém nomes de bairros/cidades específicas (Tatuapé, Guarulhos, etc.).
 */
export const regionalize = (text: string, region: RegionConfig): string => {
  if (region.uf === "SP") return text;
  return text
    .replace(/Grande São Paulo/g, region.metro)
    .replace(/São Paulo \(Capital\)/g, `${region.capital} (Capital)`)
    .replace(/cidade de São Paulo/g, `cidade de ${region.capital}`)
    .replace(/em São Paulo e/g, `em ${region.capital} e`)
    .replace(/em São Paulo\b/g, `em ${region.capital}`)
    .replace(/de São Paulo\b/g, `de ${region.capital}`)
    .replace(/São Paulo, SP/g, `${region.capital}, ${region.uf}`)
    .replace(/, SP\b/g, `, ${region.uf}`);
};
