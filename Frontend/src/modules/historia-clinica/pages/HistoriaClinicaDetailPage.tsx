import { useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import HistoriaClinicaViewer from '../components/HistoriaClinicaViewer';
import { useHistoriaPorCita } from '../hooks/useHistoriaClinica';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../../app/router/routes';



export default function HistoriaClinicaDetailPage() {
  const params = useParams();
  const citaId = Number(params.id);

  const { data, isLoading, isError } = useHistoriaPorCita(citaId);

  if (isLoading) return <Loader message="Cargando historia clínica..." />;

  if (isError || !data) {
    return (
      <EmptyState
        title="No se encontró la historia clínica"
        description="No existe una historia clínica asociada a esta cita o no fue posible cargarla."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title={`Historia clínica de la cita #${data.citaId}`}
        subtitle="Detalle del registro clínico"
        actions={
          <Link
            to={APP_ROUTES.HISTORIA_CLINICA_EDITAR.replace(':id', String(data.citaId))}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Editar historia clínica
          </Link>
        }
      />
      <HistoriaClinicaViewer item={data} />
    </div>
  );
}