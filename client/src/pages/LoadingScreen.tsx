import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';

/**
 * Pantalla 4: Pantalla de Carga - One Play Perú
 * Diseño: Pantalla de espera con animación y colores corporativos
 */
export default function LoadingScreen() {
  const { setStep, setGeneratedPassword } = useAuth();
  const { generatePassword } = usePasswordGenerator();

  useEffect(() => {
    // Simular tiempo de procesamiento
    const timer = setTimeout(() => {
      // Generar contraseña segura
      const newPassword = generatePassword(16);
      setGeneratedPassword(newPassword);
      
      // Transicionar a pantalla de éxito
      setStep('success');
    }, 2500);

    return () => clearTimeout(timer);
  }, [setStep, setGeneratedPassword, generatePassword]);

  return (
    <div className="fixed inset-0 bg-gradient-dark flex items-center justify-center z-50">
      {/* Contenedor de carga */}
      <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
        {/* Spinner personalizado con colores One Play */}
        <div className="relative w-24 h-24">
          {/* Círculo exterior animado */}
          <div className="absolute inset-0 rounded-full border-4 border-secondary"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent animate-spin"></div>

          {/* Icono en el centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Texto de estado */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Generando nueva contraseña...</h2>
          <p className="text-muted-foreground text-sm">Por favor espere mientras procesamos su solicitud</p>
        </div>

        {/* Indicador de progreso con puntos animados */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Esto puede tomar unos segundos...
          </p>
        </div>
      </div>
    </div>
  );
}
