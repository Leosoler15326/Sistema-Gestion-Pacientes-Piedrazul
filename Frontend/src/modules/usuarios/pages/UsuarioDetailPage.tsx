
import { useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { useUsuarioDetail } from '../hooks/useUsuarios';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../../app/router/routes';


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
        title={`Usuario #${data.id}`}
        subtitle="Detalle del usuario"

        actions={
          <Link
            to={APP_ROUTES.PACIENTES_EDITAR.replace(':id', String(data.id))}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Editar paciente
          </Link>
        }
        
      />

      <div className="space-y-4 rounded-xl bg-white p-6 shadow">
        <p><strong>ID:</strong> {data.id}</p>
        <p><strong>Usuario:</strong> {data.nombreUsuario || data.username || 'N/A'}</p>
        <p><strong>Nombre completo:</strong> {data.nombreCompleto || data.nombres || 'N/A'}</p>
        <p><strong>Email:</strong> {data.email || 'N/A'}</p>
        <p><strong>Rol:</strong> {data.rol || 'N/A'}</p>
        <p><strong>Estado:</strong> {data.estado ?? (data.activo ? 'ACTIVO' : 'INACTIVO')}</p>
      </div>
    </div>
  );
}