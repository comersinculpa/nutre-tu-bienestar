import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewIndex from "./pages/NewIndex";
import NewDiario from "./pages/NewDiario";
import NewCrisis from "./pages/NewCrisis";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import DiarioEmocional from "./pages/DiarioEmocional";
import RegistroAlimentario from "./pages/RegistroAlimentario";
import CheckIn from "./pages/CheckIn";
import Progreso from "./pages/Progreso";
import Perfil from "./pages/Perfil";
import Cuestionarios from "./pages/Cuestionarios";
import Talleres from "./pages/Talleres";
import Recursos from "./pages/Recursos";
import Comunidad from "./pages/Comunidad";
import Pausa from "./pages/Pausa";
import DetectorHambre from "./pages/DetectorHambre";
import TCAModule from "./pages/TCAModule";
import NotFound from "./pages/NotFound";
import { BottomNavigation } from "./components/BottomNavigation";
import { CrisisButton } from "./components/CrisisButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <CrisisButton />
          <Routes>
            <Route path="/" element={<NewIndex />} />
            <Route path="/diario-emocional" element={<NewDiario />} />
            <Route path="/comunidad" element={<Comunidad />} />
            <Route path="/recursos" element={<Recursos />} />
            <Route path="/crisis" element={<NewCrisis />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/registro-alimentario" element={<RegistroAlimentario />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/progreso" element={<Progreso />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/cuestionarios" element={<Cuestionarios />} />
            <Route path="/talleres" element={<Talleres />} />
            <Route path="/pausa" element={<Pausa />} />
            <Route path="/detector-hambre" element={<DetectorHambre />} />
            <Route path="/tca-module" element={<TCAModule />} />
            {/* Legacy routes for backward compatibility */}
            <Route path="/diario" element={<DiarioEmocional />} />
            <Route path="/detector" element={<DetectorHambre />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
