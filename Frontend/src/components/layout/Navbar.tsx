import { useNavigate } from 'react-router-dom';
import { authStore } from '../../modules/auth/store/auth.store';

export default function Navbar() {
  const navigate = useNavigate();
  const user = authStore.getUser();

  const handleLogout = () => {
    authStore.clearSession();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Panel de gestión</h2>
        <p className="text-sm text-slate-500">
          Bienvenido, {user?.nombreCompleto ?? 'usuario'}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Cerrar sesión
      </button>
    </header>
  );
}