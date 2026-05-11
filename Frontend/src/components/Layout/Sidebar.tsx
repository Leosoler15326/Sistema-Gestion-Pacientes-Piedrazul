import { NavLink } from 'react-router-dom';
import { APP_ROUTES } from '../../app/router/routes';
import { authStore } from '../../modules/auth/store/auth.store';

export default function Sidebar() {
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
    <aside className="flex min-h-screen w-72 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
            PA
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Piedra Azul</h1>
            <p className="text-xs text-slate-500">Sistema clínico</p>
          </div>
        </div>
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
          className={({ isActive }) => getLinkClass(isActive)}
        >
          Dashboard
        </NavLink>

        {puedeVerPacientesCrud && (
          <NavLink
            to={APP_ROUTES.PACIENTES}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            Pacientes
          </NavLink>
        )}

        {esPaciente ? (
          <>
            <NavLink
              to={APP_ROUTES.PACIENTE_COMPLETAR_PERFIL}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              Mi ficha
            </NavLink>
            <NavLink
              to={APP_ROUTES.PACIENTE_AGENDAR}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              Agendar cita
            </NavLink>
            <NavLink
              to={APP_ROUTES.PACIENTE_MIS_CITAS}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              Mis citas
            </NavLink>
          </>
        ) : (
          <NavLink
            to={APP_ROUTES.CITAS}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            Citas
          </NavLink>
        )}

        {puedeVerHistoria && (
          <NavLink
            to={APP_ROUTES.HISTORIA_CLINICA}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            Historia clínica
          </NavLink>
        )}

        {puedeVerPersonal && (
          <NavLink
            to={APP_ROUTES.PROFESIONALES}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            Personal
          </NavLink>
        )}

        {(esAdmin || esAgendador) && (
          <NavLink
            to={APP_ROUTES.CITAS_AGENDAR_CONTACTO}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            Agendar contacto
          </NavLink>
        )}

        {esAdmin && (
          <>
            <NavLink
              to={APP_ROUTES.CONFIG_AGENDAMIENTO}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              Config. agendamiento
            </NavLink>
            <NavLink
              to={APP_ROUTES.USUARIOS}
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