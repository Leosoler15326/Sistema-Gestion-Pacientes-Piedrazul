import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import BackButton from '../../../components/common/BackButton';
import HistoriaClinicaViewer from '../components/HistoriaClinicaViewer';
import { useHistoriaPorCita } from '../hooks/useHistoriaClinica';
import { APP_ROUTES } from '../../../app/router/routes';

export default function HistoriaClinicaDetailPage() {
  const params = useParams();
  const citaId = Number(params.id);

  const { data, isLoading, isError } = useHistoriaPorCita(citaId);

  if (isLoading) return <Loader message="Cargando historia clínica..." />;

  if (isError) {
    return (
      <EmptyState
        title="Error al cargar historia clínica"
        description="No fue posible consultar la información."
      />
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <PageHeader
          title={`Historia clínica de la cita #${citaId}`}
          subtitle="Aún no existe una historia clínica para esta cita."
          actions={
            <div className="flex gap-2">
              <BackButton />
              <Link
                to={`${APP_ROUTES.HISTORIA_CLINICA_NUEVA}?citaId=${citaId}`}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Crear historia clínica
              </Link>
            </div>
          }
        />

        <EmptyState
          title="Sin historia clínica"
          description="Todavía no se ha registrado una historia clínica para esta cita."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title={`Historia clínica de la cita #${data.citaId}`}
        subtitle="Detalle del registro clínico"
        actions={
          <div className="flex gap-2">
            <BackButton />
            <Link
              to={APP_ROUTES.HISTORIA_CLINICA_EDITAR.replace(':id', String(data.citaId))}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Editar historia clínica
            </Link>
          </div>
        }
      />

      <HistoriaClinicaViewer item={data} />
    </div>
  );
}