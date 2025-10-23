import { createContext, useContext,  useMemo, useState } from 'react';
import type {  AuthState, Permisos } from './types';

type AuthContextValue = {
  token: string | null;
  permisos: Permisos | null;
  user: AuthState['user'];            
  isAuthenticated: boolean;
  login: (data: { token: string; permisos: Permisos; user?: { nombre?: string; rol?: string } }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('auth.token');
    const permisos = localStorage.getItem('auth.permisos');
    const user = localStorage.getItem('auth.user');
    return {
      token,
      permisos: permisos ? (JSON.parse(permisos) as Permisos) : null,
      user: user ? JSON.parse(user) : null,
    };
  });

  const login: AuthContextValue['login'] = ({ token, permisos, user }) => {
    localStorage.setItem('auth.token', token);
    localStorage.setItem('auth.permisos', JSON.stringify(permisos));
    if (user) localStorage.setItem('auth.user', JSON.stringify(user));
    setState({ token, permisos, user: user ?? null });
  };

  const logout = () => {
    localStorage.removeItem('auth.token');
    localStorage.removeItem('auth.permisos');
    localStorage.removeItem('auth.user');
    setState({ token: null, permisos: null, user: null });
  };

  const value = useMemo<AuthContextValue>(() => ({
    token: state.token,
    permisos: state.permisos,
    user: state.user,                                 // ← añade esto
    isAuthenticated: !!state.token,
    login,
    logout,
  }), [state.token, state.permisos, state.user]);      // ← incluye user

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}



