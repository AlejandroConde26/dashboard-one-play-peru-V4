import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Lock, Settings, HelpCircle, Bell, Menu, X, UserPlus, UserCircle, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import RegisterModal from './RegisterModal';

export default function Dashboard() {
  const { setStep, logout, username, userRole, userData } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const handlePasswordManagement = () => {
    setStep('search');
  };

  // El cliente busca su cuenta por DNI o correo
  const handleMyProfile = () => {
    setStep('search');
  };

  const isAdmin = userRole === 'admin';

  return (
    <>
      {/* Modal de Registro */}
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />

      {/* Dashboard */}
      <div className="min-h-screen bg-gradient-dark flex">
        {/* Overlay para móvil cuando el sidebar está abierto */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed inset-y-0 left-0 z-50 w-64 md:relative md:translate-x-0 ${sidebarOpen ? 'md:w-64' : 'md:w-0'
            } bg-sidebar text-foreground transition-all duration-300 overflow-hidden shadow-2xl flex flex-col border-r border-border`}
        >
          {/* Logo/Header del Sidebar */}
          <div className="p-6 border-b border-border flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img src="/logo-official.png" alt="One Play Perú" className="h-10 w-auto" />
              </div>
              <p className="text-muted-foreground text-xs">
                {isAdmin ? 'Panel de Administración' : 'Portal de Cliente'}
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-secondary rounded-lg text-muted-foreground"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Contenido del Sidebar */}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div className="bg-secondary rounded-lg p-4 border border-border">
                <p className="text-xs text-muted-foreground">Usuario conectado</p>
                <p className="text-lg font-semibold mt-1 text-accent">{username}</p>

                {/* Badge de Rol */}
                <div className="mt-2">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-primary/20 text-primary px-2.5 py-1 rounded-full font-medium border border-primary/30">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Administrador
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-accent/20 text-accent px-2.5 py-1 rounded-full font-medium border border-accent/30">
                      <UserCircle className="h-3.5 w-3.5" />
                      Cliente
                    </span>
                  )}
                </div>
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
        <main className="flex-1 flex flex-col min-w-0">
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
                  <p className="text-muted-foreground text-sm">
                    Bienvenido, {username}
                    {!isAdmin && userData &&
                      ` · ${userData.nombres} ${userData.paterno}`
                    }
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Grid de Tarjetas */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* ═══ TARJETA PRINCIPAL (diferente por rol) ═══ */}
                {isAdmin ? (
                  /* Admin: Gestión de contraseñas (buscar cualquier usuario) */
                  <div
                    onClick={handlePasswordManagement}
                    className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-2xl border border-border bg-gradient-to-br from-primary to-green-600 p-6 h-64 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-white/20 rounded-lg">
                            <Lock className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">Solo Admin</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Modificar Usuarios</h2>
                        <p className="text-green-100 text-sm">Busca y edita cualquier cliente del sistema</p>
                      </div>
                      <div className="relative z-10 flex items-center gap-2 text-white text-sm font-medium group-hover:translate-x-1 transition-transform">
                        <span>Acceder</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Cliente: Mi Perfil (solo lectura) */
                  <div
                    onClick={handleMyProfile}
                    className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-2xl border border-border bg-gradient-to-br from-accent/80 to-cyan-600 p-6 h-64 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-white/20 rounded-lg">
                            <UserCircle className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">Mi cuenta</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Mi Perfil</h2>
                        <p className="text-cyan-100 text-sm">
                          Ver tu información y cambiar tu contraseña
                        </p>
                      </div>
                      <div className="relative z-10 flex items-center gap-2 text-white text-sm font-medium group-hover:translate-x-1 transition-transform">
                        <span>Ver perfil</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tarjeta: Crear Usuario (ambos roles) */}
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

                {/* Tarjeta: Notificaciones */}
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

                {/* Tarjeta: Configuración */}
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

                {/* Tarjeta: Ayuda */}
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
