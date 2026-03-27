import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import BackButton from '../../../components/common/BackButton';
import { APP_ROUTES } from '../../../app/router/routes';
import { useCitaDetail } from '../hooks/UseCitas';
import { useAuth } from '../../auth/hooks/useAuth';

function formatFechaHora(value?: string) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function CitaDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { user } = useAuth();

  const normalizedRole = String(user?.rol ?? '').toUpperCase().replace('ROLE_', '');
  const puedeGestionarHistoria =
    normalizedRole === 'MEDICO_TERAPISTA' || normalizedRole === 'ADMINISTRADOR';

  const { data, isLoading, isError } = useCitaDetail(id);

  if (isLoading) return <Loader message="Cargando detalle de la cita..." />;

  if (isError || !data) {
    return (
      <EmptyState
        title="No se encontró la cita"
        description="No fue posible obtener el detalle solicitado."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title={`Cita #${data.id}`}
        subtitle="Detalle de la cita seleccionada"
        actions={
          <div className="flex gap-2">
            <BackButton />

            {puedeGestionarHistoria && (
              <>
                <Link
                  to={`${APP_ROUTES.HISTORIA_CLINICA_NUEVA}?citaId=${data.id}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                  Crear historia clínica
                </Link>

                <Link
                  to={APP_ROUTES.HISTORIA_CLINICA_DETALLE.replace(':id', String(data.id))}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-white"
                >
                  Ver historia clínica
                </Link>
              </>
            )}
          </div>
        }
      />

      <div className="space-y-4 rounded-xl bg-white p-6 shadow">
        <p><strong>Fecha y hora:</strong> {formatFechaHora(data.fechaHora)}</p>
        <p><strong>Tipo de atención:</strong> {data.tipoAtencion}</p>
        <p><strong>Motivo:</strong> {data.motivoConsulta || 'Sin motivo'}</p>
        <p><strong>Estado:</strong> {data.estado || 'N/A'}</p>

        <hr />

        <p><strong>Paciente:</strong> {data.pacienteNombre}</p>
        <p><strong>ID paciente:</strong> {data.pacienteId}</p>

        <hr />

        <p><strong>Profesional:</strong> {data.profesionalNombre}</p>
        <p><strong>ID profesional:</strong> {data.profesionalId}</p>
      </div>
    </div>
  );
}