import { memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const faqs = [
  {
    q: "Em quanto tempo a caçamba é entregue?",
    a: "Realizamos a entrega em até 2 horas após a confirmação do pedido, conforme disponibilidade da região.",
  },
  {
    q: "Quais tamanhos de caçamba estão disponíveis?",
    a: "Trabalhamos com caçambas de 3m³, 4m³, 5m³, 7m³ e 10m³, ideais para diferentes tipos de obra e volume de entulho.",
  },
  {
    q: "Vocês atendem minha região?",
    a: "Atendemos toda a cidade de São Paulo, Grande São Paulo e regiões próximas. Consulte disponibilidade via WhatsApp.",
  },
  {
    q: "Quais são as formas de pagamento?",
    a: "Aceitamos pagamento via Pix, cartão de crédito e outras formas sob consulta.",
  },
  {
    q: "Qual é o período de locação?",
    a: "O período padrão é de até 7 dias, com possibilidade de retirada antecipada conforme necessidade.",
  },
  {
    q: "O que pode ser descartado na caçamba?",
    a: "Aceitamos entulho de construção, reforma e demolição. Não é permitido descarte de lixo orgânico, produtos químicos ou materiais perigosos.",
  },
  {
    q: "Vocês emitem nota fiscal?",
    a: "Sim, emitimos nota fiscal mediante solicitação.",
  },
  {
    q: "Como solicito a retirada da caçamba?",
    a: "Basta entrar em contato pelo WhatsApp informando que a caçamba está pronta para retirada.",
  },
];

const FAQSection = memo(() => {
  return (
    <section id="faq" className="bg-card py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-card-foreground md:text-3xl">
            Dúvidas Frequentes
          </h2>
          <p className="text-muted-foreground">Tire suas principais dúvidas antes de solicitar sua caçamba</p>
        </div>
        <Accordion type="single" collapsible className="mx-auto max-w-2xl">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger className="text-left text-base font-bold">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Ainda tem dúvidas? Fale com nossa equipe agora mesmo.
          </p>
          <button
            onClick={() => handleWhatsAppClick("Olá! Tenho uma dúvida sobre o aluguel de caçamba.")}
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-extrabold uppercase text-white shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
            CHAMAR NO WHATSAPP
          </button>
          <span className="text-xs text-muted-foreground">Atendimento rápido e sem compromisso</span>
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
