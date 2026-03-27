import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import InlineMessage from '../../../components/common/InlineMessage';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import UsuarioEditForm from '../components/UsuarioEditForm';
import { useUpdateUsuario, useUsuarioDetail } from '../hooks/useUsuarios';
import type { ActualizarUsuarioDto } from '../types/usuario.types';

export default function UsuarioEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.id);
  const [errorMessage, setErrorMessage] = useState('');

  const { data, isLoading, isError } = useUsuarioDetail(id);
  const updateMutation = useUpdateUsuario();

  const handleSubmit = async (values: ActualizarUsuarioDto) => {
    try {
      setErrorMessage('');
      await updateMutation.mutateAsync({ id, payload: values });
      navigate(APP_ROUTES.USUARIOS_DETALLE.replace(':id', String(id)));
    } catch (error) {
      console.error(error);
      setErrorMessage('No fue posible actualizar el usuario.');
    }
  };

  if (isLoading) return <Loader message="Cargando usuario..." />;

  if (isError || !data) {
    return (
      <EmptyState
        title="No se encontró el usuario"
        description="No fue posible cargar la información."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader title="Editar usuario" subtitle={`Usuario #${id}`} />

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <UsuarioEditForm
        initialData={data}
        onSubmit={handleSubmit}
        loading={updateMutation.isPending}
      />
    </div>
  );
}