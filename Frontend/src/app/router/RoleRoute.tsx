import { Navigate, Outlet } from 'react-router-dom';
import { APP_ROUTES } from './routes';
import { authStore } from '../../modules/auth/store/auth.store';
import type { UserRole } from '../../modules/auth/types/auth.types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const isAuthenticated = authStore.isAuthenticated();
  const user = authStore.getUser();

  if (!isAuthenticated || !user) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  const normalizedRole = String(user.rol).toUpperCase().replace('ROLE_', '');
  const normalizedAllowedRoles = allowedRoles.map((role) =>
    String(role).toUpperCase().replace('ROLE_', '')
  );

  
  const hasAccess = normalizedAllowedRoles.includes(normalizedRole);

  if (!hasAccess) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  return <Outlet />;
}