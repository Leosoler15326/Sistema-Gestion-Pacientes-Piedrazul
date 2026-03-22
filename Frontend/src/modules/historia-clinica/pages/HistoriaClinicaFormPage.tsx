import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import HistoriaClinicaForm from '../components/HistoriaClinicaForm';
import { useCreateHistoriaClinica } from '../hooks/useHistoriaClinica';
import type { CreateHistoriaClinicaRequestDto } from '../types/historiaClinica.types';

export default function HistoriaClinicaFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createMutation = useCreateHistoriaClinica();
  const [errorMessage, setErrorMessage] = useState('');

  const citaIdParam = searchParams.get('citaId');
  const initialCitaId = citaIdParam ? Number(citaIdParam) : undefined;

  const handleSubmit = async (values: CreateHistoriaClinicaRequestDto) => {
    try {
      setErrorMessage('');
      await createMutation.mutateAsync(values);
      navigate(APP_ROUTES.HISTORIA_CLINICA);
    } catch (error) {
      console.error(error);
      setErrorMessage('No fue posible registrar la historia clínica.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Nueva historia clínica"
        subtitle="Registra una nueva historia clínica asociada a una cita."
      />

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <HistoriaClinicaForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
        initialCitaId={initialCitaId}
      />
    </div>
  );
}