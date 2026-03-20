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

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  return <Outlet />;
}