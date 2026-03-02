import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Lock, Settings, HelpCircle, Bell, Menu, X, UserPlus } from 'lucide-react';
import { useState } from 'react';
import RegisterModal from './RegisterModal';

/**
 * Pantalla 2: Dashboard Principal - One Play Perú
 * Diseño: Sidebar + Grid de tarjetas con identidad visual One Play
 */
export default function Dashboard() {
  const { setStep, logout, username } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const handlePasswordManagement = () => {
    setStep('search');
  };

  return (
    <>
      {/* Modal de Registro */}
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />

      {/* Dashboard */}
      <div className="min-h-screen bg-gradient-dark flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-sidebar text-foreground transition-all duration-300 overflow-hidden shadow-2xl flex flex-col border-r border-border`}
      >
        {/* Logo/Header del Sidebar */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo-official.png" alt="One Play Perú" className="h-10 w-auto" />
          </div>
          <p className="text-muted-foreground text-xs">Gestión de Contraseñas</p>
        </div>

        {/* Contenido del Sidebar */}
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <div className="bg-secondary rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground">Usuario conectado</p>
              <p className="text-lg font-semibold mt-1 text-accent">{username}</p>
            </div>
          </div>
        </div>

        {/* Footer del Sidebar - Cerrar Sesión */}
        <div className="p-6 border-t border-border">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-lg sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
                )}
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Dashboard One Play Perú
                </h1>
                <p className="text-muted-foreground text-sm">Bienvenido, {username}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Grid de Tarjetas */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tarjeta 1: Gestión de Contraseña (Principal) */}
              <div
                onClick={handlePasswordManagement}
                className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="relative overflow-hidden rounded-xl shadow-2xl border border-border bg-gradient-to-br from-primary to-green-600 p-6 h-64 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  {/* Fondo decorativo */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                  </div>

                  {/* Contenido */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Gestión de Contraseña</h2>
                    <p className="text-green-100 text-sm">Genera contraseñas seguras para tus clientes</p>
                  </div>

                  {/* Indicador de acción */}
                  <div className="relative z-10 flex items-center gap-2 text-white text-sm font-medium group-hover:translate-x-1 transition-transform">
                    <span>Acceder</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Crear Usuario */}
              <div
                onClick={() => setShowRegister(true)}
                className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
              >
                <div className="card-elevated p-6 h-64 flex flex-col justify-between hover:shadow-2xl transition-all duration-200 transform hover:scale-105 border-2 border-dashed border-primary/50">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-primary/20 rounded-lg">
                        <UserPlus className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground mb-1 text-lg">Crear Usuario</h3>
                    <p className="text-sm text-muted-foreground">Registra un nuevo usuario en el sistema</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                    <span>Crear</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tarjeta 3: Notificaciones */}
              <div className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <div className="card-elevated p-6 h-64 flex flex-col justify-between hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <Bell className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground mb-1 text-lg">Notificaciones</h3>
                    <p className="text-sm text-muted-foreground">Gestiona tus notificaciones</p>
                  </div>
                  <div className="text-xs text-muted-foreground">Próximamente</div>
                </div>
              </div>

              {/* Tarjeta 4: Configuración */}
              <div className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <div className="card-elevated p-6 h-64 flex flex-col justify-between hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <Settings className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground mb-1 text-lg">Configuración</h3>
                    <p className="text-sm text-muted-foreground">Ajusta tus preferencias</p>
                  </div>
                  <div className="text-xs text-muted-foreground">Próximamente</div>
                </div>
              </div>

              {/* Tarjeta 5: Ayuda */}
              <div className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <div className="card-elevated p-6 h-64 flex flex-col justify-between hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <HelpCircle className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground mb-1 text-lg">Centro de Ayuda</h3>
                    <p className="text-sm text-muted-foreground">Obtén soporte técnico</p>
                  </div>
                  <div className="text-xs text-muted-foreground">Próximamente</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}
