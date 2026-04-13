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
    a: "Depois que você confirma, a gente entrega rapidinho na sua região. Em muitos casos, no mesmo dia.",
  },
  {
    q: "Quais tamanhos vocês têm?",
    a: "Temos de 3 m³, 4 m³, 5 m³, 7 m³, 10 m³ e 26 m³. Serve pra reforminha até demolição pesada.",
  },
  {
    q: "Vocês atendem minha região?",
    a: "A gente atende em várias regiões. Manda uma mensagem no WhatsApp com seu CEP que a gente confirma na hora.",
  },
  {
    q: "Como eu pago?",
    a: "Pix, cartão de crédito, débito ou boleto. Tudo online, sem complicação.",
  },
  {
    q: "Quantos dias eu posso ficar com a caçamba?",
    a: "O padrão é de 3 a 7 dias. Mas se precisar de mais tempo, é só combinar pelo WhatsApp.",
  },
  {
    q: "O que pode colocar na caçamba?",
    a: "Entulho de obra, resto de construção, madeira, ferro, telha... Lixo orgânico e material perigoso não pode.",
  },
  {
    q: "Vocês dão nota fiscal?",
    a: "Sim! A gente emite nota fiscal pra todos os serviços.",
  },
  {
    q: "Como faço pra pedir a retirada?",
    a: "Quando a caçamba encher ou no dia combinado, manda mensagem no WhatsApp que a gente busca.",
  },
];

const FAQSection = memo(() => {
  return (
    <section id="faq" className="bg-card py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-card-foreground md:text-3xl">
            Dúvidas? A gente responde
          </h2>
          <p className="text-muted-foreground">O que você precisa saber antes de pedir.</p>
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
            Ainda com dúvida? Chama no WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
