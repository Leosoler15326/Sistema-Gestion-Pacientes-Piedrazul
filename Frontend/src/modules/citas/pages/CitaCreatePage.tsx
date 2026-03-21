import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import CitaForm from '../components/CitaForm';
import { useCreateCita } from '../hooks/UseCitas';
import type { CreateCitaRequestDto } from '../types/cita.types';

export default function CitaCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCita();

  const handleSubmit = async (values: CreateCitaRequestDto) => {
    await createMutation.mutateAsync(values);
    navigate(APP_ROUTES.CITAS);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Nueva cita"
        subtitle="Agenda una nueva cita."
      />

      <CitaForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </div>
  );
}