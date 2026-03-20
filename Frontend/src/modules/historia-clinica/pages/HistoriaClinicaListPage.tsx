
import { Link } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import HistoriaClinicaTable from '../components/HistoriaClinicaTable';
import { useHistoriasClinicas } from '../hooks/useHistoriaClinica';

export default function HistoriaClinicaListPage() {
  const { data, isLoading, isError } = useHistoriasClinicas();

  if (isLoading) return <Loader message="Cargando historias clínicas..." />;

  if (isError) {
    return (
      <EmptyState
        title="Error al cargar historias clínicas"
        description="No fue posible consultar la información."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Historias clínicas"
        subtitle="Consulta el historial clínico registrado en el sistema."
        actions={
          <Link
            to={APP_ROUTES.HISTORIA_CLINICA_NUEVA}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Nueva historia clínica
          </Link>
        }
      />

      {!data || data.length === 0 ? (
        <EmptyState
          title="No hay historias clínicas registradas"
          description="Aún no existen registros para mostrar."
        />
      ) : (
        <HistoriaClinicaTable items={data} />
      )}
    </div>
  );
}