import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import SearchModal from "@/pages/SearchModal";
import LoadingScreen from "@/pages/LoadingScreen";
import SuccessScreen from "@/pages/SuccessScreen";
import UserInfoScreen from "@/pages/UserInfoScreen";
import UserListScreen from "@/pages/UserListScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

/**
 * Componente Router que maneja el flujo de pantallas
 * 1. Login - Pantalla inicial de autenticacion
 * 2. Dashboard - Panel principal con opciones
 * 3. SearchModal - Modal para buscar cliente
 * 4. UserInfoScreen - Informacion del usuario encontrado
 * 5. LoadingScreen - Pantalla de carga
 * 6. SuccessScreen - Resultado exitoso
 */
function Router() {
  const { currentStep } = useAuth();

  return (
    <>
      {/* Pantalla 1: Login */}
      {currentStep === 'login' && <Login />}

      {/* Pantalla 2: Dashboard (Se renderiza siempre que estemos logueados, de fondo) */}
      {currentStep !== 'login' && <Dashboard />}

      {/* Pantalla 3: Modal de busqueda */}
      {currentStep === 'search' && <SearchModal />}

      {/* Pantalla 4: Informacion del usuario */}
      {currentStep === 'user-info' && <UserInfoScreen />}

      {/* Pantalla 5: Pantalla de carga */}
      {currentStep === 'loading' && <LoadingScreen />}

      {/* Pantalla 6: Pantalla de exito */}
      {currentStep === 'success' && <SuccessScreen />}

      {/* Pantalla 7: Lista de usuarios */}
      {currentStep === 'user-list' && <UserListScreen />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
