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

const detectRegion = (): Promise<string | null> => {
  if (cachedRegion) return Promise.resolve(cachedRegion);
  if (regionPromise) return regionPromise;
  regionPromise = fetch("https://ipapi.co/json/")
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const region = normalizeRegion(d?.region_code) || normalizeRegion(d?.region);
      if (region) cachedRegion = region;
      return cachedRegion;
    })
    .catch(() => null);
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

  fireWhatsAppConversion(() => window.open(url, "_blank"));
  setTimeout(() => window.open(url, "_blank"), 1000);
};
