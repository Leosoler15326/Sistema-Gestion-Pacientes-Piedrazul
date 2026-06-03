import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import InlineMessage from '../../../components/common/InlineMessage';
import PageHeader from '../../../components/common/PageHeader';
import BackButton from '../../../components/common/BackButton';
import { APP_ROUTES } from '../../../app/router/routes';
import { useAuth } from '../../auth/hooks/useAuth';
import ProfesionalFranjasSection from '../components/ProfesionalFranjasSection';
import { useCambiarEstadoProfesional, useProfesionalDetail } from '../hooks/useprofesionales';

export default function ProfesionalDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const normalizedRole = String(user?.rol ?? '')
    .toUpperCase()
    .replace('ROLE_', '');
  const esAdmin = normalizedRole === 'ADMINISTRADOR';

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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title={data.nombres}
        subtitle="Detalle del profesional"
        actions={
          <div className="flex flex-wrap gap-2">
            <BackButton />
            {esAdmin && (
              <Link
                to={APP_ROUTES.PROFESIONALES_EDITAR.replace(':id', String(id))}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Editar datos
              </Link>
            )}
          </div>
        }
      />

      {message && (
        <div className="mb-4">
          <InlineMessage
            type={message.includes('cambiado') ? 'success' : 'error'}
            message={message}
          />
        </div>
      )}

      <div className="space-y-4 rounded-xl bg-white p-4 shadow sm:p-6">
      <p><strong>Nombre:</strong> {data.nombres}</p>
      <p><strong>Tipo:</strong> {data.tipo}</p>
      <p><strong>Especialidad:</strong> {data.especialidad}</p>
      <p><strong>Intervalo de agenda:</strong> {data.intervaloMinutos} min</p>
      {data.habilidadesAdicionales && (
        <p><strong>Habilidades adicionales:</strong> {data.habilidadesAdicionales}</p>
      )}
      <p><strong>Estado laboral:</strong> {data.estado}</p>
      <p><strong>Acceso al sistema:</strong> {data.usuarioVinculado ? 'Sí' : 'No'}</p>

      {data.usuarioVinculado && (
        <>
          <p><strong>Usuario vinculado:</strong> {data.nombreUsuario ?? 'N/A'}</p>
          <p><strong>Rol de acceso:</strong> {data.rolUsuario ?? 'N/A'}</p>
        </>
      )}

      <div className="flex flex-wrap gap-2 pt-4">
        {['ACTIVO', 'INACTIVO'].map((estado) => (
          <button
            key={estado}
            type="button"
            onClick={() => handleCambiarEstado(estado)}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white"
          >
            {estado}
          </button>
        ))}
      </div>
    </div>

      <div className="mt-6">
        <ProfesionalFranjasSection
          profesionalId={id}
          intervaloMinutos={data.intervaloMinutos}
          puedeEditar={esAdmin}
        />
      </div>
    </div>
  );
}