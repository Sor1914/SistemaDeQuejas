import type { ReactNode } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import Forbidden403 from '../../components/Forbidden403';
import type { Permisos } from '../../features/auth/types';

type Props = { permission: keyof Permisos; children: ReactNode };
type RequireAuthProps = { children: ReactNode };


export function RequirePermission({ permission, children }: Props) {
  const { isAuthenticated, permisos } = useAuth();

  if (!isAuthenticated) {
    return <Forbidden403 title="Sesión requerida" message="Debes iniciar sesión para acceder a esta sección." />;
  }
  if (!permisos?.[permission]) {
    return <Forbidden403 message="No tienes permisos para acceder a esta sección." />;
  }
  return <>{children}</>;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Forbidden403
        title="Sesión requerida"
        message="Debes iniciar sesión para acceder a esta sección."
      />
    );
  }
  return <>{children}</>;
}