import { useState, useEffect, useCallback, memo } from "react";
import { X, MessageCircle, Clock } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import { fireNortexBackConversion } from "@/lib/gtagConversion";
import phoneIcon from "@/assets/phone-icon.webp";
import logoAmba from "@/assets/logo-nortex.png";

const STORAGE_KEY = "exit_popup_dismissed";
const COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3 hours

const ExitIntentPopup = memo(() => {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  const dismiss = useCallback(() => {
    setAnimate(false);
    setTimeout(() => setVisible(false), 300);
    sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
  }, []);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY);
    if (wasDismissed && Date.now() - Number(wasDismissed) < COOLDOWN_MS) return;

    let triggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !triggered) {
        triggered = true;
        fireNortexBackConversion();
        setVisible(true);
        setTimeout(() => setAnimate(true), 30);
      }
    };

    // Desktop: detect mouse leaving viewport
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 180_000); // wait 3 min before arming

    // Mobile: detect back/tab switch via visibility change
    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && !triggered) {
        triggered = true;
        // Show when they come back
        const showOnReturn = () => {
          if (document.visibilityState === "visible") {
            setVisible(true);
            setTimeout(() => setAnimate(true), 30);
            document.removeEventListener("visibilitychange", showOnReturn);
          }
        };
        document.addEventListener("visibilitychange", showOnReturn);
      }
    };

    const mobileTimer = setTimeout(() => {
      document.addEventListener("visibilitychange", handleVisibility);
    }, 180_000);

    return () => {
      clearTimeout(timer);
      clearTimeout(mobileTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (!visible) return null;

  const handleClick = () => {
    handleWhatsAppClick("Olá! Vi que vocês têm uma oferta especial. Quero solicitar uma caçamba com desconto! Podem me passar os valores?");
    dismiss();
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        animate ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={dismiss}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl bg-card border-2 border-primary/30 shadow-2xl transition-all duration-300 ${
          animate ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 pt-8 text-center">
          <img src={logoAmba} alt="NORTEX Caçambas" className="mx-auto mb-4 h-12 w-auto" width={160} height={48} />

          <h3 className="mb-2 text-xl font-black text-foreground md:text-2xl">
            Ei, não vai embora! 👋
          </h3>

          <p className="mb-1 text-sm text-muted-foreground">
            Garanta sua caçamba com <span className="font-bold text-foreground">entrega rápida</span> e preço especial.
          </p>

          <div className="my-4 flex items-center justify-center gap-2 rounded-lg bg-accent/10 px-3 py-2">
            <Clock className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-wide">
              Oferta válida por tempo limitado
            </span>
          </div>

          <button
            onClick={handleClick}
            className="w-full rounded-xl bg-whatsapp px-6 py-4 text-base font-black text-whatsapp-foreground shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover flex items-center justify-center gap-2"
          >
            <img src={phoneIcon} alt="WhatsApp" className="h-6 w-6" width={24} height={24} />
            Quero minha cotação grátis
          </button>

          <button
            onClick={dismiss}
            className="mt-3 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Não, obrigado
          </button>
        </div>
      </div>
    </div>
  );
});

ExitIntentPopup.displayName = "ExitIntentPopup";

export default ExitIntentPopup;
