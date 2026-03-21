import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import HistoriaClinicaForm from '../components/HistoriaClinicaForm';
import { useCreateHistoriaClinica } from '../hooks/useHistoriaClinica';
import type { CreateHistoriaClinicaRequestDto } from '../types/historiaClinica.types';

export default function HistoriaClinicaFormPage() {
  const navigate = useNavigate();
  const createMutation = useCreateHistoriaClinica();

  const handleSubmit = async (values: CreateHistoriaClinicaRequestDto) => {
    await createMutation.mutateAsync(values);
    navigate(APP_ROUTES.HISTORIA_CLINICA);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Nueva historia clínica"
        subtitle="Registra una nueva historia clínica asociada a una cita."
      />

      <HistoriaClinicaForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </div>
  );
}