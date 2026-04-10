import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import InlineMessage from '../../../components/common/InlineMessage';
import Loader from '../../../components/common/Loader';
import { APP_ROUTES } from '../../../app/router/routes';
import { useMisCitasPaciente } from '../../citas/hooks/UseCitas';

export default function PacienteMisCitasPage() {
  const location = useLocation();
  const successMessage = (location.state as { successMessage?: string } | null)
    ?.successMessage;
  const { data, isLoading, isError } = useMisCitasPaciente();

  if (isLoading) {
    return <Loader message="Cargando tus citas..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <InlineMessage type="error" message="No fue posible cargar tus citas." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Mis citas"
        subtitle="Consulta el estado y detalle de tus citas programadas."
        actions={
          <Link
            to={APP_ROUTES.PACIENTE_AGENDAR}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Agendar otra cita
          </Link>
        }
      />

      {successMessage && (
        <div className="mb-4">
          <InlineMessage type="success" message={successMessage} />
        </div>
      )}

      {!data?.length ? (
        <EmptyState
          title="Sin citas"
          description="Aún no tienes citas registradas. Puedes agendar desde el botón superior."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Fecha y hora</th>
                <th className="px-4 py-3">Profesional</th>
                <th className="px-4 py-3">Especialidad</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{c.fechaHora}</td>
                  <td className="px-4 py-3">{c.profesionalNombre}</td>
                  <td className="px-4 py-3">{c.especialidad ?? '—'}</td>
                  <td className="px-4 py-3">{c.estado}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/citas/${c.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
