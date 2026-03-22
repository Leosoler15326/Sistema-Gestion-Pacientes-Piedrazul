
import { useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { usePacienteDetail } from '../hooks/usePacientes';
import { APP_ROUTES } from '../../../app/router/routes';

export default function PacienteDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, isError } = usePacienteDetail(id);

  if (isLoading) return <Loader message="Cargando paciente..." />;

  if (isError || !data) {
    return (
      <EmptyState
        title="No se encontró el paciente"
        description="No fue posible obtener el detalle solicitado."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title={`Paciente #${data.id}`}
        subtitle="Detalle del paciente"
        actions={
          <a
            href={APP_ROUTES.PACIENTES_EDITAR.replace(':id', String(data.id))}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Editar paciente
          </a>
        }
        
      />

      <div className="space-y-4 rounded-xl bg-white p-6 shadow">
        <p><strong>ID:</strong> {data.id}</p>
        <p><strong>Nombres:</strong> {data.nombres}</p>
        <p><strong>Apellidos:</strong> {data.apellidos}</p>
        <p><strong>Nombre completo:</strong> {data.nombreCompleto}</p>
        <p><strong>Documento:</strong> {data.documento}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Teléfono:</strong> {data.telefono}</p>
        <p><strong>Total citas:</strong> {data.totalCitas}</p>
      </div>
    </div>
  );
}