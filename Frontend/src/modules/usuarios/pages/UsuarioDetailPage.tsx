import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import BackButton from '../../../components/common/BackButton';
import { APP_ROUTES } from '../../../app/router/routes';
import { useUsuarioDetail } from '../hooks/useUsuarios';

export default function UsuarioDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, isError } = useUsuarioDetail(id);

  if (isLoading) return <Loader message="Cargando usuario..." />;

  if (isError || !data) {
    return (
      <EmptyState
        title="No se encontró el usuario"
        description="No fue posible obtener el detalle solicitado."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title={data.nombreCompleto||data.nombres|| `Detalle de usuario`}
        subtitle="Detalle del usuario"
        actions={
          <div className="flex gap-2">
            <BackButton />
            <Link
              to={APP_ROUTES.USUARIOS_EDITAR.replace(':id', String(data.id))}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Editar usuario
            </Link>
          </div>
        }
      />

      <div className="space-y-4 rounded-xl bg-white p-6 shadow">
        <p><strong>Usuario:</strong> {data.nombreUsuario || data.username || 'N/A'}</p>
        <p><strong>Nombre completo:</strong> {data.nombreCompleto || data.nombres || 'N/A'}</p>
        <p><strong>Email:</strong> {data.email || 'N/A'}</p>
        <p><strong>Rol:</strong> {data.rol || 'N/A'}</p>
        <p><strong>Estado de acceso:</strong> {data.estado ?? (data.activo ? 'ACTIVO' : 'INACTIVO')}</p>
      </div>
    </div>
  );
}