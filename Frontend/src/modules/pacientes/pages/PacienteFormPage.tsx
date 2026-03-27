import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import PacienteForm from '../components/PacienteForm';
import { useCreatePaciente } from '../hooks/usePacientes';
import type { CrearPacienteDto } from '../types/paciente.types';

export default function PacienteFormPage() {
  const navigate = useNavigate();
  const createMutation = useCreatePaciente();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values: CrearPacienteDto) => {
    try {
      setErrorMessage('');
      await createMutation.mutateAsync(values);
      navigate(APP_ROUTES.PACIENTES);
    } catch (error) {
      console.error(error);
      setErrorMessage('No fue posible registrar el paciente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Nuevo paciente"
        subtitle="Registra un nuevo paciente en el sistema."
      />

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <PacienteForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </div>
  );
}