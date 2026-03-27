import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import PacientesTable from '../components/PacientesTable';
import { usePacientes, usePacientesPorNombre } from '../hooks/usePacientes';

export default function PacientesListPage() {
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [buscar, setBuscar] = useState(false);

  const listadoGeneral = usePacientes();
  const listadoBusqueda = usePacientesPorNombre(buscar ? nombreBusqueda : undefined);

  const isSearching = buscar && nombreBusqueda.trim().length > 0;

  const data = isSearching ? listadoBusqueda.data : listadoGeneral.data;
  const isLoading = isSearching ? listadoBusqueda.isLoading : listadoGeneral.isLoading;
  const isError = isSearching ? listadoBusqueda.isError : listadoGeneral.isError;

  const handleBuscar = () => {
    setBuscar(true);
  };

  const handleLimpiar = () => {
    setNombreBusqueda('');
    setBuscar(false);
  };

  if (isLoading) return <Loader message="Cargando pacientes..." />;

  if (isError) {
    return (
      <EmptyState
        title="Error al cargar pacientes"
        description="No fue posible consultar la información."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Pacientes"
        subtitle="Consulta y gestiona pacientes registrados."
        actions={
          <Link
            to={APP_ROUTES.PACIENTES_NUEVO}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Nuevo paciente
          </Link>
        }
      />

      <div className="mb-6 rounded-xl bg-white p-4 shadow">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={nombreBusqueda}
            onChange={(e) => setNombreBusqueda(e.target.value)}
            className="rounded-lg border px-3 py-2"
          />
          <button
            type="button"
            onClick={handleBuscar}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={handleLimpiar}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            Limpiar
          </button>
        </div>
      </div>

      {!data || data.length === 0 ? (
        <EmptyState
          title="No hay pacientes registrados"
          description="No se encontraron pacientes para mostrar."
        />
      ) : (
        <PacientesTable items={data} />
      )}
    </div>
  );
}