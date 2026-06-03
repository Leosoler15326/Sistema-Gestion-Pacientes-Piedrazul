import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import ReagendarModal from '../components/ReagendarModal';
import { useReagendarCita } from '../hooks/UseCitas';
import { useProfesionalesActivos } from '../../profesionales/hooks/useprofesionales';
import type { ReagendarCitaRequestDto } from '../types/cita.types';
import { citasService } from '../services/citas.service';

export default function ReagendarCitaPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.id);

  const reagendarMutation = useReagendarCita();
  const { data: profesionales } = useProfesionalesActivos();
  const [errorMsg, setErrorMsg] = useState('');

  const { data: citaActual } = useQuery({
    queryKey: ['cita', id],
    queryFn: () => citasService.buscarPorId(id),
    enabled: Boolean(id),
  });

  const handleSubmit = async (values: ReagendarCitaRequestDto) => {
    setErrorMsg('');
    try {
      await reagendarMutation.mutateAsync({ id, payload: values });
      navigate(APP_ROUTES.CITAS, {
        state: { successMessage: 'La cita fue reagendada exitosamente.' },
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No fue posible reagendar la cita. Verifica el horario o intenta con otra fecha.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Reagendar cita"
        subtitle={`Cambia la fecha y el horario de la cita #${id}`}
      />

      {errorMsg && (
        <div className="mb-4 max-w-md">
          <InlineMessage type="error" message={errorMsg} />
        </div>
      )}

      <ReagendarModal
        isOpen
        onClose={() => navigate(APP_ROUTES.CITAS)}
        onSubmit={handleSubmit}
        loading={reagendarMutation.isPending}
        profesionales={Array.isArray(profesionales) ? profesionales : []}
        currentProfesionalId={citaActual?.profesionalId}
      />
    </div>
  );
}
