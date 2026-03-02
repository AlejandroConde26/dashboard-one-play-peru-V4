import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, X, User, FileText, Loader2 } from 'lucide-react';

/**
 * Pantalla 3: Modal de Búsqueda de Cliente - One Play Perú
 * Integración con API n8n usando Query Parameters
 * Parámetros: dni o correo
 */
export default function SearchModal() {
  const { setStep, setUserData } = useAuth();
  const [searchType, setSearchType] = useState<'dni' | 'correo'>('dni');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Como fetch no permite body en métodos GET, pasamos los datos como query parameters.
      // Asegúrate de que tu nodo Webhook en n8n esté configurado para leer "Query Parameters".
      const url = new URL('http://191.98.169.6:5678/webhook/get_user');
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

      // normaliza respuesta a un solo usuario
      const userObj: any = Array.isArray(data) ? data[0] : data;

      // validación fiera: el objeto debe existir y contener al menos un campo útil
      const userHasContent = (u: any) => {
        if (!u || typeof u !== 'object') return false;
        // si la respuesta viene envuelta en { user: ... }
        if ('user' in u) {
          u = u.user;
          if (!u || typeof u !== 'object') return false;
        }
        // tiene que haber un email válido para considerar que hay datos
        if (!u.email || String(u.email).trim() === '') return false;
        // si buscamos por DNI aseguramos además que el rut exista
        if (searchType === 'dni') {
          if (!u.rut || String(u.rut).trim() === '') return false;
        }
        return true;
      };

      if (!userHasContent(userObj)) {
        const searchTypeLabel = searchType === 'dni' ? 'DNI' : 'correo';
        setError(`❌ Usuario con ${searchTypeLabel} no encontrado. Por favor, verifica los datos e intenta de nuevo.`);
        return;
      }

      // aquí sabemos que el objeto es válido
      setUserData(userObj);
      setStep('user-info');
    } catch (err) {
      setError(`Error al conectar con n8n: ${err instanceof Error ? err.message : 'Intenta de nuevo.'}`);
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      {/* Modal */}
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300 border border-border">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <h2 className="text-xl font-bold text-foreground">Buscar Cliente</h2>
          <button
            onClick={handleGoBack}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Contenido del modal */}
        <form onSubmit={handleSearch} className="p-6 space-y-6">
          {/* Descripción */}
          <p className="text-muted-foreground text-sm">
            Selecciona cómo deseas buscar al cliente y luego ingresa el valor.
          </p>

          {/* Selector de tipo de búsqueda */}
          <div className="space-y-2">
            <label htmlFor="searchType" className="block text-sm font-medium text-foreground">
              Buscar por:
            </label>
            <select
              id="searchType"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'dni' | 'correo')}
              className="input-field w-full"
            >
              <option value="dni">DNI</option>
              <option value="correo">Correo</option>
            </select>
          </div>

          {/* Campo de entrada */}
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm font-medium text-foreground">
              {searchType === 'dni' ? 'Número de DNI' : 'Correo del Cliente'}
            </label>
            <div className="relative">
              {searchType === 'dni' ? (
                <FileText className="absolute left-3 top-3.5 h-5 w-5 text-primary" />
              ) : (
                <User className="absolute left-3 top-3.5 h-5 w-5 text-accent" />
              )}
              <input
                id="search"
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setError('');
                }}
                placeholder={searchType === 'dni' ? 'Ej: 12345678' : 'Ej: usuario@example.com'}
                className="input-field pl-10"
                disabled={isLoading}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="p-3 bg-destructive/20 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Información de ayuda */}
          <div className="p-3 bg-accent/20 border border-accent rounded-lg">
            <p className="text-xs text-accent">
              <strong>Tip:</strong> Asegúrate de ingresar {searchType === 'dni' ? 'el DNI correcto' : 'el correo válido'} del cliente.
            </p>
          </div>
        </form>

        {/* Footer del modal */}
        <div className="flex gap-3 p-6 border-t border-border bg-secondary/50 rounded-b-2xl">
          <button
            onClick={handleGoBack}
            className="btn-secondary flex-1"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={(e) => handleSearch(e as any)}
            disabled={isLoading || !searchValue.trim()}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
