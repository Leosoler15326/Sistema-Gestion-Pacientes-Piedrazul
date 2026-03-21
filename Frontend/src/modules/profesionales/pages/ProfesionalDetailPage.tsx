import { useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { useProfesionalDetail } from '../hooks/useprofesionales';

export default function ProfesionalDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, isError } = useProfesionalDetail(id);

  if (isLoading) return <Loader message="Cargando profesional..." />;

  if (isError || !data) {
    return (
      <EmptyState
        title="No se encontró el profesional"
        description="No fue posible obtener el detalle solicitado."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title={`Profesional #${data.profesionalId}`}
        subtitle="Detalle del profesional"
      />

      <div className="space-y-4 rounded-xl bg-white p-6 shadow">
        <p><strong>ID:</strong> {data.profesionalId}</p>
        <p><strong>Nombres:</strong> {data.nombres}</p>
        <p><strong>Tipo:</strong> {data.tipo}</p>
        <p><strong>Especialidad:</strong> {data.especialidad}</p>
        <p><strong>Intervalo:</strong> {data.intervaloMinutos} min</p>
        <p><strong>Estado:</strong> {data.estado}</p>
        <p><strong>Usuario vinculado:</strong> {data.usuarioVinculado ? 'Sí' : 'No'}</p>

        {data.usuarioVinculado && (
          <>
            <p><strong>Usuario ID:</strong> {data.usuarioId ?? 'N/A'}</p>
            <p><strong>Nombre usuario:</strong> {data.nombreUsuario ?? 'N/A'}</p>
            <p><strong>Rol usuario:</strong> {data.rolUsuario ?? 'N/A'}</p>
          </>
        )}
      </div>
    </div>
  );
}