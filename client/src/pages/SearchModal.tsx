import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, X, User, FileText, Loader2, UserCircle2 } from 'lucide-react';

export default function SearchModal() {
  const { setStep, setUserData, setUsersList, userRole } = useAuth();
  const isClient = userRole === 'client';

  const [searchType, setSearchType] = useState<'dni' | 'correo'>('dni');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = new URL('https://n8n-oneplaype.cd-latam.com:5678/webhook/get_user');
      url.searchParams.append(searchType, searchValue);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: '7K9P2MX8V3QRTW6ZY4ACB5EJ0FL1NG',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      const userHasContent = (u: any) => {
        if (!u || typeof u !== 'object') return false;
        if ('user' in u) {
          u = u.user;
          if (!u || typeof u !== 'object') return false;
        }
        if (!u.email || String(u.email).trim() === '') return false;
        if (searchType === 'dni') {
          if (!u.rut || String(u.rut).trim() === '') return false;
        }
        return true;
      };

      setUsersList([]);

      const validUsers: any[] = [];
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (userHasContent(item)) validUsers.push(item);
        });
      } else {
        if (userHasContent(data)) validUsers.push(data);
      }

      if (validUsers.length === 0) {
        const label = searchType === 'dni' ? 'DNI' : 'correo';
        setError(`❌ No se encontró ninguna cuenta con ese ${label}. Verifica los datos e intenta de nuevo.`);
        return;
      }

      if (validUsers.length > 1) {
        setUsersList(validUsers);
        setStep('user-list');
      } else {
        setUserData(validUsers[0]);
        setStep('user-info');
      }
    } catch (err) {
      setError(`Error al conectar: ${err instanceof Error ? err.message : 'Intenta de nuevo.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    setStep('dashboard');
    setSearchValue('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full my-4 sm:my-8 animate-in slide-in-from-bottom-4 duration-300 border border-border flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b border-border shrink-0 ${isClient ? 'bg-gradient-to-r from-accent/10 to-cyan-500/10' : 'bg-gradient-to-r from-primary/10 to-accent/10'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isClient ? 'bg-accent/20' : 'bg-primary/20'}`}>
              {isClient
                ? <UserCircle2 className="h-5 w-5 text-accent" />
                : <User className="h-5 w-5 text-primary" />
              }
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isClient ? 'Buscar Mi Cuenta' : 'Buscar Cliente'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isClient
                  ? 'Ingresa tu DNI o correo para encontrar tu cuenta'
                  : 'Ingresa el DNI o correo del cliente'
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleGoBack}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSearch} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">

          {/* Selector tipo de búsqueda */}
          <div className="space-y-2">
            <label htmlFor="searchType" className="block text-sm font-medium text-foreground">
              Buscar por:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['dni', 'correo'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setSearchType(type); setSearchValue(''); setError(''); }}
                  className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all border ${searchType === type
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-secondary/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                    }`}
                >
                  {type === 'dni' ? '📋 DNI' : '📧 Correo'}
                </button>
              ))}
            </div>
          </div>

          {/* Campo de entrada */}
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm font-medium text-foreground">
              {searchType === 'dni'
                ? isClient ? 'Tu número de DNI' : 'Número de DNI del cliente'
                : isClient ? 'Tu correo electrónico' : 'Correo del cliente'
              }
            </label>
            <div className="relative">
              {searchType === 'dni'
                ? <FileText className="absolute left-3 top-3.5 h-5 w-5 text-primary" />
                : <User className="absolute left-3 top-3.5 h-5 w-5 text-accent" />
              }
              <input
                id="search"
                type={searchType === 'correo' ? 'email' : 'text'}
                value={searchValue}
                onChange={(e) => { setSearchValue(e.target.value); setError(''); }}
                placeholder={searchType === 'dni' ? 'Ej: 12345678' : 'Ej: usuario@example.com'}
                className="input-field pl-10"
                disabled={isLoading}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-destructive/20 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Tip */}
          <div className={`p-3 rounded-lg border text-xs ${isClient ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-accent/10 border-accent/30 text-accent'}`}>
            <strong>Tip:</strong>{' '}
            {isClient
              ? `Si tienes múltiples cuentas registradas con el mismo ${searchType === 'dni' ? 'DNI' : 'correo'}, te aparecerán todas para que elijas la que quieres ver.`
              : `Asegúrate de ingresar ${searchType === 'dni' ? 'el DNI correcto' : 'el correo válido'} del cliente.`
            }
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-border bg-secondary/50 rounded-b-2xl shrink-0">
          <button
            onClick={handleGoBack}
            className="btn-secondary flex-1 w-full sm:w-auto"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={(e) => handleSearch(e as any)}
            disabled={isLoading || !searchValue.trim()}
            className="btn-primary flex-1 w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                {isClient ? 'Buscar mi cuenta' : 'Siguiente'}
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
