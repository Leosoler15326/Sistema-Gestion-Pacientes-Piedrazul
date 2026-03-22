import { NavLink } from 'react-router-dom';
import { APP_ROUTES } from '../../app/router/routes';
import { authStore } from '../../modules/auth/store/auth.store';

export default function Sidebar() {
  const user = authStore.getUser();

  const linkClass =
    'block rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-100';

  const activeClass = 'bg-blue-600 text-white';

  const normalizedRole = String(user?.rol ?? '')
    .toUpperCase()
    .replace('ROLE_', '');

  const esAdmin = normalizedRole === 'ADMIN' || normalizedRole === 'ADMINISTRADOR';

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6 text-xl font-bold text-blue-600">
        Piedra Azul
      </div>

      <nav className="space-y-2 px-4">
        <NavLink
          to={APP_ROUTES.HOME}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : 'text-gray-700'}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to={APP_ROUTES.CITAS}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : 'text-gray-700'}`
          }
        >
          Citas
        </NavLink>

        <NavLink
          to={APP_ROUTES.HISTORIA_CLINICA}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : 'text-gray-700'}`
          }
        >
          Historia Clínica
        </NavLink>

        {esAdmin && (
          <NavLink
            to={APP_ROUTES.PROFESIONALES}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : 'text-gray-700'}`
            }
          >
            Personal
          </NavLink>
        )}

        <NavLink
          to={APP_ROUTES.USUARIOS}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : 'text-gray-700'}`
          }
        >
          Usuarios
        </NavLink>
      </nav>
    </aside>
  );
}