import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quais tamanhos vocês oferecem?",
    a: "Trabalhamos com caçambas de 3m³, 5m³, 7m³ e 10m³, ideais para pequenas reformas até grandes obras e demolições.",
  },
  {
    q: "Em quanto tempo entregam?",
    a: "A entrega é feita em até 24 horas após a confirmação do pedido, dependendo da região de atendimento.",
  },
  {
    q: "Por quanto tempo posso ficar com a caçamba?",
    a: "O período padrão é de 3 a 7 dias, mas podemos ajustar conforme a sua necessidade. Entre em contato pelo WhatsApp para combinar.",
  },
  {
    q: "O que pode ser colocado na caçamba?",
    a: "Entulho de obra, restos de construção, madeira, ferro, telhas e materiais similares. Lixo orgânico e produtos perigosos não são permitidos.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Aceitamos Pix, cartão de crédito, débito e boleto bancário. O pagamento pode ser feito online de forma prática.",
  },
  {
    q: "Vocês emitem nota fiscal?",
    a: "Sim, emitimos nota fiscal para todos os serviços realizados.",
  },
  {
    q: "Como é feita a retirada?",
    a: "A retirada é agendada conforme sua necessidade. Basta entrar em contato pelo WhatsApp quando a caçamba estiver cheia ou no prazo combinado.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="bg-card py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-card-foreground md:text-3xl">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground">Tire suas dúvidas sobre o serviço.</p>
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
