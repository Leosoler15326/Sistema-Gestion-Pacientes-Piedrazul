import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import CitasTable from '../components/CitasTable';
import {
  useCancelarCita,
  useCitasPorPaciente,
  useCitasPorProfesional,
} from '../hooks/UseCitas';
import { useProfesionalesActivos } from '../../profesionales/hooks/useprofesionales';

type SearchMode = 'paciente' | 'profesional';

export default function CitasListPage() {
  const [searchMode, setSearchMode] = useState<SearchMode>('paciente');

  const [pacienteIdInput, setPacienteIdInput] = useState('');
  const [profesionalIdInput, setProfesionalIdInput] = useState('');
  const [fechaProfesional, setFechaProfesional] = useState('');

  const [pacienteId, setPacienteId] = useState<number | undefined>(undefined);
  const [profesionalId, setProfesionalId] = useState<number | undefined>(undefined);
  const [fecha, setFecha] = useState<string | undefined>(undefined);

  const [citaIdToCancel, setCitaIdToCancel] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const { data: profesionales } = useProfesionalesActivos();

  const pacienteQuery = useCitasPorPaciente(
    searchMode === 'paciente' ? pacienteId : undefined
  );

  const profesionalQuery = useCitasPorProfesional(
    searchMode === 'profesional' && profesionalId && fecha
      ? { profesionalId, fecha }
      : undefined
  );

  const cancelMutation = useCancelarCita();

  const activeQuery = searchMode === 'paciente' ? pacienteQuery : profesionalQuery;

  const handleBuscar = () => {
    setMessage('');

    if (searchMode === 'paciente') {
      if (!pacienteIdInput.trim()) {
        setMessage('Debes ingresar un ID de paciente.');
        return;
      }

      setPacienteId(Number(pacienteIdInput));
      return;
    }

    if (!profesionalIdInput.trim()) {
      setMessage('Debes seleccionar un profesional.');
      return;
    }

    if (!fechaProfesional) {
      setMessage('Debes seleccionar una fecha.');
      return;
    }

    setProfesionalId(Number(profesionalIdInput));
    setFecha(fechaProfesional);
  };

  const handleLimpiar = () => {
    setMessage('');
    setPacienteIdInput('');
    setProfesionalIdInput('');
    setFechaProfesional('');
    setPacienteId(undefined);
    setProfesionalId(undefined);
    setFecha(undefined);
  };

  const handleConfirmCancel = async () => {
    if (!citaIdToCancel) return;

    try {
      setMessage('');
      await cancelMutation.mutateAsync({
        id: citaIdToCancel,
        payload: { motivo: 'Cancelada desde frontend' },
      });
      setCitaIdToCancel(null);
      setMessage('Cita cancelada correctamente.');
    } catch (error) {
      console.error(error);
      setMessage('No fue posible cancelar la cita.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Citas"
        subtitle="Consulta y gestiona citas por paciente o por profesional."
        actions={
          <Link
            to={APP_ROUTES.CITAS_NUEVA}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Nueva cita
          </Link>
        }
      />

      {message && (
        <div className="mb-4">
          <InlineMessage
            type={message.includes('correctamente') ? 'success' : 'error'}
            message={message}
          />
        </div>
      )}

      <div className="mb-6 rounded-xl bg-white p-4 shadow">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSearchMode('paciente');
              setMessage('');
            }}
            className={`rounded-lg px-4 py-2 ${
              searchMode === 'paciente'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 bg-white'
            }`}
          >
            Buscar por paciente
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchMode('profesional');
              setMessage('');
            }}
            className={`rounded-lg px-4 py-2 ${
              searchMode === 'profesional'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 bg-white'
            }`}
          >
            Buscar por profesional
          </button>
        </div>

        {searchMode === 'paciente' ? (
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              inputMode="numeric"
              placeholder="ID paciente"
              value={pacienteIdInput}
              onChange={(e) => setPacienteIdInput(e.target.value)}
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
        ) : (
          <div className="flex flex-col gap-3 md:flex-row">
            <select
              value={profesionalIdInput}
              onChange={(e) => setProfesionalIdInput(e.target.value)}
              className="rounded-lg border px-3 py-2"
            >
              <option value="">Selecciona un profesional</option>

              {Array.isArray(profesionales) &&
                profesionales.map((p: any) => (
                  <option
                    key={p.profesionalId ?? p.id}
                    value={p.profesionalId ?? p.id}
                  >
                    {(p.nombres ?? p.nombre ?? 'Profesional')}
                    {p.especialidad ? ` - ${p.especialidad}` : ''}
                  </option>
                ))}
            </select>
            <input
              type="date"
              value={fechaProfesional}
              onChange={(e) => setFechaProfesional(e.target.value)}
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
        )}
      </div>

      {activeQuery.isLoading && <Loader message="Cargando citas..." />}

      {!activeQuery.isLoading && activeQuery.isError && (
        <EmptyState
          title="Error al cargar citas"
          description="No fue posible consultar las citas."
        />
      )}

      {!activeQuery.isLoading &&
        !activeQuery.isError &&
        activeQuery.data &&
        activeQuery.data.length > 0 && (
          <CitasTable items={activeQuery.data} onCancel={setCitaIdToCancel} />
        )}

      {!activeQuery.isLoading &&
        !activeQuery.isError &&
        activeQuery.data &&
        activeQuery.data.length === 0 && (
          <EmptyState
            title="No hay citas"
            description="No se encontraron citas para los criterios indicados."
          />
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