
import { useParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import HistoriaClinicaViewer from '../components/HistoriaClinicaViewer';
import { useHistoriaClinicaDetail } from '../hooks/useHistoriaClinica';

export default function HistoriaClinicaDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, isError } = useHistoriaClinicaDetail(id);

  if (isLoading) return <Loader message="Cargando historia clínica..." />;

  if (isError || !data) {
    return (
      <EmptyState
        title="No se encontró la historia clínica"
        description="No fue posible obtener el detalle solicitado."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title={`Historia clínica #${data.id}`}
        subtitle="Detalle del registro clínico"
      />

      <HistoriaClinicaViewer item={data} />
    </div>
  );
}