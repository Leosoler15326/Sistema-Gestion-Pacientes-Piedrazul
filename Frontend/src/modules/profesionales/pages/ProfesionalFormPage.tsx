import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import ProfesionalForm from '../components/ProfesionalForm';
import { useCreateProfesional } from '../hooks/useprofesionales';
import type { CrearProfesionalDto } from '../types/profesional.types';

export default function ProfesionalFormPage() {
  const navigate = useNavigate();
  const createMutation = useCreateProfesional();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values: CrearProfesionalDto) => {
    try {
      setErrorMessage('');
      await createMutation.mutateAsync(values);
      navigate(APP_ROUTES.PROFESIONALES);
    } catch (error) {
      console.error(error);
      setErrorMessage('No fue posible registrar el profesional.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Nuevo profesional"
        subtitle="Registra un profesional con o sin usuario vinculado."
      />

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <ProfesionalForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </div>
  );
}