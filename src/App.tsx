import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import MainMenu from "./pages/MainMenu";
import NewDiario from "./pages/NewDiario";
import NewCrisis from "./pages/NewCrisis";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DiarioEmocional from "./pages/DiarioEmocional";
import RegistroAlimentario from "./pages/RegistroAlimentario";
import CheckIn from "./pages/CheckIn";
import CheckInDiario from "./pages/CheckInDiario";
import PausaConsciente from "./pages/PausaConsciente";
import ComerConCuidado from "./pages/ComerConCuidado";
import Laboratorio from "./pages/Laboratorio";
import IACompanion from "./components/IACompanion";
import CrisisSupport from "./pages/CrisisSupport";
import Registrar from "./pages/Registrar";
import MiProgreso from "./pages/MiProgreso";
import Progreso from "./pages/Progreso";
import Perfil from "./pages/Perfil";
import Cuestionarios from "./pages/Cuestionarios";
import Talleres from "./pages/Talleres";
import Recursos from "./pages/Recursos";
import Comunidad from "./pages/Comunidad";
import Pausa from "./pages/Pausa";
import DetectorHambre from "./pages/DetectorHambre";
import TCAModule from "./pages/TCAModule";
import JuegosPage from "./pages/JuegosPage";
import Suscripcion from "./pages/Suscripcion";
import SuscripcionWeb from "./pages/SuscripcionWeb";
import SubscriptionRouter from "./pages/SubscriptionRouter";
import NotFound from "./pages/NotFound";
import { BottomNavigation } from "./components/BottomNavigation";
import { CrisisButton } from "./components/CrisisButton";
import { PersistentFAB } from "./components/PersistentFAB";
import TherapistChat from "./components/TherapistChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <CrisisButton />
            <PersistentFAB />
            <Routes>
              <Route path="/" element={<MainMenu />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/registrar" element={<Registrar />} />
              <Route path="/diario-emocional" element={<NewDiario />} />
              <Route path="/apoyo" element={<TherapistChat />} />
              <Route path="/comunidad" element={<Comunidad />} />
              <Route path="/recursos" element={<Recursos />} />
              <Route path="/crisis" element={<CrisisSupport />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/registro-alimentario" element={<RegistroAlimentario />} />
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/check-in-diario" element={<CheckInDiario />} />
              <Route path="/pausa-consciente" element={<PausaConsciente />} />
              <Route path="/comer-con-cuidado" element={<ComerConCuidado />} />
              <Route path="/laboratorio" element={<Laboratorio />} />
              <Route path="/ia-companion" element={<IACompanion />} />
              <Route path="/progreso" element={<MiProgreso />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/cuestionarios" element={<Cuestionarios />} />
              <Route path="/talleres" element={<Talleres />} />
              <Route path="/pausa" element={<Pausa />} />
              <Route path="/detector-hambre" element={<DetectorHambre />} />
              <Route path="/tca-module" element={<TCAModule />} />
              <Route path="/juegos" element={<JuegosPage />} />
              <Route path="/planes" element={<SubscriptionRouter />} />
              <Route path="/suscripcion" element={<Suscripcion />} />
              <Route path="/suscripcion-web" element={<SuscripcionWeb />} />
              {/* Legacy routes for backward compatibility */}
              <Route path="/diario" element={<DiarioEmocional />} />
              <Route path="/detector" element={<DetectorHambre />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNavigation />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
