import { useState } from 'react';
import { useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import InlineMessage from '../../../components/common/InlineMessage';
import PageHeader from '../../../components/common/PageHeader';
import { useCambiarEstadoProfesional, useProfesionalDetail } from '../hooks/useprofesionales';

export default function ProfesionalDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [message, setMessage] = useState('');

  const { data, isLoading, isError } = useProfesionalDetail(id);
  const estadoMutation = useCambiarEstadoProfesional();

  const handleCambiarEstado = async (estado: string) => {
    try {
      setMessage('');
      await estadoMutation.mutateAsync({ id, estado });
      setMessage(`Estado cambiado a ${estado}`);
    } catch (error) {
      console.error(error);
      setMessage('No fue posible cambiar el estado.');
    }
  };

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

      {message && (
        <div className="mb-4">
          <InlineMessage type="info" message={message} />
        </div>
      )}

      <div className="space-y-4 rounded-xl bg-white p-6 shadow">
        <p><strong>ID:</strong> {data.profesionalId}</p>
        <p><strong>Nombres:</strong> {data.nombres}</p>
        <p><strong>Tipo:</strong> {data.tipo}</p>
        <p><strong>Especialidad:</strong> {data.especialidad}</p>
        <p><strong>Intervalo:</strong> {data.intervaloMinutos} min</p>
        <p><strong>Estado:</strong> {data.estado}</p>
        <p><strong>Usuario vinculado:</strong> {data.usuarioVinculado ? 'Sí' : 'No'}</p>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={() => handleCambiarEstado('ACTIVO')}
            className="rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Activar
          </button>

          <button
            type="button"
            onClick={() => handleCambiarEstado('INACTIVO')}
            className="rounded-lg bg-yellow-600 px-4 py-2 text-white"
          >
            Inactivar
          </button>

          <button
            type="button"
            onClick={() => handleCambiarEstado('SUSPENDIDO')}
            className="rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Suspender
          </button>
        </div>
      </div>
    </div>
  );
}