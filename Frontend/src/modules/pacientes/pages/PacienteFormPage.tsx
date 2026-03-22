
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import PacienteForm from '../components/PacienteForm';
import { useCreatePaciente } from '../hooks/usePacientes';
import type { CrearPacienteDto } from '../types/paciente.types';

export default function PacienteFormPage() {
  const navigate = useNavigate();
  const createMutation = useCreatePaciente();

  const handleSubmit = async (values: CrearPacienteDto) => {
    await createMutation.mutateAsync(values);
    navigate(APP_ROUTES.PACIENTES);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Nuevo paciente"
        subtitle="Registra un nuevo paciente en el sistema."
      />

      <PacienteForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </div>
  );
}