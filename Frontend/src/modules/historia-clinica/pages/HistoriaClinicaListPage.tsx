import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import HistoriaClinicaTable from '../components/HistoriaClinicaTable';
import { useHistoriasPorPaciente } from '../hooks/useHistoriaClinica';

export default function HistoriaClinicaListPage() {
  const [pacienteId, setPacienteId] = useState<number | undefined>(undefined);
  const { data, isLoading, isError, refetch } = useHistoriasPorPaciente(pacienteId);

  const handleBuscar = () => {
    if (pacienteId) {
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Historias clínicas"
        subtitle="Consulta historias clínicas por paciente."
        actions={
          <Link
            to={APP_ROUTES.HISTORIA_CLINICA_NUEVA}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Nueva historia clínica
          </Link>
        }
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

      {isLoading && <Loader message="Cargando historias clínicas..." />}

      {!isLoading && isError && (
        <EmptyState
          title="Error al cargar historias clínicas"
          description="No fue posible consultar la información."
        />
      )}

      {!isLoading && !isError && pacienteId && (!data || data.length === 0) && (
        <EmptyState
          title="No hay historias clínicas"
          description="No se encontraron registros para el paciente indicado."
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <HistoriaClinicaTable items={data} />
      )}
    </div>
  );
}