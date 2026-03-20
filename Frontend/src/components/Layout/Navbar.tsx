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
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <h1 className="text-lg font-semibold text-gray-800">
        Sistema Clínico
      </h1>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          {user?.fullName} ({user?.role})
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
        >
          Salir
        </button>
      </div>
    </header>
  );
}