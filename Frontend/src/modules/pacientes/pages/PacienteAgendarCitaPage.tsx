import { useState, useMemo, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import Loader from '../../../components/common/Loader';
import { APP_ROUTES } from '../../../app/router/routes';
import { ESPECIALIDAD_LABEL, TIPO_ATENCION_LABEL } from '../../../constants/enums';
import { useMiPerfilPaciente } from '../hooks/usePacientes';
import { useProfesionalesActivos } from '../../profesionales/hooks/useprofesionales';
import { useDisponibilidad } from '../../citas/hooks/UseDisponibilidad';
import { useCreateCita, useMisCitasPaciente } from '../../citas/hooks/UseCitas';
import { esFestivoColombia } from '../../../utils/colombianHolidays';
import { configuracionService } from '../../configuracion/services/configuracion.service';

const ESTADOS_PENDIENTES = ['PROGRAMADA', 'CONFIRMADA', 'REAGENDADA'];
const ESTADOS_ATENDIDA = ['ATENDIDA', 'COMPLETADA'];

function getFechaMin(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function getFechaMax(diasAdelante: number): string {
  const d = new Date();
  d.setDate(d.getDate() + diasAdelante);
  return d.toISOString().split('T')[0];
}

function formatearFecha(fechaHora: string): string {
  try {
    const d = new Date(fechaHora);
    return d.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return fechaHora;
  }
}

type ProfesionalItem = {
  profesionalId?: number;
  id?: number;
  nombres?: string;
  nombre?: string;
  especialidad?: string;
};

export default function PacienteAgendarCitaPage() {
  const navigate = useNavigate();
  const { data: perfil, isLoading: perfilLoading } = useMiPerfilPaciente();
  const { data: misCitas, isLoading: citasLoading } = useMisCitasPaciente();
  const { data: configData } = useQuery({
    queryKey: ['config-agendamiento'],
    queryFn: () => configuracionService.obtenerAgendamiento(),
    staleTime: 5 * 60 * 1000,
  });
  const ventanaDias = (configData?.ventanaSemanasAgendar ?? 4) * 7;
  const { data: profesionales } = useProfesionalesActivos();
  const createMutation = useCreateCita();

  const [especialidad, setEspecialidad] = useState('');
  const [profesionalId, setProfesionalId] = useState(0);
  const [fecha, setFecha] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [tipoAtencion, setTipoAtencion] = useState('');
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [message, setMessage] = useState('');
  const [fechaError, setFechaError] = useState('');

  const { data: slots, isLoading: slotsLoading } = useDisponibilidad(
    profesionalId || undefined,
    fecha || undefined
  );

  const citaPendiente = useMemo(
    () => misCitas?.find((c) => ESTADOS_PENDIENTES.includes(c.estado)),
    [misCitas]
  );

  const tienePrimeraVezAtendida = useMemo(
    () => misCitas?.some((c) => ESTADOS_ATENDIDA.includes(c.estado)) ?? false,
    [misCitas]
  );

  const tiposDisponibles = useMemo(() => {
    if (!tienePrimeraVezAtendida) return [];
    return [{ value: 'CONTROL', label: TIPO_ATENCION_LABEL.CONTROL }];
  }, [tienePrimeraVezAtendida]);

  const profesionalesFiltrados = useMemo(
    () =>
      Array.isArray(profesionales)
        ? (profesionales as ProfesionalItem[]).filter((p) =>
            especialidad ? p.especialidad === especialidad : true
          )
        : [],
    [profesionales, especialidad]
  );

  const especialidadesDisponibles = useMemo(() => {
    if (!tienePrimeraVezAtendida) return [];
    const unique = new Set(
      (Array.isArray(profesionales) ? (profesionales as ProfesionalItem[]) : [])
        .map((p) => p.especialidad)
        .filter(Boolean)
    );
    return Array.from(unique) as string[];
  }, [profesionales, tienePrimeraVezAtendida]);

  const handleFechaChange = (valor: string) => {
    setFecha(valor);
    setHoraSeleccionada('');
    setFechaError('');
    setMessage('');

    if (!valor) return;

    const dow = new Date(valor + 'T12:00:00').getDay();
    if (dow === 0) {
      setFechaError('Los domingos no hay atención. Por favor elige otro día.');
      return;
    }
    if (esFestivoColombia(valor)) {
      setFechaError('Este día es festivo en Colombia y no hay atención. Por favor elige otro día.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (citaPendiente) {
      setMessage('Ya tienes una cita pendiente. Espera a que sea atendida antes de agendar otra.');
      return;
    }
    if (!perfil?.id) {
      setMessage('No se encontró tu ficha de paciente.');
      return;
    }
    if (!profesionalId) {
      setMessage('Selecciona un profesional.');
      return;
    }
    if (!fecha || fechaError) {
      setMessage(fechaError || 'Selecciona una fecha válida.');
      return;
    }
    if (tienePrimeraVezAtendida && !tipoAtencion) {
      setMessage('Selecciona el tipo de consulta.');
      return;
    }
    if (!horaSeleccionada) {
      setMessage('Elige un horario disponible de la lista.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        pacienteId: perfil.id,
        profesionalId,
        fechaHora: horaSeleccionada,
        tipoAtencion: tienePrimeraVezAtendida ? tipoAtencion : 'PRIMERA_VEZ',
        motivoConsulta: motivoConsulta.trim() || undefined,
      });
      navigate(APP_ROUTES.PACIENTE_MIS_CITAS, {
        state: { successMessage: '¡Tu cita fue agendada! Te esperamos.' },
      });
    } catch {
      setMessage('No fue posible agendar tu cita. Intenta con otro horario o fecha.');
    }
  };

  if (perfilLoading || citasLoading) {
    return <Loader message="Cargando tu información..." />;
  }

  if (perfil === null) {
    return <Navigate to={APP_ROUTES.PACIENTE_COMPLETAR_PERFIL} replace />;
  }

  if (!perfil) {
    return <Loader message="Cargando tu información..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Agendar cita"
        subtitle="Elige el servicio, el profesional y el horario que más te convenga."
      />

      {citaPendiente && (
        <div className="mb-4 max-w-xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Ya tienes una cita pendiente</p>
          <p className="mt-1">
            Tu cita del <strong>{formatearFecha(citaPendiente.fechaHora)}</strong> está{' '}
            <strong>{citaPendiente.estado.toLowerCase()}</strong>.
            Cuando sea atendida, podrás agendar una nueva.
          </p>
          <Link
            to={APP_ROUTES.PACIENTE_MIS_CITAS}
            className="mt-2 inline-block font-medium text-amber-700 underline"
          >
            Ver mis citas
          </Link>
        </div>
      )}

      {message && (
        <div className="mb-4 max-w-xl">
          <InlineMessage type="error" message={message} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-xl space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6"
      >
        <p className="text-sm text-slate-600">
          Paciente: <strong>{perfil.nombreCompleto}</strong>
        </p>

        {!tienePrimeraVezAtendida && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            Como es tu primera vez, tu cita será una <strong>Consulta General</strong>.
            Después de ser atendido, podrás agendar citas de las demás especialidades.
          </div>
        )}

        {tienePrimeraVezAtendida && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Especialidad <span className="text-slate-400 text-xs">(opcional)</span>
            </label>
            <select
              value={especialidad}
              onChange={(e) => {
                setEspecialidad(e.target.value);
                setProfesionalId(0);
                setHoraSeleccionada('');
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Consulta General</option>
              {especialidadesDisponibles.map((esp) => (
                <option key={esp} value={esp}>
                  {ESPECIALIDAD_LABEL[esp] ?? esp}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Profesional <span className="text-red-500">*</span>
          </label>
          <select
            value={profesionalId ? String(profesionalId) : ''}
            onChange={(e) => {
              setProfesionalId(e.target.value ? Number(e.target.value) : 0);
              setHoraSeleccionada('');
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
          >
            <option value="">Selecciona un profesional</option>
            {profesionalesFiltrados.map((p) => {
              const pId = p.profesionalId ?? p.id;
              const pNombre = p.nombres ?? p.nombre ?? 'Profesional';
              const pEsp = p.especialidad ? ` — ${ESPECIALIDAD_LABEL[p.especialidad] ?? p.especialidad}` : '';
              const pHab = (p as { habilidadesAdicionales?: string }).habilidadesAdicionales
                ? ` (${(p as { habilidadesAdicionales?: string }).habilidadesAdicionales})`
                : '';
              return (
                <option key={pId} value={pId}>
                  {pNombre}{pEsp}{pHab}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Fecha <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={fecha}
            min={getFechaMin()}
            max={getFechaMax(ventanaDias)}
            onChange={(e) => handleFechaChange(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 ${
              fechaError ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'
            }`}
            required
          />
          {fechaError ? (
            <p className="mt-1 text-xs text-red-600">{fechaError}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-400">
              Puedes agendar hasta {configData?.ventanaSemanasAgendar ?? 4} semanas adelante. No se agenda en domingos ni festivos.
            </p>
          )}
        </div>

        {tienePrimeraVezAtendida && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tipo de consulta <span className="text-red-500">*</span>
            </label>
            <select
              value={tipoAtencion}
              onChange={(e) => setTipoAtencion(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">Selecciona</option>
              {tiposDisponibles.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Horarios disponibles <span className="text-red-500">*</span>
          </label>
          {!profesionalId || !fecha || fechaError ? (
            <p className="text-sm text-slate-500">
              Elige el profesional y la fecha para ver los horarios disponibles.
            </p>
          ) : slotsLoading ? (
            <p className="text-sm text-slate-500">Buscando horarios disponibles...</p>
          ) : Array.isArray(slots) && slots.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.fechaHora}
                  type="button"
                  onClick={() => {
                    setHoraSeleccionada(slot.fechaHora);
                    setMessage('');
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    horaSeleccionada === slot.fechaHora
                      ? 'bg-blue-600 text-white shadow'
                      : 'border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {slot.horaFormateada}
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              No hay horarios disponibles para este profesional en esa fecha.
              Por favor elige otro día.
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            ¿Por qué pide la cita? <span className="text-slate-400 text-xs">(opcional)</span>
          </label>
          <textarea
            placeholder="Describe brevemente el motivo de tu consulta..."
            value={motivoConsulta}
            onChange={(e) => setMotivoConsulta(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <p className="text-xs text-slate-400">
          Los campos con <span className="text-red-500">*</span> son obligatorios.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending || Boolean(citaPendiente) || Boolean(fechaError)}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {createMutation.isPending ? 'Agendando...' : 'Confirmar cita'}
          </button>
          <Link
            to={APP_ROUTES.PACIENTE_MIS_CITAS}
            className="rounded-lg border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-50"
          >
            Ver mis citas
          </Link>
        </div>
      </form>
    </div>
  );
}
