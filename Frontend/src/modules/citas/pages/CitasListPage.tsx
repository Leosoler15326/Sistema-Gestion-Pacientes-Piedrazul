import { useState } from 'react';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import CitasTable from '../components/CitasTable';
import { useCancelarCita, useCitasPorPaciente } from '../hooks/UseCitas';

export default function CitasListPage() {
  const [pacienteId, setPacienteId] = useState<number | undefined>(undefined);
  const [citaIdToCancel, setCitaIdToCancel] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useCitasPorPaciente(pacienteId);
  const cancelMutation = useCancelarCita();

  const handleBuscar = () => {
    if (pacienteId) {
      refetch();
    }
  };

  const handleConfirmCancel = async () => {
    if (!citaIdToCancel) return;

    await cancelMutation.mutateAsync({
      id: citaIdToCancel,
      payload: { motivo: 'Cancelada desde frontend' },
    });

    setCitaIdToCancel(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Citas"
        subtitle="Consulta citas por paciente."
      />

      <div className="mb-6 rounded-xl bg-white p-4 shadow">
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="ID paciente"
            value={pacienteId || ''}
            onChange={(e) => setPacienteId(Number(e.target.value))}
            className="rounded-lg border px-3 py-2"
          />
          <button
            type="button"
            onClick={handleBuscar}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Buscar
          </button>
        </div>
      </div>

      {isLoading && <Loader message="Cargando citas..." />}

      {!isLoading && isError && (
        <EmptyState
          title="Error al cargar citas"
          description="No fue posible consultar las citas."
        />
      )}

      {!isLoading && !isError && pacienteId && (!data || data.length === 0) && (
        <EmptyState
          title="No hay citas"
          description="No se encontraron citas para el paciente indicado."
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <CitasTable items={data} onCancel={setCitaIdToCancel} />
      )}

      <ConfirmDialog
        isOpen={Boolean(citaIdToCancel)}
        title="Cancelar cita"
        message="¿Estás seguro de cancelar esta cita?"
        confirmText="Sí, cancelar"
        onCancel={() => setCitaIdToCancel(null)}
        onConfirm={handleConfirmCancel}
        loading={cancelMutation.isPending}
      />
    </div>
  );
}