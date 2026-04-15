import whatsappIcon from "@/assets/whatsapp-icon.webp";
import evelinePhoto from "@/assets/eveline-duarte.jpeg";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import { memo, useState, useCallback, useRef, useEffect } from "react";
import { X, Send, ChevronRight, MapPin, Loader2 } from "lucide-react";

const SIZES = ["Ainda não escolhi", "3 m³", "4 m³", "5 m³", "7 m³", "10 m³"];

const useAddressAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ display: string; full: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 4) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=br&limit=5&addressdetails=1&accept-language=pt-BR`,
          { headers: { "User-Agent": "NortexCacambas/1.0" } }
        );
        const data = await res.json();
        const mapped = data
          .filter((item: any) => item.display_name)
          .map((item: any) => {
            const parts = item.display_name.split(", ");
            const short = parts.slice(0, 3).join(", ");
            return { display: short, full: item.display_name };
          });
        setSuggestions(mapped);
        setShowSuggestions(mapped.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  const select = useCallback((suggestion: { display: string; full: string }) => {
    setQuery(suggestion.full);
    setShowSuggestions(false);
    setSuggestions([]);
  }, []);

  const close = useCallback(() => setShowSuggestions(false), []);

  return { query, setQuery: search, suggestions, loading, showSuggestions, select, close };
};

const WhatsAppFloat = memo(() => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [size, setSize] = useState("Ainda não escolhi");
  const [message, setMessage] = useState("");
  const addr = useAddressAutocomplete();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        addr.close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [addr.close]);

  const handleSend = useCallback(() => {
    const parts = [
      `Olá! Meu nome é ${name || "não informado"}.`,
      `Endereço: ${addr.query || "não informado"}.`,
      `Tamanho da caçamba: ${size}.`,
      message ? `Mensagem: ${message}` : "",
      "Gostaria de solicitar um orçamento!",
    ].filter(Boolean);
    handleWhatsAppClick(parts.join("\n"));
    setOpen(false);
  }, [name, addr.query, size, message]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed bottom-24 right-4 z-50 w-[calc(100%-2rem)] max-w-sm origin-bottom-right transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:right-5
          ${open ? "scale-100 opacity-100 translate-y-0" : "scale-75 opacity-0 translate-y-8 pointer-events-none"}`}
      >
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card to-card/95 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-whatsapp via-whatsapp to-green-600 px-5 py-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -right-2 top-8 h-12 w-12 rounded-full bg-white/5" />
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-1.5 text-white/90 backdrop-blur-sm transition-all hover:bg-white/25 hover:text-white hover:scale-110"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={evelinePhoto} alt="Eveline Duarte" className="h-14 w-14 rounded-2xl border-2 border-white/40 object-cover shadow-lg" />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-whatsapp bg-green-400">
                  <span className="h-2 w-2 animate-ping rounded-full bg-green-300 absolute" />
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              </div>
              <div>
                <p className="text-[15px] font-bold text-white leading-tight tracking-tight">Eveline Duarte</p>
                <p className="text-xs text-white/70 font-medium mt-0.5">Consultora NORTEX</p>
                <p className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
                  Online agora
                </p>
              </div>
            </div>
          </div>

          {/* Chat bubble */}
          <div className="px-5 pt-4 pb-1">
            <div className="relative rounded-2xl rounded-tl-sm bg-muted/50 border border-border/50 px-4 py-3">
              <p className="text-[13px] text-foreground leading-relaxed">
                Olá! 👋 Sou a <strong>Eveline</strong>. Preencha abaixo para um atendimento mais rápido!
              </p>
              <span className="absolute -top-0 -left-1 text-muted/50 text-lg">◤</span>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-2.5 px-5 pb-5 pt-3">
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/60 bg-background/80 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-whatsapp/30 focus:border-whatsapp/50 transition-all"
            />

            {/* Address with autocomplete */}
            <div className="relative" ref={suggestionsRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Endereço da obra"
                  value={addr.query}
                  onChange={(e) => addr.setQuery(e.target.value)}
                  onFocus={() => addr.suggestions.length > 0 && addr.close()}
                  className="h-11 w-full rounded-xl border border-border/60 bg-background/80 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-whatsapp/30 focus:border-whatsapp/50 transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                  {addr.loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </div>
              </div>

              {addr.showSuggestions && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
                  {addr.suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => addr.select(s)}
                      className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-xs text-foreground hover:bg-muted/60 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-whatsapp" />
                      <span className="line-clamp-2">{s.display}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/60 bg-background/80 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-whatsapp/30 focus:border-whatsapp/50 transition-all appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>{s === "Ainda não escolhi" ? "Ainda não escolhi o tamanho" : `Caçamba de ${s}`}</option>
              ))}
            </select>
            <textarea
              placeholder="Mensagem (opcional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-whatsapp/30 focus:border-whatsapp/50 transition-all"
            />
            <button
              onClick={handleSend}
              className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-whatsapp to-green-600 font-bold text-white shadow-lg shadow-whatsapp/25 transition-all duration-300 hover:shadow-xl hover:shadow-whatsapp/30 hover:brightness-110 active:scale-[0.97]"
            >
              <img src={whatsappIcon} alt="" className="h-5 w-5" />
              Enviar pelo WhatsApp
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-whatsapp/30 transition-all duration-300 sm:h-16 sm:w-16
          ${open
            ? "bg-card border border-border rotate-0 hover:bg-muted"
            : "bg-whatsapp hover:scale-110 hover:bg-whatsapp-hover hover:shadow-xl hover:shadow-whatsapp/40 animate-pulse-green"
          }`}
        aria-label="Chamar no WhatsApp"
      >
        {open ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <img src={whatsappIcon} alt="WhatsApp" className="h-7 w-7 sm:h-8 sm:w-8" width={28} height={28} loading="lazy" />
        )}
      </button>
    </>
  );
});

WhatsAppFloat.displayName = "WhatsAppFloat";

export default WhatsAppFloat;
