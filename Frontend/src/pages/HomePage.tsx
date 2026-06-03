import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import PageHeader from '../components/common/PageHeader';
import { APP_ROUTES } from '../app/router/routes';
import { useAuth } from '../modules/auth/hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();
  const normalizedRole = String(user?.rol ?? '')
    .toUpperCase()
    .replace('ROLE_', '');
  const esPaciente = normalizedRole === 'PACIENTE';
  const puedePacientes =
    normalizedRole === 'ADMINISTRADOR' ||
    normalizedRole === 'AGENDADOR' ||
    normalizedRole === 'MEDICO_TERAPISTA';
  const puedeHistoria =
    normalizedRole === 'ADMINISTRADOR' || normalizedRole === 'MEDICO_TERAPISTA';
  const puedePersonal =
    normalizedRole === 'ADMINISTRADOR' || normalizedRole === 'AGENDADOR';

  const esAdmin = normalizedRole === 'ADMINISTRADOR';
  const [status, setStatus] = useState('Conectando...');

  useEffect(() => {
    if (!esAdmin) return;
    api
      .get('/health')
      .then((res) => {
        const backendMessage =
          res.data?.message ?? `Estado: ${res.data?.status ?? 'OK'}`;
        setStatus(backendMessage);
      })
      .catch(() => {
        setStatus('Error de conexión');
      });
  }, [esAdmin]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Panel principal"
        subtitle="Resumen general del sistema Clínica Piedra Azul"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {esPaciente ? (
          <>
            <Link
              to={APP_ROUTES.PACIENTE_COMPLETAR_PERFIL}
              className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1"
            >
              <h2 className="text-lg font-semibold text-slate-800">Mi ficha</h2>
              <p className="mt-2 text-sm text-slate-500">
                Completa o revisa tus datos de paciente.
              </p>
            </Link>
            <Link
              to={APP_ROUTES.PACIENTE_AGENDAR}
              className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1"
            >
              <h2 className="text-lg font-semibold text-slate-800">Agendar cita</h2>
              <p className="mt-2 text-sm text-slate-500">
                Elige profesional y horario disponible.
              </p>
            </Link>
            <Link
              to={APP_ROUTES.PACIENTE_MIS_CITAS}
              className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1"
            >
              <h2 className="text-lg font-semibold text-slate-800">Mis citas</h2>
              <p className="mt-2 text-sm text-slate-500">
                Consulta tus citas programadas.
              </p>
            </Link>
          </>
        ) : (
          <>
            {puedePacientes && (
              <Link
                to={APP_ROUTES.PACIENTES}
                className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1"
              >
                <h2 className="text-lg font-semibold text-slate-800">Pacientes</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Consulta, registra y administra pacientes.
                </p>
              </Link>
            )}

            <Link
              to={APP_ROUTES.CITAS}
              className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1"
            >
              <h2 className="text-lg font-semibold text-slate-800">Citas</h2>
              <p className="mt-2 text-sm text-slate-500">
                Agenda, consulta y reorganiza citas.
              </p>
            </Link>

            {puedeHistoria && (
              <Link
                to={APP_ROUTES.HISTORIA_CLINICA}
                className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1"
              >
                <h2 className="text-lg font-semibold text-slate-800">Historia clínica</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Visualiza y registra información clínica.
                </p>
              </Link>
            )}

            {puedePersonal && (
              <Link
                to={APP_ROUTES.PROFESIONALES}
                className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1"
              >
                <h2 className="text-lg font-semibold text-slate-800">Personal</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Gestiona profesionales y disponibilidad laboral.
                </p>
              </Link>
            )}
          </>
        )}
      </div>

      {normalizedRole === 'ADMINISTRADOR' && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-2 text-lg font-semibold text-slate-800">Estado del backend</h2>
          <p className="text-green-600">{status}</p>
        </div>
      )}
    </div>
  );
}