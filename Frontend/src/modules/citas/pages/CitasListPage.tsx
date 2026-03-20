import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { APP_ROUTES } from '../../../app/router/routes';
import CitaFilters from '../components/CitaFilters';
import CitasTable from '../components/CitasTable';
import { useCancelCita, useCitas } from '../hooks/UseCitas';
import type { CitasFiltersDto } from '../types/cita.types';

export default function CitasListPage() {
  const [filters, setFilters] = useState<CitasFiltersDto>({});
  const [citaIdToCancel, setCitaIdToCancel] = useState<number | null>(null);

  const { data, isLoading, isError } = useCitas(filters);
  const cancelMutation = useCancelCita();

  const handleConfirmCancel = async () => {
    if (!citaIdToCancel) return;
    await cancelMutation.mutateAsync(citaIdToCancel);
    setCitaIdToCancel(null);
  };

  if (isLoading) return <Loader message="Cargando citas..." />;

  if (isError) {
    return (
      <EmptyState
        title="Error al cargar citas"
        description="No fue posible consultar la lista de citas."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Citas"
        subtitle="Consulta, filtra y gestiona las citas registradas."
        actions={
          <Link
            to={APP_ROUTES.CITAS_NUEVA}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Nueva cita
          </Link>
        }
      />

      <CitaFilters onApply={setFilters} />

      {!data || data.length === 0 ? (
        <EmptyState
          title="No hay citas registradas"
          description="Aún no existen citas para mostrar con los filtros aplicados."
        />
      ) : (
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