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
    q: "Em quanto tempo a caçamba chega?",
    a: "Após confirmação, entregamos em até 2 horas em São Paulo capital e região metropolitana.",
  },
  {
    q: "Quais tamanhos de caçamba estão disponíveis?",
    a: "Oferecemos caçambas de 3 m³, 4 m³, 5 m³, 7 m³, 10 m³ e 26 m³ — para reformas simples até demolições completas.",
  },
  {
    q: "Quais regiões vocês atendem?",
    a: "Atendemos toda São Paulo capital (Zona Leste, Sul, Norte e Oeste), Guarulhos, ABC Paulista, Osasco, Campinas, Sorocaba e demais cidades do estado.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Aceitamos Pix, cartão de crédito, débito e boleto. Pagamento seguro, feito após a confirmação do pedido.",
  },
  {
    q: "Por quanto tempo posso ficar com a caçamba?",
    a: "O período padrão é de 3 a 7 dias, mas ajustamos conforme sua necessidade. Combine pelo WhatsApp.",
  },
  {
    q: "O que posso colocar na caçamba?",
    a: "Entulho de obra, restos de construção, madeira, ferro, telhas e materiais similares. Lixo orgânico e produtos perigosos não são permitidos.",
  },
  {
    q: "A NORTEX emite nota fiscal?",
    a: "Sim. Emitimos nota fiscal para todos os serviços realizados.",
  },
  {
    q: "Como solicito a retirada da caçamba?",
    a: "Basta enviar uma mensagem pelo WhatsApp quando a caçamba estiver cheia ou no prazo combinado.",
  },
];

const FAQSection = memo(() => {
  return (
    <section id="faq" className="bg-card py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-card-foreground md:text-3xl">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground">Tudo que você precisa saber antes de contratar.</p>
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

        <div className="mt-8 text-center">
          <button
            onClick={() => handleWhatsAppClick("Olá! Tenho uma dúvida sobre o aluguel de caçamba.")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-whatsapp transition-colors hover:underline"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-4 w-4" width={16} height={16} />
            Ainda com dúvida? Fale no WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
