import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, User } from 'lucide-react';

/**
 * Pantalla 1: Login - One Play Perú
 * Diseño: Moderno con logo oficial, banner y paleta verde/cyan
 * - Logo de One Play Perú
 * - Banner como fondo decorativo
 * - Formulario profesional
 */
export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      login(username, password);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Fondo con banner decorativo */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="/banner.jpg" 
          alt="One Play Perú" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-in fade-in duration-500">
          {/* Tarjeta de login */}
          <div className="bg-card rounded-2xl shadow-2xl border border-border p-8 space-y-8">
            {/* Logo y Encabezado */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <img 
                  src="/logo-official.png" 
                  alt="One Play Perú" 
                  className="h-20 w-auto object-contain"
                />
              </div>
              <p className="text-muted-foreground text-sm">Gestión de Contraseñas Segura</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Usuario */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-foreground">
                  Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-accent" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingrese su usuario"
                    className="input-field pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-accent" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    className="input-field pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Botón Iniciar Sesión */}
              <button
                type="submit"
                disabled={isLoading || !username.trim() || !password.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Pie de página */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Credenciales de prueba: <span className="font-mono font-medium text-accent">admin</span> / <span className="font-mono font-medium text-accent">1234</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
