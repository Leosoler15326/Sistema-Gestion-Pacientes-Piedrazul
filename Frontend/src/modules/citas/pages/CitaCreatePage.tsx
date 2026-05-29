import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import CitaForm from '../components/CitaForm';
import { useCreateCita } from '../hooks/UseCitas';
import type { CreateCitaRequestDto } from '../types/cita.types';

export default function CitaCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createMutation = useCreateCita();
  const [errorMessage, setErrorMessage] = useState('');

  const pacienteIdParam = searchParams.get('pacienteId');
  const pacienteNombreParam = searchParams.get('pacienteNombre');

  const initialPacienteId = pacienteIdParam ? Number(pacienteIdParam) : undefined;
  const initialPacienteNombre = pacienteNombreParam
    ? decodeURIComponent(pacienteNombreParam)
    : undefined;

  const handleSubmit = async (values: CreateCitaRequestDto) => {
    try {
      setErrorMessage('');
      await createMutation.mutateAsync(values);
      navigate(APP_ROUTES.CITAS, {
        state: { successMessage: 'Cita agendada correctamente.' },
      });
    } catch (error) {
      console.error(error);
      setErrorMessage('No fue posible agendar la cita.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Nueva cita"
        subtitle="Programa una nueva cita para un paciente."
      />

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <CitaForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
        initialPacienteId={initialPacienteId}
        initialPacienteNombre={initialPacienteNombre}
      />
    </div>
  );
}