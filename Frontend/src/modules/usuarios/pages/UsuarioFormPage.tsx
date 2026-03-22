
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import UsuarioForm from '../components/UsuarioForm';
import { useCreateUsuario } from '../hooks/useUsuarios';
import type { CrearUsuarioDto } from '../types/usuario.types';

export default function UsuarioFormPage() {
  const navigate = useNavigate();
  const createMutation = useCreateUsuario();

  const handleSubmit = async (values: CrearUsuarioDto) => {
    await createMutation.mutateAsync(values);
    navigate(APP_ROUTES.USUARIOS);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Nuevo usuario"
        subtitle="Registra un nuevo usuario del sistema."
      />

      <UsuarioForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </div>
  );
}