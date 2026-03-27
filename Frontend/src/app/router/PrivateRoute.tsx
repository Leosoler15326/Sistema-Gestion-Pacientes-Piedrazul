import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { APP_ROUTES } from './routes';
import { authStore } from '../../modules/auth/store/auth.store';

export default function PrivateRoute() {
  const location = useLocation();
  const isAuthenticated = authStore.isAuthenticated();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={APP_ROUTES.LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}