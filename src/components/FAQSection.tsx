import { memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Qual é o prazo de entrega da caçamba?",
    a: "Realizamos a entrega em até 2 horas após a confirmação do pedido, conforme disponibilidade e localização.",
  },
  {
    q: "Quais tamanhos de caçamba estão disponíveis?",
    a: "Disponibilizamos caçambas de 3m³, 4m³, 5m³, 7m³ e 10m³, dimensionadas para atender desde pequenas reformas até grandes demolições.",
  },
  {
    q: "A NORTEX atende minha região?",
    a: "Atendemos toda a cidade de São Paulo, Grande São Paulo e regiões adjacentes. Consulte a cobertura para seu endereço pelo WhatsApp.",
  },
  {
    q: "Quais são as formas de pagamento aceitas?",
    a: "Aceitamos Pix e cartão de crédito. Outras modalidades podem ser avaliadas sob consulta.",
  },
  {
    q: "Qual é o período de locação da caçamba?",
    a: "O período padrão varia de 2 a 7 dias, conforme o tamanho da caçamba. A retirada antecipada pode ser solicitada a qualquer momento.",
  },
  {
    q: "Quais materiais podem ser descartados na caçamba?",
    a: "São aceitos resíduos de construção civil, reforma e demolição (entulho, concreto, cerâmica, madeira, entre outros). Não é permitido o descarte de lixo orgânico, produtos químicos ou materiais perigosos.",
  },
  {
    q: "A empresa emite nota fiscal?",
    a: "Sim. A emissão de nota fiscal é realizada mediante solicitação no momento da contratação.",
  },
  {
    q: "Como solicito a retirada da caçamba?",
    a: "Basta entrar em contato pelo WhatsApp informando que a caçamba está pronta para coleta. Nossa equipe agenda a retirada com agilidade.",
  },
];

const FAQSection = memo(() => {
  return (
    <section id="faq" className="bg-card py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <HelpCircle className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mb-3 text-2xl font-extrabold text-card-foreground md:text-3xl">
            Perguntas Frequentes
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Esclarecemos as principais dúvidas sobre nossos serviços de locação de caçambas.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-background p-2 md:p-4">
          <Accordion type="single" collapsible>
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="border-border/50">
                <AccordionTrigger className="text-left text-sm font-bold md:text-base hover:text-primary transition-colors px-2">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed px-2 pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Precisa de mais informações? Nossa equipe está à disposição.
          </p>
          <button
            onClick={() => handleWhatsAppClick("Olá! Gostaria de esclarecer uma dúvida sobre a locação de caçambas.")}
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-extrabold uppercase text-white shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
            FALAR COM NOSSA EQUIPE
          </button>
          <span className="text-xs text-muted-foreground">Atendimento ágil • Sem compromisso</span>
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
