import React, { createContext, useContext, useState } from 'react';

export type FlowStep = 'login' | 'dashboard' | 'search' | 'loading' | 'success' | 'user-info';

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
  parental_lock: string;
  limit_movil: number;
}

interface AuthContextType {
  currentStep: FlowStep;
  isAuthenticated: boolean;
  username: string;
  clientDni: string;
  clientEmail: string;
  generatedPassword: string;
  userData: UserData | null;
  setStep: (step: FlowStep) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
  setSearchData: (dni: string, email: string) => void;
  setGeneratedPassword: (password: string) => void;
  setUserData: (data: UserData | null) => void;
  setSearchDataFromUserData: (userData: UserData) => void;
  resetFlow: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [clientDni, setClientDni] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [userData, setUserDataState] = useState<UserData | null>(null);

  const login = (user: string, _password: string) => {
    setUsername(user);
    setIsAuthenticated(true);
    setCurrentStep('dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentStep('login');
    setUsername('');
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

  const resetFlow = () => {
    setCurrentStep('dashboard');
    setClientDni('');
    setClientEmail('');
    setGeneratedPassword('');
    setUserDataState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentStep,
        isAuthenticated,
        username,
        clientDni,
        clientEmail,
        generatedPassword,
        userData,
        setStep: setCurrentStep,
        login,
        logout,
        setSearchData,
        setGeneratedPassword: handleSetGeneratedPassword,
        setUserData,
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
