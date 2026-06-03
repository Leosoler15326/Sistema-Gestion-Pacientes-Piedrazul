import { NavLink } from 'react-router-dom';
import { APP_ROUTES } from '../../app/router/routes';
import { authStore } from '../../modules/auth/store/auth.store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const user = authStore.getUser();

  const normalizedRole = String(user?.rol ?? '')
    .toUpperCase()
    .replace('ROLE_', '');

  const esAdmin = normalizedRole === 'ADMINISTRADOR';
  const esAgendador = normalizedRole === 'AGENDADOR';
  const esPaciente = normalizedRole === 'PACIENTE';

  const puedeVerHistoria =
    normalizedRole === 'ADMINISTRADOR' ||
    normalizedRole === 'MEDICO_TERAPISTA';

  const puedeVerPersonal =
    normalizedRole === 'ADMINISTRADOR' ||
    normalizedRole === 'AGENDADOR';

  const puedeVerPacientesCrud =
    normalizedRole === 'ADMINISTRADOR' ||
    normalizedRole === 'AGENDADOR' ||
    normalizedRole === 'MEDICO_TERAPISTA';

  const getLinkClass = (isActive: boolean) =>
    [
      'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition',
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-700 hover:bg-slate-100',
    ].join(' ');

  return (
    <aside
      className={[
        'flex-col border-r border-slate-200 bg-white',
        'lg:relative lg:flex lg:w-72',
        isOpen
          ? 'fixed inset-y-0 left-0 z-30 w-72 flex'
          : 'hidden lg:flex',
      ].join(' ')}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
            PA
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Piedra Azul</h1>
            <p className="text-xs text-slate-500">Sistema clínico</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Cerrar menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="border-b border-slate-200 px-6 py-4">
        <p className="text-sm font-medium text-slate-800">
          {user?.nombreCompleto ?? 'Usuario'}
        </p>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {user?.rol ?? 'Sin rol'}
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-4">
        <NavLink
          to={APP_ROUTES.HOME}
          onClick={onClose}
          className={({ isActive }) => getLinkClass(isActive)}
        >
          Dashboard
        </NavLink>

        {puedeVerPacientesCrud && (
          <NavLink
            to={APP_ROUTES.PACIENTES}
            onClick={onClose}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            Pacientes
          </NavLink>
        )}

        {esPaciente ? (
          <>
            <NavLink
              to={APP_ROUTES.PACIENTE_COMPLETAR_PERFIL}
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              Mi ficha
            </NavLink>
            <NavLink
              to={APP_ROUTES.PACIENTE_AGENDAR}
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              Agendar cita
            </NavLink>
            <NavLink
              to={APP_ROUTES.PACIENTE_MIS_CITAS}
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              Mis citas
            </NavLink>
          </>
        ) : (
          <NavLink
            to={APP_ROUTES.CITAS}
            onClick={onClose}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            Citas
          </NavLink>
        )}

        {puedeVerHistoria && (
          <NavLink
            to={APP_ROUTES.HISTORIA_CLINICA}
            onClick={onClose}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            Historia clínica
          </NavLink>
        )}

        {puedeVerPersonal && (
          <NavLink
            to={APP_ROUTES.PROFESIONALES}
            onClick={onClose}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            Personal
          </NavLink>
        )}

        {(esAdmin || esAgendador) && (
          <NavLink
            to={APP_ROUTES.CITAS_AGENDAR_CONTACTO}
            onClick={onClose}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            Agendar contacto
          </NavLink>
        )}

        {esAdmin && (
          <>
            <NavLink
              to={APP_ROUTES.CONFIG_AGENDAMIENTO}
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              Config. agendamiento
            </NavLink>
            <NavLink
              to={APP_ROUTES.USUARIOS}
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              Usuarios
            </NavLink>
          </>
        )}
      </nav>

      <div className="px-4 pb-4">
        <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
          Clínica Piedra Azul · Plataforma interna
        </div>
      </div>
    </aside>
  );
}
