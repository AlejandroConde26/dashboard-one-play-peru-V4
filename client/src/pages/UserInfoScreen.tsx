import { useAuth, UserData } from '@/contexts/AuthContext';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, Lock, AlertCircle } from 'lucide-react';

/**
 * Pantalla de Información del Usuario
 * Muestra todos los datos del usuario obtenidos de la API
 * Permite generar contraseña o volver atrás
 */
export default function UserInfoScreen() {
  const { userData, setStep, setSearchDataFromUserData } = useAuth();

  if (!userData) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground">No hay datos de usuario disponibles</p>
        </div>
      </div>
    );
  }

  const handleGeneratePassword = () => {
    setSearchDataFromUserData(userData);
    setStep('loading');
  };

  const handleGoBack = () => {
    setStep('dashboard');
  };

  const getFullName = (user: UserData) => {
    return user.email;
  };

  const getStatus = (estado: number) => {
    return estado === 1 ? 'Activo' : 'Inactivo';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      {/* Modal */}
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <h2 className="text-2xl font-bold text-foreground">Información del Cliente</h2>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Email destacado */}
          <div className="p-4 bg-primary/10 border border-primary rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Correo Electrónico</p>
            <p className="text-2xl font-bold text-foreground">{getFullName(userData)}</p>
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">Email</p>
              </div>
              <p className="text-foreground font-medium break-all">{userData.email}</p>
            </div>

            {/* Teléfono */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">Teléfono</p>
              </div>
              <p className="text-foreground font-medium">{userData.telefono}</p>
            </div>

            {/* DNI/RUT */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">DNI/RUT</p>
              </div>
              <p className="text-foreground font-medium">{userData.rut}</p>
            </div>

            {/* Dirección */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">Dirección</p>
              </div>
              <p className="text-foreground font-medium">{userData.direccion}</p>
            </div>

            {/* Fecha de Nacimiento */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
              </div>
              <p className="text-foreground font-medium">{formatDate(userData.nacimiento)}</p>
            </div>

            {/* Estado */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">Estado</p>
              </div>
              <p className={`text-foreground font-medium ${userData.estado === 1 ? 'text-primary' : 'text-destructive'}`}>
                {getStatus(userData.estado)}
              </p>
            </div>

            {/* Límite Móvil */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">Dispositivos Permitidos</p>
              </div>
              <p className="text-foreground font-medium">{userData.limit_movil}</p>
            </div>

            {/* Fecha de Registro */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">Fecha de Registro</p>
              </div>
              <p className="text-foreground font-medium text-sm">{formatDate(userData.created_at)}</p>
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border bg-secondary/50 rounded-b-2xl">
          <button
            onClick={handleGoBack}
            className="btn-secondary flex-1"
          >
            Volver
          </button>
          <button
            onClick={handleGeneratePassword}
            className="btn-primary flex-1"
          >
            Generar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
}
