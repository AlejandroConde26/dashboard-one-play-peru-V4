import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'client';
export type FlowStep = 'login' | 'dashboard' | 'search' | 'loading' | 'success' | 'user-info' | 'user-list';

export interface UserData {
  id: number;
  email: string;
  nombres: string;
  paterno: string;
  materno: string;
  estado: number;
  direccion: string;
  nacimiento: string;
  rut: string;
  telefono: string;
  created_at: string;
  updated_at: string;
  co_id: number;
  rg_id: number;
  gd_id: number;
  role_id: number;
  sexo: string;
  parental_lock: string;
  limit_movil: number;
}

// ─── Mock de usuarios para maqueta ───────────────────────────────────────────
export interface MockUser {
  username: string;
  password: string;
  role: UserRole;
  /** Solo para clientes: sus datos precargados */
  profile?: Partial<UserData>;
}

export const MOCK_USERS: MockUser[] = [
  {
    username: 'admin',
    password: '1234',
    role: 'admin',
  },
  {
    username: 'cliente1',
    password: 'cliente123',
    role: 'client',
    // Sin perfil pre-cargado: el cliente busca su cuenta por DNI o correo
  },
];
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextType {
  currentStep: FlowStep;
  isAuthenticated: boolean;
  username: string;
  userRole: UserRole;
  clientDni: string;
  clientEmail: string;
  generatedPassword: string;
  userData: UserData | null;
  usersList: UserData[];
  setStep: (step: FlowStep) => void;
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  setSearchData: (dni: string, email: string) => void;
  setGeneratedPassword: (password: string) => void;
  setUserData: (data: UserData | null) => void;
  setUsersList: (data: UserData[]) => void;
  setSearchDataFromUserData: (userData: UserData) => void;
  resetFlow: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [clientDni, setClientDni] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [usersList, setUsersListState] = useState<UserData[]>([]);

  const login = (user: string, password: string): { success: boolean; message?: string } => {
    const found = MOCK_USERS.find(
      (u) => u.username === user && u.password === password
    );

    if (!found) {
      return { success: false, message: 'Usuario o contraseña incorrectos' };
    }

    setUsername(found.username);
    setUserRole(found.role);
    setIsAuthenticated(true);
    setCurrentStep('dashboard');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentStep('login');
    setUsername('');
    setUserRole('admin');
    setUserDataState(null);
    setUsersListState([]);
  };

  const setSearchData = (dni: string, email: string) => {
    setClientDni(dni);
    setClientEmail(email);
  };

  const setSearchDataFromUserData = (userData: UserData) => {
    setClientDni(userData.rut);
    setClientEmail(userData.email);
  };

  const handleSetGeneratedPassword = (password: string) => {
    setGeneratedPassword(password);
  };

  const setUserData = (data: UserData | null) => {
    setUserDataState(data);
  };

  const setUsersList = (data: UserData[]) => {
    setUsersListState(data);
  };

  const resetFlow = () => {
    setCurrentStep('dashboard');
    setClientDni('');
    setClientEmail('');
    setGeneratedPassword('');
    setUserDataState(null);
    setUsersListState([]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentStep,
        isAuthenticated,
        username,
        userRole,
        clientDni,
        clientEmail,
        generatedPassword,
        userData,
        usersList,
        setStep: setCurrentStep,
        login,
        logout,
        setSearchData,
        setGeneratedPassword: handleSetGeneratedPassword,
        setUserData,
        setUsersList,
        setSearchDataFromUserData,
        resetFlow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
