import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import { authStore } from '../../auth/store/auth.store';
import UsuariosTable from '../components/UsuariosTable';
import {
  useDesactivarUsuario,
  useReactivarUsuario,
  useUsuarios,
} from '../hooks/useUsuarios';

type AccionUsuario = { id: number; tipo: 'desactivar' | 'reactivar' };

function mensajeErrorApi(error: unknown): string {
  const ax = error as AxiosError<{ mensaje?: string }>;
  const msg = ax.response?.data?.mensaje;
  if (typeof msg === 'string' && msg.trim()) return msg;
  return 'No se pudo completar la operación. Revisa la consola o la pestaña Red.';
}

export default function UsuariosListPage() {
  const { data, isLoading, isError } = useUsuarios();
  const desactivarMutation = useDesactivarUsuario();
  const reactivarMutation = useReactivarUsuario();
  const [accion, setAccion] = useState<AccionUsuario | null>(null);

  const handleConfirmAccion = async () => {
    if (!accion) return;

    try {
      if (accion.tipo === 'desactivar') {
        await desactivarMutation.mutateAsync(accion.id);
      } else {
        await reactivarMutation.mutateAsync(accion.id);
      }
      setAccion(null);
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      alert(mensajeErrorApi(error));
    }
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
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
        <UsuariosTable
          items={data}
          currentUserId={authStore.getUser()?.id}
          onDesactivar={(id) => setAccion({ id, tipo: 'desactivar' })}
          onReactivar={(id) => setAccion({ id, tipo: 'reactivar' })}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(accion)}
        title={accion?.tipo === 'reactivar' ? 'Reactivar usuario' : 'Desactivar usuario'}
        message={
          accion?.tipo === 'reactivar'
            ? '¿Confirmas que deseas reactivar el acceso de este usuario?'
            : '¿Estás seguro de desactivar el acceso de este usuario?'
        }
        confirmText={accion?.tipo === 'reactivar' ? 'Sí, reactivar' : 'Sí, desactivar'}
        onCancel={() => setAccion(null)}
        onConfirm={handleConfirmAccion}
        loading={desactivarMutation.isPending || reactivarMutation.isPending}
      />
    </div>
  );
}