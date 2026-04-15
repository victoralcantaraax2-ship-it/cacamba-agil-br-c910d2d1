import whatsappIcon from "@/assets/whatsapp-icon.webp";
import evelinePhoto from "@/assets/eveline-duarte.jpeg";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import { memo, useState, useCallback } from "react";
import { X, Send } from "lucide-react";

const SIZES = ["3 m³", "4 m³", "5 m³", "7 m³", "10 m³"];

const WhatsAppFloat = memo(() => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [size, setSize] = useState("5 m³");
  const [message, setMessage] = useState("");

  const handleSend = useCallback(() => {
    const parts = [
      `Olá! Meu nome é ${name || "não informado"}.`,
      `Endereço: ${address || "não informado"}.`,
      `Tamanho da caçamba: ${size}.`,
      message ? `Mensagem: ${message}` : "",
      "Gostaria de solicitar um orçamento!",
    ].filter(Boolean);
    handleWhatsAppClick(parts.join("\n"));
    setOpen(false);
  }, [name, address, size, message]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Form Card */}
      <div
        className={`fixed bottom-24 right-4 z-50 w-[calc(100%-2rem)] max-w-sm origin-bottom-right transition-all duration-300 ease-out sm:right-5
          ${open ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="relative bg-whatsapp px-4 py-3">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <img
                src={evelinePhoto}
                alt="Eveline Duarte"
                className="h-11 w-11 rounded-full border-2 border-white/30 object-cover"
              />
              <div>
                <p className="text-sm font-bold text-white leading-tight">Fale com a Eveline Duarte</p>
                <p className="text-[11px] text-white/80">Responde em poucos minutos</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3 p-4">
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-whatsapp/40"
            />
            <input
              type="text"
              placeholder="Endereço da obra"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-whatsapp/40"
            />
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-whatsapp/40"
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>Caçamba de {s}</option>
              ))}
            </select>
            <textarea
              placeholder="Mensagem (opcional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-whatsapp/40"
            />
            <button
              onClick={handleSend}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-whatsapp font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-whatsapp-hover active:scale-[0.98]"
            >
              <Send className="h-4 w-4" />
              Enviar pelo WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition-all hover:scale-110 hover:bg-whatsapp-hover sm:h-16 sm:w-16
          ${open ? "rotate-90" : "animate-pulse-green"}`}
        aria-label="Chamar no WhatsApp"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="h-7 w-7 sm:h-8 sm:w-8" width={28} height={28} loading="lazy" />
      </button>
    </>
  );
});

WhatsAppFloat.displayName = "WhatsAppFloat";

export default WhatsAppFloat;
