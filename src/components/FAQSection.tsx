import { memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quais tamanhos de caçamba estão disponíveis?",
    a: "Disponibilizamos caçambas de 3 m³, 4 m³, 5 m³, 7 m³, 10 m³ e 26 m³, adequadas desde pequenos reparos até grandes demolições.",
  },
  {
    q: "Qual o prazo de entrega em Santa Catarina?",
    a: "A entrega ocorre em até 2 horas após a confirmação para cidades como Joinville, São José, Palhoça, Itapema, Navegantes e Jaraguá do Sul, podendo variar conforme a localização.",
  },
  {
    q: "Quais cidades de SC vocês atendem?",
    a: "Atendemos Joinville, São José, Palhoça, Itapema, Navegantes, Jaraguá do Sul, Florianópolis, Blumenau, Balneário Camboriú, Itajaí e diversas outras cidades de Santa Catarina.",
  },
  {
    q: "Quanto tempo posso ficar com a caçamba?",
    a: "O período padrão vai de 3 a 7 dias, mas ajustamos conforme a sua necessidade. Basta combinar pelo WhatsApp.",
  },
  {
    q: "O que posso descartar na caçamba?",
    a: "Entulho de obra, restos de construção, madeira, ferro, telhas e materiais similares. Lixo orgânico e produtos perigosos não são aceitos.",
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Aceitamos Pix, cartão de crédito, débito e boleto bancário. Tudo pode ser feito de forma online.",
  },
  {
    q: "Vocês emitem nota fiscal?",
    a: "Sim, emitimos nota fiscal para todos os serviços prestados.",
  },
  {
    q: "Como funciona a retirada da caçamba?",
    a: "A retirada é agendada conforme a sua necessidade. Entre em contato pelo WhatsApp quando a caçamba estiver cheia ou no prazo combinado.",
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
          <p className="text-muted-foreground">Tire suas dúvidas sobre o serviço de locação.</p>
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
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
