import { Link, useNavigate } from 'react-router-dom';
import { authStore } from '../../modules/auth/store/auth.store';
import { APP_ROUTES } from '../../app/router/routes';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const navigate = useNavigate();
  const user = authStore.getUser();

  const handleLogout = () => {
    authStore.clearSession();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-6 lg:py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h2 className="text-base font-semibold text-slate-800 lg:text-lg">Panel de gestión</h2>
          <p className="text-xs text-slate-500 lg:text-sm">
            Bienvenido, {user?.nombreCompleto ?? 'usuario'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={APP_ROUTES.CAMBIAR_CONTRASENA}
          className="hidden rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:block lg:px-4"
        >
          <span className="hidden lg:inline">Cambiar contraseña</span>
          <span className="lg:hidden">Contraseña</span>
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 lg:px-4"
        >
          <span className="hidden sm:inline">Cerrar sesión</span>
          <span className="sm:hidden">Salir</span>
        </button>
      </div>
    </header>
  );
}
