import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Atendem minha cidade?",
    a: "Trabalhamos com parceiros em diversas regiões do Brasil. Envie uma mensagem pelo WhatsApp e verificamos a disponibilidade na sua localização.",
  },
  {
    q: "Quanto custa o aluguel da caçamba?",
    a: "O valor varia conforme a região e o tamanho da caçamba. Entre em contato pelo WhatsApp para receber um orçamento rápido e sem compromisso.",
  },
  {
    q: "A entrega é rápida?",
    a: "Sim! Trabalhamos com agilidade para entregar a caçamba o mais rápido possível, muitas vezes no mesmo dia.",
  },
  {
    q: "Como funciona o agendamento?",
    a: "É simples: você entra em contato pelo WhatsApp, informamos a disponibilidade e agendamos a entrega no melhor horário para você.",
  },
];

const FAQSection = () => {
  return (
    <section className="bg-background py-14 md:py-20">
      <div className="container px-4">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground md:text-3xl">
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
