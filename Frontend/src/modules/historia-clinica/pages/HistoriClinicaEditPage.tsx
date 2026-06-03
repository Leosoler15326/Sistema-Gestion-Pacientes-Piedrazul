import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import InlineMessage from '../../../components/common/InlineMessage';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import HistoriaClinicaEditForm from '../components/HistoriaClinicaEditForm';
import { useHistoriaPorCita, useUpdateHistoriaClinica } from '../hooks/useHistoriaClinica';
import type { UpdateHistoriaClinicaRequestDto } from '../types/historiaClinica.types';

export default function HistoriaClinicaEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const citaId = Number(params.id);
  const [errorMessage, setErrorMessage] = useState('');

  const { data, isLoading, isError } = useHistoriaPorCita(citaId);
  const updateMutation = useUpdateHistoriaClinica();

  const handleSubmit = async (values: UpdateHistoriaClinicaRequestDto) => {
    if (!data) return;

    try {
      setErrorMessage('');
      await updateMutation.mutateAsync({
        id: data.id,
        payload: values,
      });

      navigate(APP_ROUTES.HISTORIA_CLINICA_DETALLE.replace(':id', String(citaId)));
    } catch (error) {
      console.error(error);
      setErrorMessage('No fue posible actualizar la historia clínica.');
    }
  };

  if (isLoading) return <Loader message="Cargando historia clínica..." />;

  if (isError || !data) {
    return (
      <EmptyState
        title="No se encontró la historia clínica"
        description="No fue posible cargar la información."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader title="Editar historia clínica" subtitle={`Cita #${citaId}`} />

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <HistoriaClinicaEditForm
        initialData={data}
        onSubmit={handleSubmit}
        loading={updateMutation.isPending}
      />
    </div>
  );
}