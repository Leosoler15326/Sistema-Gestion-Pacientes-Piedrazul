import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import api from '../../../services/api';
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
import { usePacientesPorNombre } from '../../pacientes/hooks/usePacientes';
import { useAuth } from '../../auth/hooks/useAuth';
import { citasService } from '../services/citas.service';

type SearchMode = 'paciente' | 'profesional';

type ProfesionalPerfilDto = {
  profesionalId?: number;
  id?: number;
  nombres?: string;
  nombre?: string;
  especialidad?: string;
};

const hoy = () => new Date().toISOString().split('T')[0];

const finDeAnoActual = () => `${new Date().getFullYear()}-12-31`;

export default function CitasListPage() {
  const { user } = useAuth();
  const normalizedRole = String(user?.rol ?? '').toUpperCase().replace('ROLE_', '');
  const esProfesional = normalizedRole === 'MEDICO_TERAPISTA';
  const esPaciente = normalizedRole === 'PACIENTE';
  const esAdmin = normalizedRole === 'ADMINISTRADOR';
  const esAgendador = normalizedRole === 'AGENDADOR';
  const puedeExportarCsv = esAdmin || esAgendador || esProfesional;

  const [searchParams] = useSearchParams();
  const pacienteIdFromQuery = searchParams.get('pacienteId');
  const location = useLocation();
  const successMessage = (location.state as { successMessage?: string } | null)?.successMessage;

  const [searchMode, setSearchMode] = useState<SearchMode>(
    esProfesional ? 'profesional' : 'paciente'
  );

  const [nombrePaciente, setNombrePaciente] = useState('');
  const [profesionalIdInput, setProfesionalIdInput] = useState('');
  const [fechaDesdeProfesional, setFechaDesdeProfesional] = useState(hoy());
  const [fechaHastaProfesional, setFechaHastaProfesional] = useState(finDeAnoActual());

  const [pacienteId, setPacienteId] = useState<number | undefined>(undefined);
  const [profesionalParams, setProfesionalParams] = useState<
    | {
        profesionalId: number;
        fechaDesde: string;
        fechaHasta?: string;
      }
    | undefined
  >(undefined);

  const [profesionalActualNombre, setProfesionalActualNombre] = useState('');
  const [perfilLoading, setPerfilLoading] = useState(false);
  const [perfilError, setPerfilError] = useState('');

  const [citaIdToCancel, setCitaIdToCancel] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [exportingCsv, setExportingCsv] = useState(false);

  const { data: profesionales } = useProfesionalesActivos();
  const { data: pacientesEncontrados, isLoading: pacientesLoading } =
    usePacientesPorNombre(nombrePaciente);

  useEffect(() => {
    if (pacienteIdFromQuery) {
      setSearchMode('paciente');
      setPacienteId(Number(pacienteIdFromQuery));
    }
  }, [pacienteIdFromQuery]);

  useEffect(() => {
    let cancelled = false;

    const cargarPerfilProfesional = async () => {
      if (!esProfesional || !user?.id) return;

      try {
        setPerfilLoading(true);
        setPerfilError('');

        let data: ProfesionalPerfilDto;

        try {
          const response = await api.get<ProfesionalPerfilDto>('/profesionales/mi-perfil');
          data = response.data;
        } catch {
          const response = await api.get<ProfesionalPerfilDto>(
            `/profesionales/usuario/${user.id}`
          );
          data = response.data;
        }

        if (cancelled) return;

        const resolvedProfesionalId = Number(data.profesionalId ?? data.id ?? 0);
        const fechaHoy = hoy();
        const fechaFinDefault = finDeAnoActual();

        setSearchMode('profesional');
        setProfesionalIdInput(String(resolvedProfesionalId));
        setFechaDesdeProfesional(fechaHoy);
        setFechaHastaProfesional(fechaFinDefault);
        setProfesionalParams({
          profesionalId: resolvedProfesionalId,
          fechaDesde: fechaHoy,
          fechaHasta: fechaFinDefault,
        });
        setProfesionalActualNombre(data.nombres ?? data.nombre ?? user.nombreCompleto ?? '');
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setPerfilError('No fue posible cargar el profesional autenticado.');
        }
      } finally {
        if (!cancelled) {
          setPerfilLoading(false);
        }
      }
    };

    cargarPerfilProfesional();

    return () => {
      cancelled = true;
    };
  }, [esProfesional, user?.id, user?.nombreCompleto]);

  const pacienteSeleccionado = useMemo(() => {
    return pacientesEncontrados?.find((p) => p.id === pacienteId);
  }, [pacientesEncontrados, pacienteId]);

  const pacienteQuery = useCitasPorPaciente(
    searchMode === 'paciente' ? pacienteId : undefined
  );

  const profesionalQuery = useCitasPorProfesional(
    searchMode === 'profesional' ? profesionalParams : undefined
  );

  const cancelMutation = useCancelarCita();
  const activeQuery = searchMode === 'paciente' ? pacienteQuery : profesionalQuery;

  if (esPaciente) {
    return <Navigate to={APP_ROUTES.PACIENTE_MIS_CITAS} replace />;
  }

  const getTargetProfesionalId = () => {
    if (esProfesional) {
      return profesionalParams?.profesionalId || Number(profesionalIdInput);
    }

    return profesionalIdInput.trim() ? Number(profesionalIdInput) : undefined;
  };

  const handleBuscarProfesional = () => {
    setMessage('');

    const targetProfesionalId = getTargetProfesionalId();

    if (!targetProfesionalId) {
      setMessage(
        esProfesional
          ? 'No fue posible identificar el profesional autenticado.'
          : 'Debes seleccionar un profesional.'
      );
      return;
    }

    if (!fechaDesdeProfesional) {
      setMessage('Debes seleccionar la fecha inicial.');
      return;
    }

    const fechaFin = fechaHastaProfesional || fechaDesdeProfesional;

    if (fechaFin < fechaDesdeProfesional) {
      setMessage('La fecha final no puede ser menor que la fecha inicial.');
      return;
    }

    setProfesionalParams({
      profesionalId: targetProfesionalId,
      fechaDesde: fechaDesdeProfesional,
      fechaHasta: fechaFin,
    });
  };

  const handleVerSoloHoy = () => {
    setMessage('');

    const fechaHoy = hoy();
    const targetProfesionalId = getTargetProfesionalId();

    if (!targetProfesionalId) {
      setMessage(
        esProfesional
          ? 'No fue posible identificar el profesional autenticado.'
          : 'Debes seleccionar un profesional.'
      );
      return;
    }

    setFechaDesdeProfesional(fechaHoy);
    setFechaHastaProfesional(fechaHoy);
    setProfesionalParams({
      profesionalId: targetProfesionalId,
      fechaDesde: fechaHoy,
      fechaHasta: fechaHoy,
    });
  };

  const handleVerProximas = () => {
    setMessage('');

    const fechaHoy = hoy();
    const fechaFinDefault = finDeAnoActual();
    const targetProfesionalId = getTargetProfesionalId();

    if (!targetProfesionalId) {
      setMessage(
        esProfesional
          ? 'No fue posible identificar el profesional autenticado.'
          : 'Debes seleccionar un profesional.'
      );
      return;
    }

    setFechaDesdeProfesional(fechaHoy);
    setFechaHastaProfesional(fechaFinDefault);
    setProfesionalParams({
      profesionalId: targetProfesionalId,
      fechaDesde: fechaHoy,
      fechaHasta: fechaFinDefault,
    });
  };

  const handleLimpiar = () => {
    setMessage('');
    setNombrePaciente('');
    setPacienteId(undefined);

    if (esProfesional) {
      const fechaHoy = hoy();
      const fechaFinDefault = finDeAnoActual();
      const targetProfesionalId = getTargetProfesionalId();

      setSearchMode('profesional');
      setFechaDesdeProfesional(fechaHoy);
      setFechaHastaProfesional(fechaFinDefault);

      setProfesionalParams(
        targetProfesionalId
          ? {
              profesionalId: targetProfesionalId,
              fechaDesde: fechaHoy,
              fechaHasta: fechaFinDefault,
            }
          : undefined
      );
      return;
    }

    setProfesionalIdInput('');
    setFechaDesdeProfesional(hoy());
    setFechaHastaProfesional(finDeAnoActual());
    setProfesionalParams(undefined);
  };

  const handleExportarCsvDia = async () => {
    const pid = getTargetProfesionalId();
    if (!pid || !fechaDesdeProfesional) {
      setMessage('Selecciona profesional y fecha inicial para exportar el CSV del día.');
      return;
    }
    try {
      setExportingCsv(true);
      setMessage('');
      const blob = await citasService.exportarCsvProfesionalFecha(
        pid,
        fechaDesdeProfesional
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `citas_${pid}_${fechaDesdeProfesional}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage('No fue posible exportar el CSV.');
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportarCsvTodos = async () => {
    if (!fechaDesdeProfesional) {
      setMessage('Selecciona una fecha para exportar todos los profesionales.');
      return;
    }
    try {
      setExportingCsv(true);
      setMessage('');
      const blob = await citasService.exportarCsvTodosFecha(fechaDesdeProfesional);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `citas_todos_${fechaDesdeProfesional}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage('No fue posible exportar el CSV.');
    } finally {
      setExportingCsv(false);
    }
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Citas"
        subtitle="Consulta y gestiona citas por paciente o por profesional."
        actions={
          <>
            {(esAdmin || esAgendador) && (
              <Link
                to={APP_ROUTES.CITAS_AGENDAR_CONTACTO}
                className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700"
              >
                Agendar contacto
              </Link>
            )}
            <Link
              to={
                searchMode === 'paciente' && pacienteId && pacienteSeleccionado
                  ? `${APP_ROUTES.CITAS_NUEVA}?pacienteId=${pacienteId}&pacienteNombre=${encodeURIComponent(
                      pacienteSeleccionado.nombreCompleto
                    )}`
                  : APP_ROUTES.CITAS_NUEVA
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Nueva cita
            </Link>
          </>
        }
      />

      {successMessage && (
        <div className="mb-4">
          <InlineMessage type="success" message={successMessage} />
        </div>
      )}

      {(message || perfilError) && (
        <div className="mb-4">
          <InlineMessage
            type={(message || perfilError).includes('correctamente') ? 'success' : 'error'}
            message={perfilError || message}
          />
        </div>
      )}

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
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
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Buscar paciente por nombre"
              value={nombrePaciente}
              onChange={(e) => {
                setNombrePaciente(e.target.value);
                setPacienteId(undefined);
                setMessage('');
              }}
              className="w-full rounded-lg border px-3 py-2"
            />

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
                        setMessage('');
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

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleLimpiar}
                className="rounded-lg border border-gray-300 px-4 py-2"
              >
                Limpiar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {esProfesional ? (
                <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-700 md:min-w-[280px]">
                  {perfilLoading
                    ? 'Cargando profesional autenticado...'
                    : profesionalActualNombre || 'Profesional asignado automáticamente'}
                </div>
              ) : (
                <select
                  value={profesionalIdInput}
                  onChange={(e) => setProfesionalIdInput(e.target.value)}
                  className="rounded-lg border px-3 py-2"
                >
                  <option value="">Selecciona un profesional</option>
                  {Array.isArray(profesionales) &&
                    profesionales.map((p: ProfesionalPerfilDto) => (
                      <option
                        key={p.profesionalId ?? p.id}
                        value={p.profesionalId ?? p.id}
                      >
                        {(p.nombres ?? p.nombre ?? 'Profesional')}
                        {p.especialidad ? ` - ${p.especialidad}` : ''}
                      </option>
                    ))}
                </select>
              )}

              <input
                type="date"
                value={fechaDesdeProfesional}
                onChange={(e) => setFechaDesdeProfesional(e.target.value)}
                className="rounded-lg border px-3 py-2"
                title="Fecha inicial"
              />

              <input
                type="date"
                value={fechaHastaProfesional}
                onChange={(e) => setFechaHastaProfesional(e.target.value)}
                className="rounded-lg border px-3 py-2"
                title="Fecha final"
              />

              <button
                type="button"
                onClick={handleBuscarProfesional}
                disabled={esProfesional && perfilLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
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

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleVerProximas}
                className="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50"
              >
                Ver desde hoy en adelante
              </button>

              <button
                type="button"
                onClick={handleVerSoloHoy}
                className="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50"
              >
                Ver solo hoy
              </button>

              {puedeExportarCsv && (
                <>
                  <button
                    type="button"
                    onClick={handleExportarCsvDia}
                    disabled={exportingCsv}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    {exportingCsv ? 'Exportando...' : 'Exportar CSV (un profesional)'}
                  </button>
                  <button
                    type="button"
                    onClick={handleExportarCsvTodos}
                    disabled={exportingCsv}
                    className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm text-green-700 hover:bg-green-50 disabled:opacity-60"
                  >
                    {exportingCsv ? 'Exportando...' : 'Exportar todos los profesionales'}
                  </button>
                </>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Si dejas la fecha final vacía, se tomará la misma fecha inicial. Si eliges ambas
              fechas, se buscará dentro de ese rango.
            </p>
          </div>
        )}
      </div>

      {activeQuery.isLoading && <Loader message="Cargando citas." />}

      {!activeQuery.isLoading &&
        !activeQuery.isError &&
        Array.isArray(activeQuery.data) && (
          <p className="mb-3 text-sm text-slate-600">
            {activeQuery.data.length} cita
            {activeQuery.data.length === 1 ? '' : 's'} en esta consulta.
          </p>
        )}

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
            description={
              searchMode === 'paciente'
                ? 'No se encontraron citas para este paciente.'
                : 'No se encontraron citas para el rango seleccionado.'
            }
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