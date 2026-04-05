import { memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quais tamanhos de caçamba a NORTEX oferece?",
    a: "Temos caçambas de 3 m³, 4 m³, 5 m³, 7 m³, 10 m³ e 26 m³ — desde reformas simples até demolições completas.",
  },
  {
    q: "Em quanto tempo a caçamba chega no meu endereço?",
    a: "Após a confirmação, a entrega acontece de forma rápida na capital, Guarulhos, Campinas, Osasco, ABC e demais regiões atendidas, podendo variar conforme a localização.",
  },
  {
    q: "Quais regiões de SP vocês cobrem?",
    a: "Atendemos São Paulo capital, Guarulhos, Campinas, Osasco, ABC (Santo André, São Bernardo, São Caetano), Sorocaba, Ribeirão Preto, São José dos Campos, São José do Rio Preto, Jandira e diversas outras cidades do estado.",
  },
  {
    q: "Por quanto tempo posso ficar com a caçamba?",
    a: "O período padrão vai de 3 a 7 dias, mas ajustamos conforme a sua demanda. É só combinar pelo WhatsApp.",
  },
  {
    q: "O que posso colocar dentro da caçamba?",
    a: "Entulho de obra, restos de construção, madeira, ferro, telhas e materiais semelhantes. Lixo orgânico e produtos perigosos não são permitidos.",
  },
  {
    q: "Quais formas de pagamento vocês aceitam?",
    a: "Pix, cartão de crédito, débito e boleto bancário. Tudo feito de forma online, sem complicação.",
  },
  {
    q: "A NORTEX emite nota fiscal?",
    a: "Sim, emitimos nota fiscal para todos os serviços realizados.",
  },
  {
    q: "Como funciona para retirar a caçamba?",
    a: "Você agenda a retirada pelo WhatsApp quando a caçamba estiver cheia ou no prazo combinado. Simples assim.",
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
          <p className="text-muted-foreground">Tudo que você precisa saber antes de alugar.</p>
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
