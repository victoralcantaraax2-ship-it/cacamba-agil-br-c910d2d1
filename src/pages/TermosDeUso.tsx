import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const TermosDeUso = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <main className="min-h-screen bg-background">
      <div className="container max-w-3xl px-4 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Termos de Uso
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o site da NORTEX Caçambas (ambalocacao.com), você concorda com estes Termos de Uso.
              Caso não concorde com alguma disposição, recomendamos que não utilize o site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Descrição dos Serviços</h2>
            <p>
              A NORTEX Caçambas oferece serviços de locação de caçambas estacionárias para coleta e transporte de
              resíduos de construção civil, limpeza e reforma. Os serviços incluem:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Locação de caçambas nos tamanhos de 3m³ a 10m³</li>
              <li>Entrega e retirada no endereço indicado pelo cliente</li>
              <li>Transporte e destinação adequada dos resíduos conforme legislação ambiental vigente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Condições de Locação</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>O prazo padrão de locação é de até 7 (sete) dias corridos, salvo acordo em contrário</li>
              <li>A caçamba deve ser utilizada exclusivamente para resíduos permitidos (entulho, madeira, metais, plásticos de construção)</li>
              <li>É proibido depositar resíduos orgânicos, materiais perigosos, inflamáveis, tóxicos ou hospitalares</li>
              <li>O volume depositado não pode ultrapassar a borda superior da caçamba</li>
              <li>O cliente é responsável pela autorização de ocupação do espaço público junto à prefeitura, quando aplicável</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Preços e Pagamento</h2>
            <p>
              Os preços são informados no site e podem ser alterados sem aviso prévio. O pagamento pode ser
              realizado via PIX ou cartão de crédito, conforme opções disponíveis no momento da contratação.
              A locação é confirmada após a confirmação do pagamento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Responsabilidades do Cliente</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fornecer informações corretas de endereço e contato</li>
              <li>Garantir acesso adequado ao local para entrega e retirada da caçamba</li>
              <li>Não exceder a capacidade da caçamba</li>
              <li>Não depositar materiais proibidos</li>
              <li>Responder por danos causados à caçamba durante o período de locação</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Responsabilidades da NORTEX Caçambas</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Entregar a caçamba no prazo e local combinados</li>
              <li>Realizar a retirada no prazo acordado</li>
              <li>Destinar os resíduos de forma ambientalmente correta e dentro da legislação</li>
              <li>Fornecer comprovantes e documentação quando solicitado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Cancelamento</h2>
            <p>
              O cancelamento pode ser solicitado antes da entrega da caçamba, sem custo adicional.
              Após a entrega, não há reembolso do valor pago. Em caso de atraso na retirada por parte da
              NORTEX Caçambas, o cliente não será cobrado por diárias extras.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo do site (textos, imagens, logotipos, layout) é de propriedade da NORTEX Caçambas
              e protegido pela legislação de direitos autorais. É proibida a reprodução sem autorização prévia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Limitação de Responsabilidade</h2>
            <p>
              A NORTEX Caçambas não se responsabiliza por danos indiretos decorrentes do uso do site ou
              interrupções temporárias do serviço online. O site é disponibilizado "como está", sem
              garantias de disponibilidade ininterrupta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Foro</h2>
            <p>
              Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer questões
              decorrentes destes Termos de Uso.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">11. Contato</h2>
            <ul className="list-none space-y-1">
              <li><strong>NORTEX Caçambas</strong></li>
              <li>CNPJ: 61.774.679/0001-60</li>
              <li>E-mail: atendimento@ambalocacao.com</li>
              <li>Telefone: (11) 2085-4224</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
};

export default TermosDeUso;
