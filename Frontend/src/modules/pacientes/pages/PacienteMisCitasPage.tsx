import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import InlineMessage from '../../../components/common/InlineMessage';
import Loader from '../../../components/common/Loader';
import { APP_ROUTES } from '../../../app/router/routes';
import { ESPECIALIDAD_LABEL, TIPO_ATENCION_LABEL } from '../../../constants/enums';
import { useMisCitasPaciente } from '../../citas/hooks/UseCitas';

const ESTADOS_PENDIENTES = ['PROGRAMADA', 'CONFIRMADA', 'REAGENDADA'];

const ESTADO_LABEL: Record<string, string> = {
  PROGRAMADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
  REAGENDADA: 'Reagendada',
  ATENDIDA: 'Atendida',
  COMPLETADA: 'Atendida',
  NO_ASISTIO: 'No asististe',
};

const ESTADO_COLOR: Record<string, string> = {
  PROGRAMADA: 'bg-blue-100 text-blue-800',
  CONFIRMADA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800',
  REAGENDADA: 'bg-amber-100 text-amber-800',
  ATENDIDA: 'bg-slate-100 text-slate-700',
  COMPLETADA: 'bg-slate-100 text-slate-700',
  NO_ASISTIO: 'bg-red-50 text-red-700',
};

function formatearFecha(fechaHora: string): string {
  try {
    const d = new Date(fechaHora);
    return d.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return fechaHora;
  }
}

export default function PacienteMisCitasPage() {
  const location = useLocation();
  const successMessage = (location.state as { successMessage?: string } | null)
    ?.successMessage;
  const { data, isLoading, isError } = useMisCitasPaciente();

  if (isLoading) {
    return <Loader message="Cargando tus citas..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <InlineMessage type="error" message="No fue posible cargar tus citas. Intenta de nuevo." />
      </div>
    );
  }

  const citasPendientes = data?.filter((c) => ESTADOS_PENDIENTES.includes(c.estado)) ?? [];
  const citasHistorial = data?.filter((c) => !ESTADOS_PENDIENTES.includes(c.estado)) ?? [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Mis citas"
        subtitle="Aquí puedes ver tu cita pendiente y el historial de citas anteriores."
        actions={
          citasPendientes.length === 0 ? (
            <Link
              to={APP_ROUTES.PACIENTE_AGENDAR}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium"
            >
              Agendar nueva cita
            </Link>
          ) : undefined
        }
      />

      {successMessage && (
        <div className="mb-4">
          <InlineMessage type="success" message={successMessage} />
        </div>
      )}

      {!data?.length ? (
        <EmptyState
          title="Aún no tienes citas"
          description="Puedes agendar tu primera cita usando el botón de abajo."
        />
      ) : (
        <div className="space-y-5">
          {citasPendientes.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Tu cita pendiente
              </h2>
              {citasPendientes.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-slate-800">
                        {formatearFecha(c.fechaHora)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Profesional: <strong>{c.profesionalNombre}</strong>
                      </p>
                      {c.especialidad && (
                        <p className="text-sm text-slate-600">
                          Especialidad: {ESPECIALIDAD_LABEL[c.especialidad] ?? c.especialidad}
                        </p>
                      )}
                      <p className="text-sm text-slate-600">
                        Tipo: {TIPO_ATENCION_LABEL[c.tipoAtencion] ?? c.tipoAtencion}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        ESTADO_COLOR[c.estado] ?? 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ESTADO_LABEL[c.estado] ?? c.estado}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Link
                      to={`/citas/${c.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              ))}
            </section>
          )}

          {citasHistorial.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Historial de citas
              </h2>
              <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Fecha y hora</th>
                      <th className="px-4 py-3">Profesional</th>
                      <th className="hidden px-4 py-3 sm:table-cell">Tipo</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {citasHistorial.map((c) => (
                      <tr key={c.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-slate-700">{formatearFecha(c.fechaHora)}</td>
                        <td className="px-4 py-3 text-slate-700">{c.profesionalNombre}</td>
                        <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                          {TIPO_ATENCION_LABEL[c.tipoAtencion] ?? c.tipoAtencion}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              ESTADO_COLOR[c.estado] ?? 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {ESTADO_LABEL[c.estado] ?? c.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/citas/${c.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Detalle
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {citasPendientes.length === 0 && (
            <div className="pt-2">
              <Link
                to={APP_ROUTES.PACIENTE_AGENDAR}
                className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Agendar nueva cita
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
