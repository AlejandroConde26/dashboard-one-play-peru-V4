import { useAuth, UserData } from '@/contexts/AuthContext';
import { ArrowLeft, User, Mail, FileText, ChevronRight } from 'lucide-react';

export default function UserListScreen() {
    const { usersList, setStep, setUserData, userRole } = useAuth();
    const isClient = userRole === 'client';

    const handleGoBack = () => {
        setStep('search');
    };

    const handleSelectUser = (user: UserData) => {
        setUserData(user);
        setStep('user-info');
    };

    const getFullName = (user: UserData) => {
        return [user.nombres, user.paterno, user.materno].filter(Boolean).join(' ');
    };

    if (!usersList || usersList.length === 0) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-center">
                    <p className="text-foreground">No hay usuarios para mostrar.</p>
                    <button onClick={handleGoBack} className="mt-4 btn-primary">Volver</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full my-4 sm:my-8 border border-border flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className={`flex items-center justify-between p-4 sm:p-6 border-b border-border shrink-0 ${isClient ? 'bg-gradient-to-r from-accent/10 to-cyan-500/10' : 'bg-gradient-to-r from-primary/10 to-accent/10'}`}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleGoBack}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">
                                {isClient ? 'Tus Cuentas' : 'Múltiples Resultados'}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {isClient
                                    ? `Se encontraron ${usersList.length} cuentas — selecciona la que deseas ver`
                                    : 'Se encontraron varios usuarios. Selecciona uno para ver sus detalles.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
                    <div className="grid grid-cols-1 gap-3">
                        {usersList.map((user, index) => (
                            <button
                                key={user.id || index}
                                onClick={() => handleSelectUser(user)}
                                className="w-full text-left p-4 bg-secondary/30 hover:bg-secondary/70 border border-border rounded-xl transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full transition-colors mt-1 ${isClient
                                            ? 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white'
                                            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                                        }`}>
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground text-lg mb-1">{getFullName(user)}</h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                <span>{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FileText className="h-4 w-4" />
                                                <span>DNI: {user.rut}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-4" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-4 sm:p-6 border-t border-border bg-secondary/50 rounded-b-2xl shrink-0">
                    <button
                        onClick={handleGoBack}
                        className="btn-secondary w-full"
                    >
                        {isClient ? 'Buscar de nuevo' : 'Volver a Buscar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
