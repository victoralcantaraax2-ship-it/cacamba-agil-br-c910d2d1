import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quais capacidades estão disponíveis?",
    a: "Disponibilizamos caçambas de 3m³, 4m³, 5m³, 7m³, 10m³ e 26m³, adequadas desde pequenos reparos até grandes demolições.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "A entrega ocorre em até 2 horas após a confirmação, variando conforme a localização.",
  },
  {
    q: "Quanto tempo posso manter a caçamba?",
    a: "O período padrão vai de 3 a 7 dias, mas ajustamos conforme sua demanda. Basta combinar pelo WhatsApp.",
  },
  {
    q: "O que posso descartar na caçamba?",
    a: "Entulho de obra, restos de construção, madeira, ferro, telhas e materiais similares. Lixo orgânico e produtos perigosos não são aceitos.",
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Aceitamos Pix, cartão de crédito, débito e boleto bancário. Tudo pode ser feito online.",
  },
  {
    q: "É emitida nota fiscal?",
    a: "Sim, emitimos nota fiscal para todos os serviços.",
  },
  {
    q: "Como funciona a recolha?",
    a: "A retirada é marcada conforme sua necessidade. Entre em contato pelo WhatsApp quando a caçamba estiver completa ou no prazo acordado.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="bg-card py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-card-foreground md:text-3xl">
            Dúvidas Comuns
          </h2>
          <p className="text-muted-foreground">Esclareça suas questões sobre o serviço.</p>
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
      </div>
    </section>
  );
};

export default FAQSection;
