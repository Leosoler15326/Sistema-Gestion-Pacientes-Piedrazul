
import { Link } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import { APP_ROUTES } from '../../../app/router/routes';
import ProfesionalesTable from '../components/ProfesionalesTable';
import { useProfesionales } from '../hooks/useprofesionales';

export default function ProfesionalesListPage() {
  const { data, isLoading, isError } = useProfesionales();

  if (isLoading) return <Loader message="Cargando profesionales..." />;

  if (isError) {
    return (
      <EmptyState
        title="Error al cargar profesionales"
        description="No fue posible consultar la información."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Profesionales"
        subtitle="Consulta los profesionales registrados."
        actions={
          <Link
            to={APP_ROUTES.PROFESIONALES_NUEVO}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Nuevo profesional
          </Link>
        }
      />

      {!data || data.length === 0 ? (
        <EmptyState
          title="No hay profesionales registrados"
          description="Aún no existen registros para mostrar."
        />
      ) : (
        <ProfesionalesTable items={data} />
      )}
    </div>
  );
}