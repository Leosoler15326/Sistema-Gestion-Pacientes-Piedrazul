
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import ProfesionalForm from '../components/ProfesionalForm';
import { useCreateProfesional } from '../hooks/useprofesionales';
import type { CrearProfesionalDto } from '../types/profesional.types';

export default function ProfesionalFormPage() {
  const navigate = useNavigate();
  const createMutation = useCreateProfesional();

  const handleSubmit = async (values: CrearProfesionalDto) => {
    await createMutation.mutateAsync(values);
    navigate(APP_ROUTES.PROFESIONALES);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Nuevo profesional"
        subtitle="Registra un profesional con o sin usuario vinculado."
      />

      <ProfesionalForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </div>
  );
}