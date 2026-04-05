import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const PoliticaPrivacidade = () => {
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
          Política de Privacidade
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Informações Gerais</h2>
            <p>
              A NORTEX Caçambas, inscrita no CNPJ 61.774.679/0001-60, é a responsável pelo tratamento dos dados pessoais
              coletados neste site. Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e
              protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Dados Coletados</h2>
            <p>Coletamos os seguintes dados pessoais quando você utiliza nosso site ou solicita nossos serviços:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nome completo</li>
              <li>Número de telefone / WhatsApp</li>
              <li>Endereço e CEP para entrega da caçamba</li>
              <li>CPF (quando necessário para emissão de nota fiscal)</li>
              <li>E-mail (quando fornecido voluntariamente)</li>
              <li>Dados de navegação: endereço IP, tipo de navegador, páginas visitadas e tempo de permanência</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Finalidade do Tratamento</h2>
            <p>Os dados coletados são utilizados para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Processar e entregar pedidos de locação de caçamba</li>
              <li>Entrar em contato para confirmação de pedidos e suporte</li>
              <li>Emissão de notas fiscais e documentos relacionados</li>
              <li>Melhorar a experiência de navegação no site</li>
              <li>Enviar comunicações relacionadas ao serviço contratado</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Compartilhamento de Dados</h2>
            <p>
              Seus dados pessoais não são vendidos, alugados ou compartilhados com terceiros para fins comerciais.
              Podemos compartilhar informações apenas com:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Prestadores de serviço necessários à operação (logística, transporte)</li>
              <li>Órgãos públicos quando exigido por lei ou regulamentação</li>
              <li>Ferramentas de análise de tráfego (Google Analytics) de forma anonimizada</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Armazenamento e Segurança</h2>
            <p>
              Os dados são armazenados em servidores seguros com criptografia SSL/TLS. Adotamos medidas técnicas e
              organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda ou destruição.
              Os dados são retidos pelo período necessário ao cumprimento das finalidades descritas ou conforme
              exigências legais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Cookies</h2>
            <p>
              Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência de navegação, analisar
              o tráfego do site e personalizar conteúdo. Você pode configurar seu navegador para recusar cookies,
              mas isso pode afetar o funcionamento do site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Seus Direitos</h2>
            <p>De acordo com a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Confirmar a existência de tratamento de seus dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a exclusão de dados desnecessários</li>
              <li>Revogar o consentimento a qualquer momento</li>
            </ul>
            <p>
              Para exercer seus direitos, entre em contato pelo e-mail{" "}
              <a href="mailto:atendimento@nortexcacambas.com" className="text-primary hover:underline">
                atendimento@nortexcacambas.com
              </a>{" "}
              ou pelo telefone (11) 2085-4224.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Contato</h2>
            <p>
              Para dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais,
              entre em contato:
            </p>
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

export default PoliticaPrivacidade;
