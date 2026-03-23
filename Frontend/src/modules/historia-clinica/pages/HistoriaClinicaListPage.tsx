import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import Loader from '../../../components/common/Loader';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import { APP_ROUTES } from '../../../app/router/routes';
import HistoriaClinicaTable from '../components/HistoriaClinicaTable';
import {
  useHistoriasPorPaciente,
  useHistoriasPorProfesional,
} from '../hooks/useHistoriaClinica';
import { useProfesionalesActivos } from '../../profesionales/hooks/useprofesionales';

type SearchMode = 'paciente' | 'profesional';

export default function HistoriaClinicaListPage() {
  const [searchParams] = useSearchParams();
  const pacienteIdFromQuery = searchParams.get('pacienteId');

  const [searchMode, setSearchMode] = useState<SearchMode>('paciente');
  const [pacienteIdInput, setPacienteIdInput] = useState('');
  const [profesionalIdInput, setProfesionalIdInput] = useState('');
  const [pacienteId, setPacienteId] = useState<number | undefined>(undefined);
  const [profesionalId, setProfesionalId] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState('');

  const { data: profesionales } = useProfesionalesActivos();

  useEffect(() => {
    if (pacienteIdFromQuery) {
      setSearchMode('paciente');
      setPacienteIdInput(pacienteIdFromQuery);
      setPacienteId(Number(pacienteIdFromQuery));
    }
  }, [pacienteIdFromQuery]);

  const pacienteQuery = useHistoriasPorPaciente(
    searchMode === 'paciente' ? pacienteId : undefined
  );

  const profesionalQuery = useHistoriasPorProfesional(
    searchMode === 'profesional' ? profesionalId : undefined
  );

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

    setProfesionalId(Number(profesionalIdInput));
  };

  const handleLimpiar = () => {
    setMessage('');
    setPacienteIdInput('');
    setProfesionalIdInput('');
    setPacienteId(undefined);
    setProfesionalId(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader
        title="Historias clínicas"
        subtitle="Consulta historias clínicas por paciente o por profesional."
        actions={
          <Link
            to={APP_ROUTES.HISTORIA_CLINICA_NUEVA}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Nueva historia clínica
          </Link>
        }
      />

      {message && (
        <div className="mb-4">
          <InlineMessage type="error" message={message} />
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

      {activeQuery.isLoading && <Loader message="Cargando historias clínicas..." />}

      {!activeQuery.isLoading && activeQuery.isError && (
        <EmptyState
          title="Error al cargar historias clínicas"
          description="No fue posible consultar la información."
        />
      )}

      {!activeQuery.isLoading &&
        !activeQuery.isError &&
        activeQuery.data &&
        activeQuery.data.length > 0 && (
          <HistoriaClinicaTable items={activeQuery.data} />
        )}

      {!activeQuery.isLoading &&
        !activeQuery.isError &&
        activeQuery.data &&
        activeQuery.data.length === 0 && (
          <EmptyState
            title="No hay historias clínicas"
            description="No se encontraron registros para los criterios indicados."
          />
        )}
    </div>
  );
}