import { fireWhatsAppConversion } from "@/lib/gtagConversion";

const DEFAULT_NUMBER = "5511964553512";
const STATE_NUMBERS: Record<string, string> = {
  SP: "5511964553512",
  RJ: "5511964553512", // pendente número definitivo
  MG: "5511964553512", // pendente número definitivo
  PR: "5541999556144",
};
const WHATSAPP_MESSAGE = "Olá! Tenho interesse em alugar uma caçamba. Podem informar valores e disponibilidade?";

let cachedRegion: string | null = null;
let regionPromise: Promise<string | null> | null = null;

const STATE_ALIASES: Record<string, string> = {
  "SAO PAULO": "SP",
  "RIO DE JANEIRO": "RJ",
  "MINAS GERAIS": "MG",
  "PARANA": "PR",
};

const normalizeRegion = (raw: string | undefined | null): string | null => {
  if (!raw) return null;
  const up = raw.toString().trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (up.length === 2) return up;
  return STATE_ALIASES[up] || null;
};

const isDev = typeof import.meta !== "undefined" && (import.meta as any).env?.DEV;
const debug = (...args: unknown[]) => {
  if (isDev) console.log("[whatsapp/geo]", ...args);
};

const fetchWithTimeout = async (url: string, ms = 2500): Promise<any | null> => {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

type Provider = { name: string; url: string; pick: (d: any) => string | null | undefined };

const PROVIDERS: Provider[] = [
  { name: "ipapi.co", url: "https://ipapi.co/json/", pick: (d) => d?.region_code || d?.region },
  { name: "ipwho.is", url: "https://ipwho.is/", pick: (d) => d?.region_code || d?.region },
  { name: "geolocation-db", url: "https://geolocation-db.com/json/", pick: (d) => d?.state },
];

const detectRegion = (): Promise<string | null> => {
  if (cachedRegion) return Promise.resolve(cachedRegion);
  if (regionPromise) return regionPromise;

  regionPromise = (async () => {
    for (const p of PROVIDERS) {
      const data = await fetchWithTimeout(p.url);
      if (!data) {
        debug(`provider ${p.name} falhou`);
        continue;
      }
      const region = normalizeRegion(p.pick(data));
      if (region) {
        cachedRegion = region;
        debug(`provider ${p.name} detectou estado: ${region}`);
        return region;
      }
      debug(`provider ${p.name} respondeu mas sem estado válido`);
    }
    debug("nenhum provider detectou — usando fallback SP");
    return null;
  })();

  return regionPromise;
};

// Pré-aquece a detecção
if (typeof window !== "undefined") detectRegion();

export const getWhatsAppNumber = (region?: string | null): string => {
  const code = normalizeRegion(region) || cachedRegion;
  return (code && STATE_NUMBERS[code]) || DEFAULT_NUMBER;
};

export const getWhatsAppUrl = (customMessage?: string, region?: string | null) => {
  const msg = customMessage || WHATSAPP_MESSAGE;
  const number = getWhatsAppNumber(region);
  const encodedMessage = encodeURIComponent(msg);
  return `https://api.whatsapp.com/send/?phone=${number}&text=${encodedMessage}&type=phone_number&app_absent=0`;
};

export const handleWhatsAppClick = async (customMessage?: string) => {
  // Tenta detectar região rapidamente (timeout curto pra não travar UX)
  const region = await Promise.race<string | null>([
    detectRegion(),
    new Promise<string | null>((resolve) => setTimeout(() => resolve(cachedRegion), 600)),
  ]);
  const url = getWhatsAppUrl(customMessage, region);
  debug(`abrindo WhatsApp — região: ${region || "fallback SP"} — número: ${getWhatsAppNumber(region)}`);

  fireWhatsAppConversion(() => window.open(url, "_blank"));
  setTimeout(() => window.open(url, "_blank"), 1000);
};
