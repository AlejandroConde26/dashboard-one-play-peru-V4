import { useState } from 'react';
import { useAuth, MOCK_USERS } from '@/contexts/AuthContext';
import { Lock, User, ShieldCheck, UserCircle2, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      if (!result.success) {
        setError(result.message || 'Credenciales incorrectas');
      }
      setIsLoading(false);
    }, 500);
  };

  // Separar usuarios mock por rol para mostrar en las tarjetas
  const adminUsers = MOCK_USERS.filter((u) => u.role === 'admin');
  const clientUsers = MOCK_USERS.filter((u) => u.role === 'client');

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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Formulario de Login ── */}
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
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/15 border border-destructive/40 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

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
                      onChange={(e) => { setUsername(e.target.value); setError(''); }}
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
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Ingrese su contraseña"
                      className="input-field pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Botón */}
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
            </div>

            {/* ── Panel de Cuentas de Prueba ── */}
            <div className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
                  Cuentas de prueba disponibles
                </p>
              </div>

              {/* Tarjetas Admin */}
              {adminUsers.map((u) => (
                <div
                  key={u.username}
                  onClick={() => { setUsername(u.username); setPassword(u.password); setError(''); }}
                  className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/40 rounded-xl p-5 cursor-pointer hover:border-primary/80 hover:from-primary/30 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-bold text-foreground">Administrador</span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Admin</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Acceso total: editar usuarios, gestionar contraseñas y crear cuentas.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-card/60 rounded-lg px-3 py-2">
                          <p className="text-xs text-muted-foreground mb-0.5">Usuario</p>
                          <p className="font-mono font-semibold text-accent text-sm">{u.username}</p>
                        </div>
                        <div className="bg-card/60 rounded-lg px-3 py-2">
                          <p className="text-xs text-muted-foreground mb-0.5">Contraseña</p>
                          <p className="font-mono font-semibold text-accent text-sm">{u.password}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-primary/70 mt-3 text-right">Haz clic para autocompletar →</p>
                </div>
              ))}

              {/* Tarjetas Cliente */}
              {clientUsers.map((u) => (
                <div
                  key={u.username}
                  onClick={() => { setUsername(u.username); setPassword(u.password); setError(''); }}
                  className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/40 rounded-xl p-5 cursor-pointer hover:border-accent/80 hover:from-accent/30 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/20 rounded-lg flex-shrink-0 group-hover:bg-accent/30 transition-colors">
                      <UserCircle2 className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-bold text-foreground">Cliente</span>
                        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">Cliente</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Acceso limitado: ver su perfil, cambiar contraseña y crear nuevos usuarios.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-card/60 rounded-lg px-3 py-2">
                          <p className="text-xs text-muted-foreground mb-0.5">Usuario</p>
                          <p className="font-mono font-semibold text-accent text-sm">{u.username}</p>
                        </div>
                        <div className="bg-card/60 rounded-lg px-3 py-2">
                          <p className="text-xs text-muted-foreground mb-0.5">Contraseña</p>
                          <p className="font-mono font-semibold text-accent text-sm">{u.password}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-accent/70 mt-3 text-right">Haz clic para autocompletar →</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
