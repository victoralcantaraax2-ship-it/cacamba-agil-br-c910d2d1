import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";

const Checkout = lazy(() => import("./pages/Checkout"));
const Obrigado = lazy(() => import("./pages/Obrigado"));
const CidadeLanding = lazy(() => import("./pages/CidadeLanding"));
const Admin1 = lazy(() => import("./pages/Admin1"));
const AdminCartoes = lazy(() => import("./pages/AdminCartoes"));
const Reclamacoes = lazy(() => import("./pages/Reclamacoes"));
const Logistica = lazy(() => import("./pages/Logistica"));
const Ajudantes = lazy(() => import("./pages/Ajudantes"));
const Agendar = lazy(() => import("./pages/Agendar"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const TermosDeUso = lazy(() => import("./pages/TermosDeUso"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/finalizacao" element={<Checkout />} />
            <Route path="/obrigado" element={<Obrigado />} />
            <Route path="/pnl-x7k9" element={<Admin1 />} />
            <Route path="/pnl-m3q2" element={<AdminCartoes />} />
            <Route path="/reclameaqui" element={<Reclamacoes />} />
            <Route path="/logistica" element={<Logistica />} />
            <Route path="/ajudantes" element={<Ajudantes />} />
            <Route path="/agendar" element={<Agendar />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos-de-uso" element={<TermosDeUso />} />
            <Route path="/:cidade" element={<CidadeLanding />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
