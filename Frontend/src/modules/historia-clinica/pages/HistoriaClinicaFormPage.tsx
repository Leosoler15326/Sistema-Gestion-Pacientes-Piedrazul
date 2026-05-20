import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import HistoriaClinicaForm from '../components/HistoriaClinicaForm';
import { useCreateHistoriaClinica } from '../hooks/useHistoriaClinica';
import type { CreateHistoriaClinicaRequestDto } from '../types/historiaClinica.types';
import { usePacientesPorNombre } from '../../pacientes/hooks/usePacientes';
import { useCitasPorPaciente } from '../../citas/hooks/UseCitas';

type ApiError = { response?: { status?: number; data?: { message?: string; error?: string; detalle?: string } } };

function getErrorMessage(error: unknown) {
  const e = error as ApiError;
  const status = e?.response?.status;
  const backendMessage =
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.response?.data?.detalle;

  if (status === 403) {
    return 'No tienes permisos para registrar la historia clínica.';
  }

  if (backendMessage) {
    return String(backendMessage);
  }

  return 'No fue posible registrar la historia clínica.';
}

function formatFechaHora(value?: string) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function HistoriaClinicaFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createMutation = useCreateHistoriaClinica();

  const [errorMessage, setErrorMessage] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [pacienteId, setPacienteId] = useState<number | undefined>(undefined);
  const [selectedCitaId, setSelectedCitaId] = useState<number | undefined>(undefined);

  const citaIdParam = searchParams.get('citaId');
  const initialCitaId = citaIdParam ? Number(citaIdParam) : undefined;

  const {
    data: pacientesEncontrados,
    isLoading: pacientesLoading,
  } = usePacientesPorNombre(!initialCitaId ? nombrePaciente : '');

  const citasPacienteQuery = useCitasPorPaciente(!initialCitaId ? pacienteId : undefined);

  const pacienteSeleccionado = useMemo(() => {
    return pacientesEncontrados?.find((p) => p.id === pacienteId);
  }, [pacientesEncontrados, pacienteId]);

  const citaSeleccionada = useMemo(() => {
    return citasPacienteQuery.data?.find((c) => c.id === selectedCitaId);
  }, [citasPacienteQuery.data, selectedCitaId]);

  const citaIdFinal = initialCitaId ?? selectedCitaId;

  const citaLabel = useMemo(() => {
    if (initialCitaId) {
      return `Cita precargada: ${initialCitaId}`;
    }

    if (!citaSeleccionada) return '';

    const pacienteNombre =
      citaSeleccionada.pacienteNombre ||
      pacienteSeleccionado?.nombreCompleto ||
      'Paciente';

    const profesionalNombre =
      citaSeleccionada.profesionalNombre || 'Profesional';

    return `${pacienteNombre} · ${profesionalNombre} · ${formatFechaHora(
      citaSeleccionada.fechaHora
    )}`;
  }, [initialCitaId, citaSeleccionada, pacienteSeleccionado?.nombreCompleto]);

  const handleSubmit = async (values: CreateHistoriaClinicaRequestDto) => {
    try {
      setErrorMessage('');
      await createMutation.mutateAsync(values);
      navigate(APP_ROUTES.HISTORIA_CLINICA, {
        state: { successMessage: 'Historia clínica registrada correctamente.' },
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Nueva historia clínica"
        subtitle="Busca un paciente, selecciona una cita y registra la historia clínica."
      />

      {!initialCitaId && (
        <div className="mb-6 rounded-xl bg-white p-4 shadow">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Buscar paciente por nombre
              </label>

              <input
                type="text"
                placeholder="Escribe el nombre del paciente"
                value={nombrePaciente}
                onChange={(e) => {
                  setNombrePaciente(e.target.value);
                  setPacienteId(undefined);
                  setSelectedCitaId(undefined);
                  setErrorMessage('');
                }}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {pacientesLoading && (
              <p className="text-sm text-gray-500">Buscando pacientes...</p>
            )}

            {!pacientesLoading &&
              nombrePaciente.trim().length > 0 &&
              pacientesEncontrados &&
              pacientesEncontrados.length > 0 && (
                <div className="rounded-lg border bg-white">
                  {pacientesEncontrados.map((paciente) => (
                    <button
                      key={paciente.id}
                      type="button"
                      onClick={() => {
                        setPacienteId(paciente.id);
                        setNombrePaciente(paciente.nombreCompleto);
                        setSelectedCitaId(undefined);
                        setErrorMessage('');
                      }}
                      className="block w-full border-b px-3 py-2 text-left hover:bg-blue-50 last:border-b-0"
                    >
                      <div className="font-medium">{paciente.nombreCompleto}</div>
                      <div className="text-sm text-gray-500">
                        Documento: {paciente.documento} · Email: {paciente.email}
                      </div>
                    </button>
                  ))}
                </div>
              )}

            {pacienteSeleccionado && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                Paciente seleccionado: <strong>{pacienteSeleccionado.nombreCompleto}</strong>
              </div>
            )}

            {pacienteId && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Selecciona una cita del paciente
                </label>

                {citasPacienteQuery.isLoading ? (
                  <div className="rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-500">
                    Cargando citas del paciente...
                  </div>
                ) : citasPacienteQuery.data && citasPacienteQuery.data.length > 0 ? (
                  <select
                    value={selectedCitaId ? String(selectedCitaId) : ''}
                    onChange={(e) =>
                      setSelectedCitaId(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">Selecciona una cita</option>
                    {citasPacienteQuery.data.map((cita) => (
                      <option key={cita.id} value={String(cita.id)}>
                        {formatFechaHora(cita.fechaHora)} - {cita.profesionalNombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-500">
                    Este paciente no tiene citas disponibles para asociar.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {initialCitaId && (
        <div className="mb-4">
          <InlineMessage
            type="info"
            message={`Se cargó automáticamente la cita ${initialCitaId}.`}
          />
        </div>
      )}

      {!initialCitaId && !citaIdFinal && (
        <div className="mb-4">
          <InlineMessage
            type="info"
            message="Primero busca un paciente y selecciona una cita para continuar."
          />
        </div>
      )}

      {errorMessage && (
        <div className="mb-4">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <HistoriaClinicaForm
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
        initialCitaId={citaIdFinal}
        citaLabel={citaLabel}
      />
    </div>
  );
}