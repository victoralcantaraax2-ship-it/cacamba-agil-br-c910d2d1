import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const agents = [
  {
    name: "Luanna Freitas",
    url: "https://wa.me/5511969795930?text=Olá,%20quero%20alugar",
  },
  {
    name: "Rafaela Mendes",
    url: "https://wa.me/5511968359074?text=Olá,%20quero%20alugar",
  },
];

const WhatsAppFloat = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      {/* Agent menu */}
      {open && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 mb-2 w-64 rounded-xl bg-card shadow-2xl border overflow-hidden">
          <div className="bg-whatsapp px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-bold text-whatsapp-foreground">Fale com um atendente</span>
            <button onClick={() => setOpen(false)} className="text-whatsapp-foreground/80 hover:text-whatsapp-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2">
            {agents.map((agent) => (
              <a
                key={agent.name}
                href={agent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground">
                  <MessageCircle className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">Disponível agora</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Float button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-whatsapp px-5 py-4 text-whatsapp-foreground shadow-2xl transition-transform hover:scale-105 hover:bg-whatsapp-hover animate-pulse-green"
        aria-label="Abrir WhatsApp"
      >
        {open ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7 fill-current" />}
        <span className="hidden text-base font-bold sm:inline">WhatsApp</span>
      </button>
    </div>
  );
};

export default WhatsAppFloat;
