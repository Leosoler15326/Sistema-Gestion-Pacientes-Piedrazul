import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import InlineMessage from '../../../components/common/InlineMessage';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import BackButton from '../../../components/common/BackButton';
import { APP_ROUTES } from '../../../app/router/routes';
import { useCitaDetail, useCambiarEstadoCita } from '../hooks/UseCitas';
import { useAuth } from '../../auth/hooks/useAuth';
import { ESPECIALIDAD_LABEL, TIPO_ATENCION_LABEL } from '../../../constants/enums';

function formatFechaHora(value?: string) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
}

const ESTADO_COLOR: Record<string, string> = {
  PROGRAMADA: 'bg-blue-100 text-blue-800',
  ATENDIDA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800',
  REAGENDADA: 'bg-amber-100 text-amber-800',
  NO_ASISTIO: 'bg-slate-100 text-slate-700',
};

const ESTADO_LABEL: Record<string, string> = {
  PROGRAMADA: 'Agendada',
  ATENDIDA: 'Atendida',
  CANCELADA: 'Cancelada',
  REAGENDADA: 'Reagendada',
  NO_ASISTIO: 'No asistió',
};

// Transiciones permitidas por estado actual
const TRANSICIONES: Record<string, { estado: string; label: string; color: string }[]> = {
  PROGRAMADA: [
    { estado: 'ATENDIDA', label: 'Marcar como atendida', color: 'bg-green-600 hover:bg-green-700' },
    { estado: 'NO_ASISTIO', label: 'Paciente no asistió', color: 'bg-slate-500 hover:bg-slate-600' },
  ],
  REAGENDADA: [
    { estado: 'ATENDIDA', label: 'Marcar como atendida', color: 'bg-green-600 hover:bg-green-700' },
    { estado: 'NO_ASISTIO', label: 'Paciente no asistió', color: 'bg-slate-500 hover:bg-slate-600' },
  ],
  ATENDIDA: [],
  CANCELADA: [],
  NO_ASISTIO: [],
};

export default function CitaDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { user } = useAuth();
  const normalizedRole = String(user?.rol ?? '').toUpperCase().replace('ROLE_', '');
  const puedeGestionarHistoria =
    normalizedRole === 'MEDICO_TERAPISTA' || normalizedRole === 'ADMINISTRADOR';
  const puedeCambiarEstado =
    normalizedRole === 'MEDICO_TERAPISTA' || normalizedRole === 'ADMINISTRADOR';

  const { data, isLoading, isError } = useCitaDetail(id);
  const cambiarEstadoMutation = useCambiarEstadoCita();
  const [actionMessage, setActionMessage] = useState('');

  const handleCambiarEstado = async (nuevoEstado: string) => {
    setActionMessage('');
    try {
      await cambiarEstadoMutation.mutateAsync({ id, estado: nuevoEstado });
      setActionMessage(`Estado actualizado a "${ESTADO_LABEL[nuevoEstado] ?? nuevoEstado}".`);
    } catch {
      setActionMessage('No fue posible cambiar el estado. Intenta de nuevo.');
    }
  };

  if (isLoading) return <Loader message="Cargando detalle de la cita..." />;

  if (isError || !data) {
    return (
      <EmptyState
        title="No se encontró la cita"
        description="No fue posible obtener el detalle solicitado."
      />
    );
  }

  const transicionesDisponibles = TRANSICIONES[data.estado] ?? [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title={`Cita #${data.id}`}
        subtitle="Detalle y gestión de la cita"
        actions={
          <div className="flex flex-wrap gap-2">
            <BackButton />
            {puedeGestionarHistoria && (
              <>
                <Link
                  to={`${APP_ROUTES.HISTORIA_CLINICA_NUEVA}?citaId=${data.id}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
                >
                  Crear historia clínica
                </Link>
                <Link
                  to={APP_ROUTES.HISTORIA_CLINICA_DETALLE.replace(':id', String(data.id))}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white"
                >
                  Ver historia clínica
                </Link>
              </>
            )}
          </div>
        }
      />

      {actionMessage && (
        <div className="mb-4">
          <InlineMessage
            type={actionMessage.includes('posible') ? 'error' : 'success'}
            message={actionMessage}
          />
        </div>
      )}

      <div className="max-w-2xl space-y-4">
        {/* Datos de la cita */}
        <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold text-slate-800">Información de la cita</h2>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                ESTADO_COLOR[data.estado] ?? 'bg-slate-100 text-slate-700'
              }`}
            >
              {ESTADO_LABEL[data.estado] ?? data.estado}
            </span>
          </div>

          <p className="text-sm text-slate-700">
            <span className="font-medium">Fecha y hora:</span>{' '}
            {formatFechaHora(data.fechaHora)}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Tipo de atención:</span>{' '}
            {TIPO_ATENCION_LABEL[data.tipoAtencion] ?? data.tipoAtencion}
          </p>
          {data.motivoConsulta && (
            <p className="text-sm text-slate-700">
              <span className="font-medium">Motivo:</span> {data.motivoConsulta}
            </p>
          )}
        </div>

        {/* Paciente y profesional */}
        <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-base font-semibold text-slate-800">Personas</h2>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Paciente:</span> {data.pacienteNombre}
            {data.pacienteDocumento && (
              <span className="ml-2 text-slate-500">· Cédula: {data.pacienteDocumento}</span>
            )}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Profesional:</span> {data.profesionalNombre}
            {data.especialidad && (
              <span className="ml-2 text-slate-500">
                · {ESPECIALIDAD_LABEL[data.especialidad] ?? data.especialidad}
              </span>
            )}
          </p>
        </div>

        {/* Cambiar estado — solo médico/admin, solo si hay transiciones disponibles */}
        {puedeCambiarEstado && transicionesDisponibles.length > 0 && (
          <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-base font-semibold text-slate-800">Actualizar estado</h2>
            <p className="text-xs text-slate-500">
              Registra el resultado de esta cita. Esta acción queda guardada en el sistema.
            </p>
            <div className="flex flex-wrap gap-2">
              {transicionesDisponibles.map((t) => (
                <button
                  key={t.estado}
                  type="button"
                  onClick={() => handleCambiarEstado(t.estado)}
                  disabled={cambiarEstadoMutation.isPending}
                  className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60 ${t.color}`}
                >
                  {cambiarEstadoMutation.isPending ? 'Guardando...' : t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
