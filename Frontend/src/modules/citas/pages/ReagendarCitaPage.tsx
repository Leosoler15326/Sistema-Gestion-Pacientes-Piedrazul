import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import ReagendarModal from '../components/ReagendarModal';
import { useReagendarCita } from '../hooks/UseCitas';
import { useProfesionalesActivos } from '../../profesionales/hooks/useprofesionales';
import type { ReagendarCitaRequestDto } from '../types/cita.types';

export default function ReagendarCitaPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.id);

  const reagendarMutation = useReagendarCita();
  const { data: profesionales } = useProfesionalesActivos();

  const handleSubmit = async (values: ReagendarCitaRequestDto) => {
    await reagendarMutation.mutateAsync({ id, payload: values });
    navigate(APP_ROUTES.CITAS);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Reagendar cita"
        subtitle={`Actualiza la fecha y profesional de la cita #${id}`}
      />

      <ReagendarModal
        isOpen
        onClose={() => navigate(APP_ROUTES.CITAS)}
        onSubmit={handleSubmit}
        loading={reagendarMutation.isPending}
        profesionales={Array.isArray(profesionales) ? profesionales : []}
      />
    </div>
  );
}
