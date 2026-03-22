import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import UsuarioForm from '../components/UsuarioForm';
import { useCreateUsuario } from '../hooks/useUsuarios';
import type { CrearUsuarioDto } from '../types/usuario.types';

export default function UsuarioFormPage() {
  const navigate = useNavigate();
  const createMutation = useCreateUsuario();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values: CrearUsuarioDto) => {
    try {
      setErrorMessage('');
      await createMutation.mutateAsync(values);
      navigate(APP_ROUTES.USUARIOS);
    } catch (error) {
      console.error(error);
      setErrorMessage('No fue posible registrar el usuario.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Nuevo usuario"
        subtitle="Registra un nuevo usuario del sistema."
      />

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <UsuarioForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </div>
  );
}