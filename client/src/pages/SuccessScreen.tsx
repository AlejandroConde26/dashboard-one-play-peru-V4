import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Eye, EyeOff, Loader2, Check } from 'lucide-react';

/**
 * Pantalla 5: Resultado Exitoso - One Play Perú
 * Diseño: Tarjeta de éxito con colores corporativos
 * Guarda la contraseña generada en la base de datos via POST
 */
export default function SuccessScreen() {
  const { resetFlow, username, clientEmail, clientDni, generatedPassword } = useAuth();
  const [password, setPassword] = useState(generatedPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);

      // Resetear el estado después de 2 segundos
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    setSaveError('');

    try {
      // Enviar POST a n8n con DNI y contraseña generada
      const response = await fetch('http://191.98.169.6:5678/webhook/update_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': '7K9P2MX8V3QRTW6ZY4ACB5EJ0FL1NG',
        },
        body: JSON.stringify({
          dni: clientDni,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Mostrar mensaje de éxito por 2 segundos antes de resetear
      setSaveSuccess(true);
      setTimeout(() => {
        resetFlow();
      }, 2000);
    } catch (err) {
      setSaveError(`Error al guardar: ${err instanceof Error ? err.message : 'Intenta de nuevo.'}`);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-dark flex items-center justify-center p-4 z-50">
      {/* Contenedor de éxito */}
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Tarjeta de éxito */}
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-primary to-green-600 px-6 py-8 flex flex-col items-center space-y-4">
          </div>

          {/* Contenido */}
          <div className="px-6 py-8 space-y-6">
            {/* Información del cliente */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Correo del Cliente
                </label>
                <div className="bg-secondary rounded-lg px-4 py-3 border border-border">
                  <p className="text-foreground font-medium">{clientEmail}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  DNI
                </label>
                <div className="bg-secondary rounded-lg px-4 py-3 border border-border">
                  <p className="text-foreground font-medium">{clientDni}</p>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="h-px bg-border"></div>

            {/* Contraseña generada */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-secondary border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                  title={showPassword ? 'Ocultar' : 'Mostrar'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Información de seguridad */}
            <div className="p-4 bg-accent/20 border border-accent rounded-lg">
              <p className="text-xs text-accent">
                <strong>Seguridad:</strong> Esta contraseña contiene mayúsculas, minúsculas, números y símbolos especiales para máxima seguridad.
              </p>
            </div>

            {/* Mensaje de error si existe */}
            {saveError && (
              <div className="p-3 bg-destructive/20 border border-destructive rounded-lg">
                <p className="text-xs text-destructive">{saveError}</p>
              </div>
            )}

            {/* Mensaje de éxito */}
            {saveSuccess && (
              <div className="p-4 bg-primary/20 border border-primary rounded-lg flex items-center gap-3 justify-center">
                <Check className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium text-primary">¡Guardado correctamente!</p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCopyPassword}
                disabled={isSaving}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 border ${
                  copied
                    ? 'bg-primary/20 text-primary border-primary'
                    : 'bg-secondary text-foreground border-border hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>

              <button
                onClick={handleFinish}
                disabled={isSaving || saveSuccess}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Guardado
                  </>
                ) : (
                  'Guardar'
                )}
              </button>
            </div>
          </div>

          {/* Pie de página */}
          <div className="px-6 py-4 bg-secondary border-t border-border text-center rounded-b-2xl">
            <p className="text-xs text-muted-foreground">
              Guarde esta contraseña en un lugar seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
