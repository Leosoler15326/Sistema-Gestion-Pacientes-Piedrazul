import { useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { useCitaDetail } from '../hooks/UseCitas';
import EstadoCitaBadge from '../components/EstadoCitaBadge';

export default function CitaDetailPage() {
  const params = useParams();
  const id = Number(params.id);

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
      />

      <div className="space-y-4 rounded-xl bg-white p-6 shadow">
        <p><strong>Paciente:</strong> {data.paciente.fullName}</p>
        <p><strong>Profesional:</strong> {data.profesional.fullName}</p>
        <p><strong>Especialidad:</strong> {data.profesional.specialty ?? 'N/A'}</p>
        <p><strong>Fecha:</strong> {data.fecha}</p>
        <p><strong>Hora:</strong> {data.horaInicio} - {data.horaFin}</p>
        <p><strong>Motivo:</strong> {data.motivo}</p>
        <p><strong>Observaciones:</strong> {data.observaciones || 'Sin observaciones'}</p>
        <div>
          <strong>Estado:</strong> <EstadoCitaBadge estado={data.estado} />
        </div>
      </div>
    </div>
  );
}