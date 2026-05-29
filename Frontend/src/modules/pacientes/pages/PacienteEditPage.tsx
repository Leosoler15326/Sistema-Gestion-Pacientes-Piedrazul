import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import InlineMessage from '../../../components/common/InlineMessage';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import PacienteEditForm from '../components/PacienteEditForm';
import { usePacienteDetail, useUpdatePaciente } from '../hooks/usePacientes';
import type { ActualizarPacienteDto } from '../types/paciente.types';

export default function PacienteEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.id);
  const [errorMessage, setErrorMessage] = useState('');

  const { data, isLoading, isError } = usePacienteDetail(id);
  const updateMutation = useUpdatePaciente();

  const handleSubmit = async (values: ActualizarPacienteDto) => {
    try {
      setErrorMessage('');
      await updateMutation.mutateAsync({ id, payload: values });
      navigate(APP_ROUTES.PACIENTES_DETALLE.replace(':id', String(id)));
    } catch (error) {
      console.error(error);
      setErrorMessage('No fue posible actualizar el paciente.');
    }
  };

  if (isLoading) return <Loader message="Cargando paciente..." />;

  if (isError || !data) {
    return (
      <EmptyState
        title="No se encontró el paciente"
        description="No fue posible cargar la información."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader title="Editar paciente" subtitle={`Paciente #${id}`} />

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <PacienteEditForm
        initialData={data}
        onSubmit={handleSubmit}
        loading={updateMutation.isPending}
      />
    </div>
  );
}