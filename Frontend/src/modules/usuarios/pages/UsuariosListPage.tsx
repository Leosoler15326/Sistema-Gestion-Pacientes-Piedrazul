
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import UsuariosTable from '../components/UsuariosTable';
import { useDesactivarUsuario, useUsuarios } from '../hooks/useUsuarios';

export default function UsuariosListPage() {
  const { data, isLoading, isError } = useUsuarios();
  const desactivarMutation = useDesactivarUsuario();
  const [usuarioIdToDisable, setUsuarioIdToDisable] = useState<number | null>(null);

  const handleConfirmDisable = async () => {
    if (!usuarioIdToDisable) return;
    await desactivarMutation.mutateAsync(usuarioIdToDisable);
    setUsuarioIdToDisable(null);
  };

  if (isLoading) return <Loader message="Cargando usuarios..." />;

  if (isError) {
    return (
      <EmptyState
        title="Error al cargar usuarios"
        description="No fue posible consultar la información."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Usuarios"
        subtitle="Consulta y administra los usuarios del sistema."
        actions={
          <Link
            to={APP_ROUTES.USUARIOS_NUEVO}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Nuevo usuario
          </Link>
        }
      />

      {!data || data.length === 0 ? (
        <EmptyState
          title="No hay usuarios registrados"
          description="Aún no existen registros para mostrar."
        />
      ) : (
        <UsuariosTable items={data} onDesactivar={setUsuarioIdToDisable} />
      )}

      <ConfirmDialog
        isOpen={Boolean(usuarioIdToDisable)}
        title="Desactivar usuario"
        message="¿Estás seguro de desactivar este usuario?"
        confirmText="Sí, desactivar"
        onCancel={() => setUsuarioIdToDisable(null)}
        onConfirm={handleConfirmDisable}
        loading={desactivarMutation.isPending}
      />
    </div>
  );
}