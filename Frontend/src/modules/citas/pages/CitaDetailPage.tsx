import { useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { useCitaDetail } from '../hooks/UseCitas';

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
        <p><strong>Fecha y hora:</strong> {data.fechaHora}</p>
        <p><strong>Tipo de atención:</strong> {data.tipoAtencion}</p>
        <p><strong>Motivo:</strong> {data.motivoConsulta || 'Sin motivo'}</p>
        <p><strong>Estado:</strong> {data.estado || 'N/A'}</p>
        <p>
          <strong>Paciente:</strong>{' '}
          {data.paciente?.nombres || data.paciente?.nombreCompleto || 'N/A'}
        </p>
        <p>
          <strong>Profesional:</strong>{' '}
          {data.profesional?.nombres || data.profesional?.nombreCompleto || 'N/A'}
        </p>
      </div>
    </div>
  );
}