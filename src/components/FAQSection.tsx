import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quais tamanhos de caçamba estão disponíveis?",
    a: "Trabalhamos com caçambas de 3m³, 5m³ e 7m³, atendendo desde pequenas reformas até grandes obras.",
  },
  {
    q: "Qual é o prazo de entrega?",
    a: "Nosso prazo de entrega é de até 24 horas após a confirmação do pedido, dependendo da região.",
  },
  {
    q: "Qual o tempo de locação da caçamba?",
    a: "O período padrão é de 3 a 7 dias, mas podemos ajustar conforme sua necessidade.",
  },
  {
    q: "O que pode ser descartado na caçamba?",
    a: "Entulho de obra, restos de construção, madeira, ferro, telhas e materiais similares. Lixo orgânico e produtos perigosos não são permitidos.",
  },
  {
    q: "Vocês emitem nota fiscal?",
    a: "Sim, emitimos nota fiscal para todos os serviços prestados.",
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Aceitamos PIX, cartão de crédito, débito e boleto bancário.",
  },
  {
    q: "Vocês atendem minha região?",
    a: "Atendemos diversas regiões. Entre em contato pelo WhatsApp para confirmar a disponibilidade na sua localização.",
  },
];

const FAQSection = () => {
  return (
    <section className="bg-card py-14 md:py-20">
      <div className="container px-4">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-card-foreground md:text-3xl">
          Perguntas Frequentes
        </h2>
        <Accordion type="single" collapsible className="mx-auto max-w-2xl">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger className="text-left text-base font-bold">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
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
