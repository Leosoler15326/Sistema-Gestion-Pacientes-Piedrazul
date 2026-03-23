import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import BackButton from '../../../components/common/BackButton';
import { APP_ROUTES } from '../../../app/router/routes';
import CitaForm from '../components/CitaForm';
import { useCreateCita } from '../hooks/UseCitas';
import type { CreateCitaRequestDto } from '../types/cita.types';

export default function CitaCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCita();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values: CreateCitaRequestDto) => {
    try {
      setErrorMessage('');
      await createMutation.mutateAsync(values);
      navigate(APP_ROUTES.CITAS);
    } catch (error) {
      console.error(error);
      setErrorMessage('No fue posible agendar la cita.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Nueva cita"
        subtitle="Agenda una nueva cita."
        actions={<BackButton />}
      />

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <CitaForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </div>
  );
}